"use client";

import { useState, useMemo, useEffect } from "react";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

type Props = {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (d: string) => void;
  onCheckOutChange: (d: string) => void;
};

export default function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: Props) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [month, setMonth] = useState<Date>(() => {
    const base = parseDate(checkIn) || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [hovered, setHovered] = useState<Date | null>(null);

  const inDate = parseDate(checkIn);
  const outDate = parseDate(checkOut);

  const nights = useMemo(() => {
    if (!inDate || !outDate) return 0;
    const diff = Math.round(
      (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  }, [inDate, outDate]);

  useEffect(() => {
    if (inDate && !outDate) {
      setMonth(new Date(inDate.getFullYear(), inDate.getMonth(), 1));
    }
  }, [checkIn]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleClick(date: Date) {
    if (date < today) return;
    const str = fmt(date);

    if (!checkIn) {
      onCheckInChange(str);
      return;
    }
    if (checkIn && !checkOut) {
      if (inDate && date.getTime() <= inDate.getTime()) {
        onCheckInChange(str);
      } else {
        onCheckOutChange(str);
      }
      return;
    }
    onCheckInChange(str);
    onCheckOutChange("");
  }

  function isInRange(date: Date): boolean {
    if (!inDate) return false;
    const end = outDate || hovered;
    if (!end) return false;
    if (outDate) return date > inDate && date < outDate;
    // hover preview
    if (checkIn && !checkOut && hovered && hovered > inDate) {
      return date > inDate && date < hovered;
    }
    return false;
  }

  function goPrev() {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  }
  function goNext() {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  }

  function reset() {
    onCheckInChange("");
    onCheckOutChange("");
  }

  // Build month grid
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfWeek = new Date(
    month.getFullYear(),
    month.getMonth(),
    1
  ).getDay();

  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(month.getFullYear(), month.getMonth(), d));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const activeSide: "in" | "out" =
    !checkIn || (!!checkIn && !!checkOut) ? "in" : "out";

  const prevDisabled =
    month.getFullYear() === today.getFullYear() &&
    month.getMonth() <= today.getMonth();

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-5">
        <DateCard
          label="Check In"
          date={inDate}
          active={activeSide === "in"}
        />
        <DateCard
          label="Check Out"
          date={outDate}
          active={activeSide === "out"}
          nights={nights}
        />
      </div>

      <div className="border border-[var(--foreground)]/12 bg-white p-4 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={goPrev}
            disabled={prevDisabled}
            className="w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-60 disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="이전 달"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <p className="font-serif text-lg md:text-xl tracking-wide">
            {month.getFullYear()}
            <span className="mx-2 opacity-40">·</span>
            {month.getMonth() + 1}월
          </p>
          <button
            type="button"
            onClick={goNext}
            className="w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-60"
            aria-label="다음 달"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-[10px] tracking-[0.25em] uppercase opacity-50 mb-3">
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={i === 0 ? "text-rose-500/70" : ""}
            >
              {d}
            </div>
          ))}
        </div>

        <div onMouseLeave={() => setHovered(null)}>
          {weeks.map((wk, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {wk.map((date, di) => {
                if (!date) return <div key={di} className="h-11 md:h-12" />;
                const isPast = date < today;
                const isIn = !!inDate && isSameDay(date, inDate);
                const isOut = !!outDate && isSameDay(date, outDate);
                const inRange = isInRange(date);
                const isSunday = di === 0;
                const isToday = isSameDay(date, today);

                return (
                  <button
                    key={di}
                    type="button"
                    onClick={() => handleClick(date)}
                    onMouseEnter={() => !isPast && setHovered(date)}
                    disabled={isPast}
                    className={`relative h-11 md:h-12 text-sm font-serif transition-colors ${
                      isPast
                        ? "opacity-20 cursor-not-allowed"
                        : isIn || isOut
                        ? "bg-[var(--foreground)] text-white font-medium"
                        : inRange
                        ? "bg-[var(--foreground)]/8 text-[var(--foreground)]"
                        : "hover:bg-[var(--foreground)]/6"
                    } ${
                      isSunday && !isPast && !isIn && !isOut ? "text-rose-500" : ""
                    }`}
                  >
                    {date.getDate()}
                    {isToday && !isIn && !isOut && (
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-1.5 w-1 h-1 rounded-full bg-current opacity-40" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-[var(--foreground)]/10 flex items-center justify-between">
          <p className="text-xs opacity-60 tracking-wide">
            {!checkIn
              ? "체크인 날짜를 선택하세요"
              : !checkOut
              ? "체크아웃 날짜를 선택하세요"
              : `총 ${nights}박 · ${formatKo(inDate)} → ${formatKo(outDate)}`}
          </p>
          {(checkIn || checkOut) && (
            <button
              type="button"
              onClick={reset}
              className="text-[11px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity"
            >
              초기화
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DateCard({
  label,
  date,
  active,
  nights,
}: {
  label: string;
  date: Date | null;
  active?: boolean;
  nights?: number;
}) {
  return (
    <div
      className={`p-4 md:p-5 border transition-all duration-300 ${
        active
          ? "border-[var(--foreground)] bg-[var(--foreground)]/[0.02]"
          : "border-[var(--foreground)]/12"
      }`}
    >
      <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2">
        {label}
      </p>
      {date ? (
        <>
          <p className="font-serif text-xl md:text-2xl tracking-wide">
            {date.getMonth() + 1}월 {date.getDate()}일
          </p>
          <p className="text-[11px] opacity-60 mt-1">
            {date.getFullYear()} · {DAYS[date.getDay()]}요일
            {typeof nights === "number" && nights > 0 && (
              <span className="ml-2 text-[var(--foreground)] opacity-80">
                · {nights}박
              </span>
            )}
          </p>
        </>
      ) : (
        <>
          <p className="font-serif text-xl md:text-2xl tracking-wide opacity-35">
            날짜 선택
          </p>
          <p className="text-[11px] opacity-40 mt-1">—</p>
        </>
      )}
    </div>
  );
}

function formatKo(d: Date | null): string {
  if (!d) return "—";
  return `${d.getMonth() + 1}.${d.getDate()}`;
}
