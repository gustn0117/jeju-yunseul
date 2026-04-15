"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Reservation, ReservationStatus } from "@/lib/types";
import { ROOM_LABELS, STATUS_LABELS } from "@/lib/types";

type FilterStatus = "all" | ReservationStatus;
type View = "list" | "calendar";

const ROOMS_ORDER: ("2f" | "3f" | "4f")[] = ["2f", "3f", "4f"];

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterRoom, setFilterRoom] = useState<"all" | "2f" | "3f" | "4f">("all");
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<Reservation | null>(null);

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
    setSelected((cur) => (cur && cur.id === id ? { ...cur, status } : cur));
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
    setSelected(null);
  }

  if (authed === null) return <LoadingScreen />;
  if (!authed) return <LoginScreen onSubmit={onLogin} error={error} />;

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
      <header className="bg-white border-b border-[var(--hairline,#e5e5e5)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-serif text-lg tracking-wider">
            제주 윤슬 <span className="opacity-40 text-sm ml-2">어드민</span>
          </h1>
          <div className="flex items-center gap-6">
            <ViewToggle view={view} onChange={setView} />
            <button
              onClick={onLogout}
              className="text-xs tracking-widest uppercase opacity-60 hover:opacity-100"
            >
              Logout
            </button>
          </div>
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

        {view === "list" ? (
          <ListView
            reservations={filtered}
            total={reservations.length}
            loading={loading}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterRoom={filterRoom}
            setFilterRoom={setFilterRoom}
            onRefresh={loadReservations}
            onUpdateStatus={updateStatus}
            onRemove={removeReservation}
          />
        ) : (
          <CalendarView
            reservations={reservations}
            onSelect={(r) => setSelected(r)}
          />
        )}

        <p className="mt-10 text-xs opacity-40">
          객실 라벨:{" "}
          {Object.entries(ROOM_LABELS)
            .map(([k, v]) => `${k.toUpperCase()}=${v}`)
            .join(" · ")}
        </p>
      </section>

      {selected && (
        <DetailModal
          reservation={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={updateStatus}
          onRemove={removeReservation}
        />
      )}
    </main>
  );
}

/* ───── Views ───── */

function ListView(props: {
  reservations: Reservation[];
  total: number;
  loading: boolean;
  filterStatus: FilterStatus;
  setFilterStatus: (s: FilterStatus) => void;
  filterRoom: "all" | "2f" | "3f" | "4f";
  setFilterRoom: (r: "all" | "2f" | "3f" | "4f") => void;
  onRefresh: () => void;
  onUpdateStatus: (id: number, s: ReservationStatus) => void;
  onRemove: (id: number) => void;
}) {
  const {
    reservations,
    total,
    loading,
    filterStatus,
    setFilterStatus,
    filterRoom,
    setFilterRoom,
    onRefresh,
    onUpdateStatus,
    onRemove,
  } = props;

  return (
    <>
      <div className="bg-white border border-[var(--hairline,#e5e5e5)] rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-5 border-b border-[var(--hairline,#e5e5e5)]">
          <span className="text-xs tracking-widest uppercase opacity-50 mr-2">
            Filter
          </span>
          <Pill
            active={filterStatus === "all"}
            onClick={() => setFilterStatus("all")}
          >
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
          {ROOMS_ORDER.map((r) => (
            <Pill
              key={r}
              active={filterRoom === r}
              onClick={() => setFilterRoom(r)}
            >
              {r.toUpperCase()}
            </Pill>
          ))}
          <div className="ml-auto">
            <button
              onClick={onRefresh}
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
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center opacity-50">
                    {loading ? "불러오는 중..." : "해당 조건의 예약이 없습니다."}
                  </td>
                </tr>
              )}
              {reservations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[var(--hairline,#f0f0f0)] align-top"
                >
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
                    {r.email && (
                      <div className="text-xs opacity-60">{r.email}</div>
                    )}
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
                        <ActionBtn onClick={() => onUpdateStatus(r.id, "confirmed")}>
                          확정
                        </ActionBtn>
                      )}
                      {r.status !== "cancelled" && (
                        <ActionBtn onClick={() => onUpdateStatus(r.id, "cancelled")}>
                          취소
                        </ActionBtn>
                      )}
                      {r.status !== "completed" && (
                        <ActionBtn onClick={() => onUpdateStatus(r.id, "completed")}>
                          완료
                        </ActionBtn>
                      )}
                      {r.status !== "pending" && (
                        <ActionBtn onClick={() => onUpdateStatus(r.id, "pending")}>
                          대기로
                        </ActionBtn>
                      )}
                      <ActionBtn onClick={() => onRemove(r.id)} tone="danger">
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
        * 총 {reservations.length}건 표시 중 (전체 {total}건)
      </p>
    </>
  );
}

