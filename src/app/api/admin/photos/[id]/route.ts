import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { PHOTO_BUCKET } from "@/lib/photos";

type Action = "setHero" | "move" | "rename";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "id 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const body = (await req.json()) as { action?: Action; direction?: "up" | "down"; filename?: string };
  const sb = supabaseAdmin();

  const { data: target, error: getErr } = await sb
    .from("room_photos")
    .select("*")
    .eq("id", id)
    .single();
  if (getErr || !target) {
    return NextResponse.json({ error: "사진을 찾을 수 없습니다." }, { status: 404 });
  }

  if (body.action === "setHero") {
    // 1) 같은 room 의 기존 hero 해제
    const { error: clearErr } = await sb
      .from("room_photos")
      .update({ is_hero: false })
      .eq("room", target.room)
      .eq("is_hero", true);
    if (clearErr) {
      return NextResponse.json({ error: clearErr.message }, { status: 500 });
    }
    // 2) 대상 → hero
    const { data: updated, error: setErr } = await sb
      .from("room_photos")
      .update({ is_hero: true })
      .eq("id", id)
      .select("*")
      .single();
    if (setErr) {
      return NextResponse.json({ error: setErr.message }, { status: 500 });
    }
    return NextResponse.json({ photo: updated });
  }

  if (body.action === "move" && (body.direction === "up" || body.direction === "down")) {
    const dir = body.direction;
    const cmp = dir === "up" ? "lt" : "gt";
    const ord = dir === "up" ? false : true; // up: lt + 내림차순, down: gt + 오름차순

    const { data: neighbor } = await sb
      .from("room_photos")
      .select("*")
      .eq("room", target.room)
      .filter("sort_order", cmp, target.sort_order)
      .order("sort_order", { ascending: ord })
      .limit(1)
      .maybeSingle();

    if (!neighbor) {
      return NextResponse.json({ photo: target }); // 이미 끝
    }

    // 두 행의 sort_order 교환
    const a = target.sort_order;
    const b = neighbor.sort_order;
    const tmp = -Math.abs(a) - Math.abs(b) - 1; // 임시값(유일)
    await sb.from("room_photos").update({ sort_order: tmp }).eq("id", target.id);
    await sb.from("room_photos").update({ sort_order: a }).eq("id", neighbor.id);
    await sb.from("room_photos").update({ sort_order: b }).eq("id", target.id);

    const { data: refreshed } = await sb.from("room_photos").select("*").eq("id", id).single();
    return NextResponse.json({ photo: refreshed });
  }

  if (body.action === "rename" && typeof body.filename === "string") {
    const { data: renamed, error: rErr } = await sb
      .from("room_photos")
      .update({ filename: body.filename.slice(0, 200) })
      .eq("id", id)
      .select("*")
      .single();
    if (rErr) {
      return NextResponse.json({ error: rErr.message }, { status: 500 });
    }
    return NextResponse.json({ photo: renamed });
  }

  return NextResponse.json({ error: "action 이 올바르지 않습니다." }, { status: 400 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "id 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data: row } = await sb
    .from("room_photos")
    .select("storage_path,is_hero")
    .eq("id", id)
    .single();

  if (row?.is_hero) {
    return NextResponse.json(
      { error: "대표 사진은 삭제할 수 없습니다. 다른 사진을 먼저 대표로 지정하세요." },
      { status: 400 },
    );
  }

  const { error: delErr } = await sb.from("room_photos").delete().eq("id", id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  // 스토리지 객체도 정리 (시드 데이터는 storage_path=null 이라 스킵됨)
  if (row?.storage_path) {
    await sb.storage.from(PHOTO_BUCKET).remove([row.storage_path]);
  }
  return NextResponse.json({ ok: true });
}
