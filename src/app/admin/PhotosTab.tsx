"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ROOM_SLUGS, type RoomPhoto, type RoomSlug } from "@/lib/types";

const ROOM_LABEL: Record<RoomSlug, string> = {
  "2f": "2F 비치테라스",
  "3f": "3F 오션테라스",
  "4f": "4F 스카이테라스",
};

export default function PhotosTab() {
  const [photos, setPhotos] = useState<RoomPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/photos", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "사진 불러오기 실패");
      setPhotos(data.photos as RoomPhoto[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-12">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-5 py-4 text-sm">
          {error}
        </div>
      )}

      {ROOM_SLUGS.map((slug) => (
        <FloorSection
          key={slug}
          room={slug}
          photos={photos.filter((p) => p.room === slug)}
          loading={loading}
          onChanged={load}
          onError={(m) => setError(m)}
        />
      ))}

      <p className="text-xs opacity-50 leading-relaxed">
        · 업로드한 사진은 Supabase Storage 의 <code>room-photos</code> 버킷에 저장됩니다.<br />
        · 대표 사진은 메인 페이지 객실 카드와 객실 상세 페이지 상단에 사용됩니다.<br />
        · 사진은 위에서 아래, 왼쪽에서 오른쪽 순으로 노출됩니다. 화살표로 순서를 조절하세요.<br />
        · 대표 사진은 바로 삭제할 수 없습니다. 다른 사진을 대표로 지정한 뒤 삭제하세요.
      </p>
    </div>
  );
}

function FloorSection({
  room,
  photos,
  loading,
  onChanged,
  onError,
}: {
  room: RoomSlug;
  photos: RoomPhoto[];
  loading: boolean;
  onChanged: () => void;
  onError: (m: string) => void;
}) {
  const hero = photos.find((p) => p.is_hero) ?? null;
  const gallery = photos.filter((p) => !p.is_hero);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("room", room);
        const res = await fetch("/api/admin/photos", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          onError(`${file.name}: ${data.error || "업로드 실패"}`);
        }
      }
      onChanged();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function patch(id: number, body: object): Promise<boolean> {
    const res = await fetch(`/api/admin/photos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      onError(d.error || "변경 실패");
      return false;
    }
    return true;
  }

  async function setHero(id: number) {
    if (await patch(id, { action: "setHero" })) onChanged();
  }

  async function move(id: number, direction: "up" | "down") {
    if (await patch(id, { action: "move", direction })) onChanged();
  }

  async function remove(id: number, filename: string | null) {
    if (!confirm(`"${filename ?? "사진"}" 을 삭제할까요?`)) return;
    const res = await fetch(`/api/admin/photos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      onError(d.error || "삭제 실패");
      return;
    }
    onChanged();
  }

  return (
    <section className="bg-white border border-[var(--hairline,#e5e5e5)] rounded-lg overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 border-b border-[var(--hairline,#e5e5e5)]">
        <div>
          <h2 className="font-serif text-xl tracking-wide">{ROOM_LABEL[room]}</h2>
          <p className="text-xs opacity-50 mt-1">
            {photos.length}장 · 갤러리 {gallery.length}장
          </p>
        </div>
        <label
          className={`inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2.5 border cursor-pointer ${
            uploading
              ? "opacity-40 cursor-wait border-black/20"
              : "border-black/70 hover:bg-black hover:text-white transition-colors"
          }`}
        >
          {uploading ? "업로드 중..." : "사진 추가"}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={onUpload}
          />
        </label>
      </header>

      <div className="p-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <p className="text-[11px] tracking-widest uppercase opacity-50 mb-3">대표 사진</p>
          {hero ? (
            <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden rounded">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.public_url}
                alt={hero.filename ?? "대표 사진"}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-black text-white text-[10px] tracking-widest uppercase px-2 py-1">
                Hero
              </span>
            </div>
          ) : (
            <div className="aspect-[4/3] bg-neutral-100 rounded flex items-center justify-center text-xs opacity-50">
              {loading ? "불러오는 중..." : "대표 사진 없음"}
            </div>
          )}
          <p className="text-xs opacity-50 mt-2 truncate">{hero?.filename ?? "—"}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-[11px] tracking-widest uppercase opacity-50 mb-3">갤러리</p>
          {gallery.length === 0 ? (
            <div className="text-xs opacity-50 py-12 text-center border border-dashed border-neutral-300 rounded">
              {loading ? "불러오는 중..." : "갤러리 사진이 없습니다. 위에서 사진을 추가하세요."}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((p, i) => (
                <PhotoCard
                  key={p.id}
                  photo={p}
                  isFirst={i === 0}
                  isLast={i === gallery.length - 1}
                  onSetHero={() => setHero(p.id)}
                  onMoveUp={() => move(p.id, "up")}
                  onMoveDown={() => move(p.id, "down")}
                  onDelete={() => remove(p.id, p.filename)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PhotoCard({
  photo,
  isFirst,
  isLast,
  onSetHero,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  photo: RoomPhoto;
  isFirst: boolean;
  isLast: boolean;
  onSetHero: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative">
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden rounded">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.public_url}
          alt={photo.filename ?? "사진"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="w-7 h-7 border border-black/15 text-xs disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
            title="앞으로"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="w-7 h-7 border border-black/15 text-xs disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
            title="뒤로"
          >
            ↓
          </button>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onSetHero}
            className="text-[10px] tracking-widest uppercase px-2 py-1 border border-black/15 hover:bg-black hover:text-white transition-colors"
          >
            대표로
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-[10px] tracking-widest uppercase px-2 py-1 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
      {photo.filename && (
        <p className="mt-1 text-[10px] opacity-50 truncate">{photo.filename}</p>
      )}
    </div>
  );
}
