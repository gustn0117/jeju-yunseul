import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { PHOTO_BUCKET } from "@/lib/photos";
import { ROOM_SLUGS, type RoomSlug } from "@/lib/types";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room") as RoomSlug | null;

  const sb = supabaseAdmin();
  let query = sb
    .from("room_photos")
    .select("*")
    .order("room", { ascending: true })
    .order("sort_order", { ascending: true });

  if (room && ROOM_SLUGS.includes(room)) {
    query = query.eq("room", room);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ photos: data ?? [] });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "multipart/form-data 가 아닙니다." }, { status: 400 });
  }

  const file = form.get("file");
  const room = String(form.get("room") ?? "") as RoomSlug;

  if (!ROOM_SLUGS.includes(room)) {
    return NextResponse.json({ error: "room 값이 올바르지 않습니다." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 첨부되지 않았습니다." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "빈 파일입니다." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "파일이 10MB를 초과합니다." }, { status: 413 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "JPG / PNG / WEBP / AVIF 만 업로드 가능합니다." },
      { status: 415 },
    );
  }

  const sb = supabaseAdmin();
  const ext = guessExt(file.type, file.name);
  const key = `${room}/${Date.now()}-${randomId()}.${ext}`;

  const { error: upErr } = await sb.storage
    .from(PHOTO_BUCKET)
    .upload(key, file, { contentType: file.type, upsert: false });

  if (upErr) {
    const msg = upErr.message || "스토리지 업로드 실패";
    const hint = /bucket.*not.*found/i.test(msg)
      ? ` (Supabase 대시보드 > Storage > New bucket "${PHOTO_BUCKET}" 를 Public으로 생성 필요)`
      : "";
    return NextResponse.json({ error: msg + hint }, { status: 500 });
  }

  const { data: pub } = sb.storage.from(PHOTO_BUCKET).getPublicUrl(key);
  const publicUrl = pub.publicUrl;

  // sort_order: 해당 room 의 max + 1
  const { data: maxRow } = await sb
    .from("room_photos")
    .select("sort_order")
    .eq("room", room)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? 0) + 1;

  const { data: inserted, error: insErr } = await sb
    .from("room_photos")
    .insert({
      room,
      storage_path: key,
      public_url: publicUrl,
      sort_order: nextOrder,
      filename: file.name,
      is_hero: false,
    })
    .select("*")
    .single();

  if (insErr) {
    // 메타 행 삽입에 실패하면 스토리지 객체도 정리
    await sb.storage.from(PHOTO_BUCKET).remove([key]);
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ photo: inserted }, { status: 201 });
}

function guessExt(mime: string, name: string): string {
  const fromName = name.split(".").pop()?.toLowerCase();
  if (fromName && /^(jpe?g|png|webp|avif)$/.test(fromName)) return fromName === "jpeg" ? "jpg" : fromName;
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/avif") return "avif";
  return "bin";
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}
