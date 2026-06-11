import { supabaseAdmin } from "@/lib/supabase";
import type { RoomPhoto, RoomSlug } from "@/lib/types";

export const PHOTO_BUCKET = "room-photos";

// 마이그레이션을 아직 적용 못 한 경우를 대비한 기본값. DB가 비었거나 오류여도
// 사이트는 정상 렌더되도록 한다.
// 4F 갤러리: 14, 15, 17 번은 쭈글거리는 침대 컷이라 제외 (2026-06-11)
const FOUR_F_NUMS = Array.from({ length: 42 }, (_, i) => i + 1).filter(
  (n) => ![14, 15, 17].includes(n),
);

const FALLBACK: Record<RoomSlug, { hero: string; gallery: string[] }> = {
  "2f": {
    hero: "/images/room-2f-hero.jpg",
    gallery: [
      ...Array.from({ length: 19 }, (_, i) => `/images/rooms/2f/${String(i + 1).padStart(2, "0")}.jpg`),
      "/images/rooms/common/01.jpg",
      "/images/rooms/common/02.jpg",
      "/images/rooms/common/03.jpg",
    ],
  },
  "3f": {
    hero: "/images/room-3f-hero.jpg",
    gallery: [
      ...Array.from({ length: 34 }, (_, i) => `/images/rooms/3f/${String(i + 1).padStart(2, "0")}.jpg`),
      "/images/rooms/common/01.jpg",
      "/images/rooms/common/02.jpg",
      "/images/rooms/common/03.jpg",
    ],
  },
  "4f": {
    hero: "/images/room-4f-hero.jpg",
    gallery: [
      ...FOUR_F_NUMS.map((n) => `/images/rooms/4f/${String(n).padStart(2, "0")}.jpg`),
      "/images/rooms/common/01.jpg",
      "/images/rooms/common/02.jpg",
      "/images/rooms/common/03.jpg",
    ],
  },
};

export type RoomMedia = {
  hero: string;
  heroId: number | null;
  gallery: RoomPhoto[];
};

export async function getRoomMedia(room: RoomSlug): Promise<RoomMedia> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("room_photos")
      .select("*")
      .eq("room", room)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return {
        hero: FALLBACK[room].hero,
        heroId: null,
        gallery: FALLBACK[room].gallery.map((url, i) => synthFallback(room, url, i)),
      };
    }

    const photos = data as RoomPhoto[];
    const heroRow = photos.find((p) => p.is_hero) ?? photos[0];
    const gallery = photos.filter((p) => !p.is_hero);

    return {
      hero: heroRow?.public_url ?? FALLBACK[room].hero,
      heroId: heroRow?.id ?? null,
      gallery,
    };
  } catch {
    return {
      hero: FALLBACK[room].hero,
      heroId: null,
      gallery: FALLBACK[room].gallery.map((url, i) => synthFallback(room, url, i)),
    };
  }
}

export async function getAllRoomMedia(): Promise<Record<RoomSlug, RoomMedia>> {
  const [twoF, threeF, fourF] = await Promise.all([
    getRoomMedia("2f"),
    getRoomMedia("3f"),
    getRoomMedia("4f"),
  ]);
  return { "2f": twoF, "3f": threeF, "4f": fourF };
}

function synthFallback(room: RoomSlug, url: string, i: number): RoomPhoto {
  return {
    id: -1 - i,
    room,
    storage_path: null,
    public_url: url,
    is_hero: false,
    sort_order: i,
    filename: url.split("/").pop() ?? null,
    created_at: "",
    updated_at: "",
  };
}