function CalendarView({
  reservations,
  onSelect,
}: {
  reservations: Reservation[];
  onSelect: (r: Reservation) => void;
}) {
  const [anchor, setAnchor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const daysInMonth = new Date(
    anchor.getFullYear(),
    anchor.getMonth() + 1,
    0
  ).getDate();

  const days = useMemo(
    () =>
      Array.from(
        { length: daysInMonth },
        (_, i) => new Date(anchor.getFullYear(), anchor.getMonth(), i + 1)
      ),
    [anchor, daysInMonth]
  );

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // Group non-cancelled reservations by room, clipped to this month
  const bookingsByRoom = useMemo(() => {
    const map: Record<string, { r: Reservation; start: number; span: number }[]> = {
      "2f": [],
      "3f": [],
      "4f": [],
    };
    const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const monthEnd = new Date(
      anchor.getFullYear(),
      anchor.getMonth(),
      daysInMonth
    );

    for (const r of reservations) {
      if (r.status === "cancelled") continue;
      const ci = new Date(r.check_in + "T00:00:00");
      const co = new Date(r.check_out + "T00:00:00");
      // Overlap this month?
      if (co <= monthStart || ci > monthEnd) continue;
      const visibleStart = ci < monthStart ? monthStart : ci;
      const visibleEndExclusive = co > new Date(monthEnd.getTime() + 86400000) ? new Date(monthEnd.getTime() + 86400000) : co;
      const startDay = visibleStart.getDate();
      const span = Math.round(
        (visibleEndExclusive.getTime() - visibleStart.getTime()) / 86400000
      );
      if (span <= 0) continue;
      map[r.room]?.push({ r, start: startDay, span });
    }
    // sort each room by start day
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.start - b.start);
    }
    return map;
  }, [reservations, anchor, daysInMonth]);

  const monthLabel = `${anchor.getFullYear()}. ${String(anchor.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  const prevMonth = () =>
    setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1));
  const nextMonth = () =>
    setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1));
  const thisMonth = () => {
    const d = new Date();
    setAnchor(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const dayWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // Column size — compact to fit
  const colWidth = 44;
  const rowHeight = 56;

  return (
    <div className="bg-white border border-[var(--hairline,#e5e5e5)] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-[var(--hairline,#e5e5e5)]">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center hover:bg-black/5"
            aria-label="이전 달"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <p className="font-serif text-lg tracking-wider px-3 min-w-[7rem] text-center">
            {monthLabel}
          </p>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center hover:bg-black/5"
            aria-label="다음 달"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <button
            onClick={thisMonth}
            className="ml-3 text-xs tracking-widest uppercase opacity-60 hover:opacity-100"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-4 text-[11px] opacity-80">
          <Legend color="bg-amber-400" label="대기" />
          <Legend color="bg-emerald-500" label="확정" />
          <Legend color="bg-sky-500" label="완료" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="relative"
          style={{ minWidth: `${80 + colWidth * daysInMonth}px` }}
        >
          {/* Day header */}
          <div className="flex border-b border-[var(--hairline,#e5e5e5)] sticky top-0 bg-white">
            <div
              className="flex-none border-r border-[var(--hairline,#e5e5e5)] bg-[#fafafa]"
              style={{ width: 80 }}
            />
            {days.map((d) => {
              const isToday =
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate();
              const isSunday = d.getDay() === 0;
              const isSaturday = d.getDay() === 6;
              return (
                <div
                  key={d.getDate()}
                  className={`flex-none text-center py-3 border-r border-[var(--hairline,#f0f0f0)] ${
                    isToday ? "bg-[var(--foreground)]/5" : ""
                  }`}
                  style={{ width: colWidth }}
                >
                  <div
                    className={`text-xs ${
                      isSunday
                        ? "text-rose-500"
                        : isSaturday
                        ? "text-sky-500"
                        : "opacity-50"
                    }`}
                  >
                    {dayWeek[d.getDay()]}
                  </div>
                  <div
                    className={`font-serif text-sm mt-0.5 tabular-nums ${
                      isToday ? "font-bold" : ""
                    }`}
                  >
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Room rows */}
          {ROOMS_ORDER.map((room) => (
            <div
              key={room}
              className="flex relative border-b border-[var(--hairline,#f0f0f0)] last:border-b-0"
              style={{ height: rowHeight }}
            >
              <div
                className="flex-none border-r border-[var(--hairline,#e5e5e5)] bg-[#fafafa] flex items-center px-4"
                style={{ width: 80 }}
              >
                <div>
                  <p className="font-serif text-sm font-medium">
                    {room.toUpperCase()}
                  </p>
                  <p className="text-[10px] opacity-50 uppercase tracking-wider">
                    {room === "2f" ? "2Bed" : "1Bed"}
                  </p>
                </div>
              </div>

              {/* Day grid (for background weekend shading + today) */}
              <div className="flex absolute top-0 bottom-0" style={{ left: 80, right: 0 }}>
                {days.map((d, i) => {
                  const isToday =
                    d.getFullYear() === today.getFullYear() &&
                    d.getMonth() === today.getMonth() &&
                    d.getDate() === today.getDate();
                  const isSunday = d.getDay() === 0;
                  return (
                    <div
                      key={i}
                      className={`flex-none border-r border-[var(--hairline,#f5f5f5)] ${
                        isToday ? "bg-[var(--foreground)]/5" : ""
                      } ${isSunday ? "bg-rose-50/40" : ""}`}
                      style={{ width: colWidth }}
                    />
                  );
                })}
              </div>

              {/* Booking bars */}
              {bookingsByRoom[room].map(({ r, start, span }, idx) => {
                const left = 80 + (start - 1) * colWidth + 3;
                const width = span * colWidth - 6;
                const statusColor: Record<ReservationStatus, string> = {
                  pending: "bg-amber-100 border-amber-400 text-amber-900",
                  confirmed: "bg-emerald-500 border-emerald-600 text-white",
                  cancelled: "bg-rose-100 border-rose-300 text-rose-700",
                  completed: "bg-sky-100 border-sky-400 text-sky-800",
                };
                return (
                  <button
                    type="button"
                    key={`${r.id}-${idx}`}
                    onClick={() => onSelect(r)}
                    className={`absolute top-2 bottom-2 text-[11px] border-l-2 rounded-sm px-2 flex items-center gap-2 hover:-translate-y-0.5 transition-transform ${statusColor[r.status]}`}
                    style={{ left, width }}
                    title={`${r.name} · ${r.check_in} → ${r.check_out}`}
                  >
                    <span className="font-medium truncate">{r.name}</span>
                    <span className="opacity-70 truncate hidden sm:inline">
                      {r.guests}명
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 text-xs opacity-50 border-t border-[var(--hairline,#e5e5e5)]">
        예약 바를 클릭하면 상세 / 액션 패널이 열립니다. 취소된 예약은 표시되지 않습니다.
      </div>
    </div>
  );
}

/* ───── Detail Modal ───── */

function DetailModal({
  reservation,
  onClose,
  onUpdateStatus,
  onRemove,
}: {
  reservation: Reservation;
  onClose: () => void;
  onUpdateStatus: (id: number, s: ReservationStatus) => void;
  onRemove: (id: number) => void;
}) {
  const r = reservation;
  const nights = Math.round(
    (new Date(r.check_out).getTime() - new Date(r.check_in).getTime()) /
      86400000
  );
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between p-6 border-b border-[var(--hairline,#e5e5e5)]">
          <div>
            <p className="text-[10px] tracking-widest uppercase opacity-50 mb-1">
              Reservation · #{r.id}
            </p>
            <h2 className="font-serif text-2xl tracking-wide">{r.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded"
            aria-label="닫기"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </header>

        <div className="p-6 space-y-5 text-sm">
          <Row k="객실" v={`${r.room.toUpperCase()} — ${ROOM_LABELS[r.room]}`} />
          <Row k="체크인" v={r.check_in} />
          <Row k="체크아웃" v={`${r.check_out} (${nights}박)`} />
          <Row k="인원" v={`${r.guests}명`} />
          <Row k="연락처" v={r.phone} />
          <Row k="이메일" v={r.email || "—"} />
          <Row k="요청사항" v={r.message || "—"} />
          <Row k="접수일" v={formatDateTime(r.created_at)} />
          <Row
            k="상태"
            v={<StatusBadge status={r.status} />}
          />
        </div>

        <footer className="p-6 border-t border-[var(--hairline,#e5e5e5)] bg-[#fafafa]">
          <p className="text-[10px] tracking-widest uppercase opacity-50 mb-3">
            Actions
          </p>
          <div className="flex flex-wrap gap-2">
            {r.status !== "confirmed" && (
              <ActionBtn onClick={() => onUpdateStatus(r.id, "confirmed")}>
                확정
              </ActionBtn>
            )}
            {r.status !== "cancelled" && (
              <ActionBtn onClick={() => onUpdateStatus(r.id, "cancelled")}>
                취소
              </ActionBtn>
            )}
            {r.status !== "completed" && (
              <ActionBtn onClick={() => onUpdateStatus(r.id, "completed")}>
                완료
              </ActionBtn>
            )}
            {r.status !== "pending" && (
              <ActionBtn onClick={() => onUpdateStatus(r.id, "pending")}>
                대기로
              </ActionBtn>
            )}
            <ActionBtn onClick={() => onRemove(r.id)} tone="danger">
              삭제
            </ActionBtn>
            {r.phone && (
              <a
                href={`tel:${r.phone.replace(/-/g, "")}`}
                className="text-[11px] tracking-widest uppercase px-2.5 py-1 border border-[var(--foreground)]/20 hover:border-[var(--foreground)]/60 transition-colors"
              >
                전화
              </a>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 items-start">
      <dt className="text-[11px] tracking-widest uppercase opacity-50 pt-1">{k}</dt>
      <dd className="col-span-2 break-words whitespace-pre-wrap">{v}</dd>
    </div>
  );
}

/* ───── UI helpers ───── */

function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  return (
    <div className="inline-flex border border-[var(--hairline,#e5e5e5)] rounded-sm overflow-hidden">
      <button
        onClick={() => onChange("list")}
        className={`text-[11px] tracking-widest uppercase px-3 py-1.5 transition-colors ${
          view === "list"
            ? "bg-[var(--foreground)] text-white"
            : "opacity-60 hover:opacity-100"
        }`}
      >
        List
      </button>
      <button
        onClick={() => onChange("calendar")}
        className={`text-[11px] tracking-widest uppercase px-3 py-1.5 transition-colors ${
          view === "calendar"
            ? "bg-[var(--foreground)] text-white"
            : "opacity-60 hover:opacity-100"
        }`}
      >
        Calendar
      </button>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block w-2.5 h-2.5 rounded-sm ${color}`} />
      {label}
    </span>
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
