"use client";

import { useState, useEffect, useCallback } from "react";
import type { Reservation, ReservationStatus } from "@/lib/types";
import { ROOM_LABELS, STATUS_LABELS } from "@/lib/types";

type FilterStatus = "all" | ReservationStatus;

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterRoom, setFilterRoom] = useState<"all" | "2f" | "3f" | "4f">("all");
  const [error, setError] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reservations", { cache: "no-store" });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "불러오기 실패");
      setReservations(data.reservations);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "로그인 실패");
      return;
    }
    await loadReservations();
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setReservations([]);
  }

  async function updateStatus(id: number, status: ReservationStatus) {
    const res = await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "업데이트 실패");
      return;
    }
    setReservations((list) =>
      list.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  async function removeReservation(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "삭제 실패");
      return;
    }
    setReservations((list) => list.filter((r) => r.id !== id));
  }

  if (authed === null) {
    return <LoadingScreen />;
  }

  if (!authed) {
    return <LoginScreen onSubmit={onLogin} error={error} />;
  }

  const filtered = reservations.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterRoom !== "all" && r.room !== filterRoom) return false;
    return true;
  });

  const counts = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
    completed: reservations.filter((r) => r.status === "completed").length,
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-[var(--hairline,#e5e5e5)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-serif text-lg tracking-wider">
            제주 윤슬 <span className="opacity-40 text-sm ml-2">어드민</span>
          </h1>
          <button
            onClick={onLogout}
            className="text-xs tracking-widest uppercase opacity-60 hover:opacity-100"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <Stat label="전체" value={counts.total} />
          <Stat label="대기" value={counts.pending} tone="amber" />
          <Stat label="확정" value={counts.confirmed} tone="green" />
          <Stat label="취소" value={counts.cancelled} tone="red" />
          <Stat label="완료" value={counts.completed} tone="blue" />
        </div>

        <div className="bg-white border border-[var(--hairline,#e5e5e5)] rounded-lg overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 p-5 border-b border-[var(--hairline,#e5e5e5)]">
            <span className="text-xs tracking-widest uppercase opacity-50 mr-2">
              Filter
            </span>
            <Pill active={filterStatus === "all"} onClick={() => setFilterStatus("all")}>
              전체
            </Pill>
            {(["pending", "confirmed", "cancelled", "completed"] as ReservationStatus[]).map(
              (s) => (
                <Pill
                  key={s}
                  active={filterStatus === s}
                  onClick={() => setFilterStatus(s)}
                >
                  {STATUS_LABELS[s]}
                </Pill>
              )
            )}
            <span className="mx-2 w-px h-5 bg-[var(--hairline,#e5e5e5)]" />
            <Pill active={filterRoom === "all"} onClick={() => setFilterRoom("all")}>
              전 객실
            </Pill>
            {(["2f", "3f", "4f"] as const).map((r) => (
              <Pill key={r} active={filterRoom === r} onClick={() => setFilterRoom(r)}>
                {r.toUpperCase()}
              </Pill>
            ))}
            <div className="ml-auto">
              <button
                onClick={loadReservations}
                disabled={loading}
                className="text-xs tracking-widest uppercase opacity-60 hover:opacity-100 disabled:opacity-30"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs tracking-widest uppercase opacity-50 border-b border-[var(--hairline,#e5e5e5)]">
                  <th className="px-5 py-4">접수일</th>
                  <th className="px-5 py-4">객실</th>
                  <th className="px-5 py-4">체크인 · 체크아웃</th>
                  <th className="px-5 py-4">인원</th>
                  <th className="px-5 py-4">성함 / 연락처</th>
                  <th className="px-5 py-4">메시지</th>
                  <th className="px-5 py-4">상태</th>
                  <th className="px-5 py-4 text-right">액션</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center opacity-50">
                      {loading ? "불러오는 중..." : "해당 조건의 예약이 없습니다."}
                    </td>
                  </tr>
                )}
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--hairline,#f0f0f0)] align-top">
                    <td className="px-5 py-5 whitespace-nowrap opacity-70">
                      {formatDateTime(r.created_at)}
                    </td>
                    <td className="px-5 py-5 font-medium whitespace-nowrap">
                      {r.room.toUpperCase()}
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div>{r.check_in}</div>
                      <div className="text-xs opacity-60">→ {r.check_out}</div>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">{r.guests}명</td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs opacity-60">{r.phone}</div>
                      {r.email && <div className="text-xs opacity-60">{r.email}</div>}
                    </td>
                    <td className="px-5 py-5 max-w-xs">
                      <div className="text-xs opacity-70 whitespace-pre-wrap break-words">
                        {r.message || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap text-right">
                      <div className="inline-flex flex-wrap gap-1 justify-end">
                        {r.status !== "confirmed" && (
                          <ActionBtn onClick={() => updateStatus(r.id, "confirmed")}>
                            확정
                          </ActionBtn>
                        )}
                        {r.status !== "cancelled" && (
                          <ActionBtn onClick={() => updateStatus(r.id, "cancelled")}>
                            취소
                          </ActionBtn>
                        )}
                        {r.status !== "completed" && (
                          <ActionBtn onClick={() => updateStatus(r.id, "completed")}>
                            완료
                          </ActionBtn>
                        )}
                        {r.status !== "pending" && (
                          <ActionBtn onClick={() => updateStatus(r.id, "pending")}>
                            대기로
                          </ActionBtn>
                        )}
                        <ActionBtn
                          onClick={() => removeReservation(r.id)}
                          tone="danger"
                        >
                          삭제
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-xs opacity-40">
          * 총 {filtered.length}건 표시 중 (전체 {reservations.length}건)
        </p>

        <p className="mt-10 text-xs opacity-40">
          객실 라벨: {Object.entries(ROOM_LABELS).map(([k, v]) => `${k.toUpperCase()}=${v}`).join(" · ")}
        </p>
      </section>
    </main>
  );
}

function LoadingScreen() {
  return (
    <main className="min-h-screen flex items-center justify-center text-sm opacity-50">
      Loading…
    </main>
  );
}

function LoginScreen({
  onSubmit,
  error,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <p className="text-xs tracking-[0.25em] uppercase opacity-50 mb-4 text-center">
          Admin
        </p>
        <h1 className="font-serif text-3xl text-center mb-10 tracking-wide">
          제주 윤슬
        </h1>
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-3 text-center text-[15px] focus:outline-none focus:border-[var(--foreground)] mb-4"
        />
        {error && <p className="text-sm text-red-600 text-center mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full border border-[var(--accent)] text-[var(--accent)] py-3 text-sm tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
        >
          로그인
        </button>
      </form>
    </main>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "amber" | "green" | "red" | "blue";
}) {
  const colors: Record<string, string> = {
    default: "text-[var(--foreground)]",
    amber: "text-amber-600",
    green: "text-emerald-600",
    red: "text-rose-600",
    blue: "text-sky-600",
  };
  return (
    <div className="bg-white border border-[var(--hairline,#e5e5e5)] rounded-lg p-5">
      <p className="text-xs tracking-widest uppercase opacity-50 mb-2">{label}</p>
      <p className={`font-serif text-3xl ${colors[tone]}`}>{value}</p>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors ${
        active
          ? "bg-[var(--foreground)] text-white border-[var(--foreground)]"
          : "border-[var(--foreground)]/20 opacity-60 hover:opacity-100 hover:border-[var(--foreground)]/50"
      }`}
    >
      {children}
    </button>
  );
}

function ActionBtn({
  onClick,
  tone = "default",
  children,
}: {
  onClick: () => void;
  tone?: "default" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] tracking-widest uppercase px-2.5 py-1 border transition-colors ${
        tone === "danger"
          ? "border-rose-300 text-rose-600 hover:bg-rose-50"
          : "border-[var(--foreground)]/20 hover:border-[var(--foreground)]/60"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const tone: Record<ReservationStatus, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    completed: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return (
    <span
      className={`inline-block text-[11px] tracking-widest uppercase px-2.5 py-1 border ${tone[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
}
