"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImagePlaceholder from "../components/ImagePlaceholder";
import DateRangePicker from "../components/DateRangePicker";
import { ROOM_CAPACITY } from "@/lib/types";

const ROOM_OPTIONS = [
  { slug: "2f", floor: "2F", type: "2 Bed · 2 Bath", capacity: 6, en: "비치테라스" },
  { slug: "3f", floor: "3F", type: "1 Bed · 1 Bath", capacity: 4, en: "오션테라스" },
  { slug: "4f", floor: "4F", type: "1 Bed · 1 Bath", capacity: 3, en: "스카이테라스" },
];

function ReserveForm() {
  const params = useSearchParams();
  const router = useRouter();
  const defaultRoom = params.get("room") || "2f";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    room: defaultRoom,
    check_in: "",
    check_out: "",
    guests: 1,
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = params.get("room");
    if (q && ROOM_CAPACITY[q]) {
      setForm((f) => ({ ...f, room: q, guests: Math.min(f.guests, ROOM_CAPACITY[q]) }));
    }
  }, [params]);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const nights = useMemo(() => {
    if (!form.check_in || !form.check_out) return 0;
    const inD = new Date(form.check_in);
    const outD = new Date(form.check_out);
    const diff = (outD.getTime() - inD.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  }, [form.check_in, form.check_out]);


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guests: Number(form.guests) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "예약 신청에 실패했습니다.");
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    }
  }

  if (status === "done") {
    return (
      <section className="min-h-[80vh] flex items-center justify-center px-6 py-32">
        <div className="max-w-xl text-center">
          <div className="w-16 h-16 mx-auto mb-10 border border-[var(--foreground)]/20 rounded-full flex items-center justify-center">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent-light)] mb-5">
            Reservation Received
          </p>
          <h1 className="font-serif text-3xl md:text-5xl mb-8 tracking-wide leading-tight">
            예약 신청이
            <br />
            접수되었습니다
          </h1>
          <div className="w-12 h-px bg-[var(--foreground)]/30 mx-auto mb-8" />
          <p className="text-[15px] opacity-70 leading-[2] mb-12">
            확정을 위해 빠른 시일 내에
            <br />
            입력해주신 연락처로 안내드리겠습니다.
            <br />
            제주 윤슬을 선택해주셔서 감사합니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-block border border-[var(--accent)] text-[var(--accent)] px-10 py-3.5 text-xs tracking-[0.32em] uppercase hover:bg-[var(--accent)] hover:text-white transition-all duration-500 w-full sm:w-auto"
            >
              홈으로 돌아가기
            </Link>
            <a
              href="tel:010-5452-2323"
              className="inline-block text-sm tracking-widest opacity-70 hover:opacity-100 transition-opacity"
            >
              010-5452-2323
            </a>
          </div>
        </div>
      </section>
    );
  }

  const selectedRoom = ROOM_OPTIONS.find((r) => r.slug === form.room) ?? ROOM_OPTIONS[0];
  const maxGuests = selectedRoom.capacity;

  return (
    <>
      {/* Hero band */}
      <section className="relative h-[42vh] min-h-[320px] flex items-end overflow-hidden">
        <ImagePlaceholder
          className="absolute inset-0 ken-burns"
          showLabel={false}
          src="/images/interior-ocean.jpg"
          alt="제주 윤슬 거실"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/55" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-12 md:pb-16 text-white">
          <p className="text-xs tracking-[0.3em] uppercase opacity-80 mb-3 fade-in-up">
            Reservation
          </p>
          <h1 className="font-serif text-4xl md:text-6xl tracking-wide fade-in-up delay-200">
            예약 신청
          </h1>
        </div>
      </section>

      {/* Main */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 md:gap-16">
          {/* Sidebar */}
          <aside className="md:col-span-4 space-y-10">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent-light)] mb-4">
                Direct Booking
              </p>
              <h2 className="font-serif text-2xl md:text-3xl leading-snug mb-6 tracking-wide">
                창 너머의 풍경마저
                <br />
                당신의 휴식이 되도록.
              </h2>
              <div className="w-10 h-px bg-[var(--foreground)]/40 mb-6" />
              <p className="text-[14px] opacity-70 leading-[2]">
                간단한 정보를 남겨주시면
                <br />
                저희가 직접 확정 안내를 드립니다.
              </p>
            </div>

            <ul className="space-y-5 text-[13px] opacity-80">
              <li className="flex gap-4">
                <span className="font-serif tabular-nums text-xs opacity-50 mt-0.5 w-6">01</span>
                <span>예약 신청 후 24시간 이내 확정 연락드립니다.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-serif tabular-nums text-xs opacity-50 mt-0.5 w-6">02</span>
                <span>체크인 16:00 - 22:00 / 체크아웃 11:00 (4F는 10:00).</span>
              </li>
              <li className="flex gap-4">
                <span className="font-serif tabular-nums text-xs opacity-50 mt-0.5 w-6">03</span>
                <span>주차는 객실당 한 대씩 가능합니다.</span>
              </li>
            </ul>

            <div className="border-t border-[var(--foreground)]/10 pt-8">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent-light)] mb-4">
                Direct Contact
              </p>
              <a
                href="tel:010-5452-2323"
                className="font-serif text-xl md:text-2xl tracking-wide block hover:opacity-60 transition-opacity"
              >
                010-5452-2323
              </a>
              <p className="text-xs opacity-50 mt-2">텍스트 문의만 가능</p>
            </div>
          </aside>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="md:col-span-8 space-y-14"
          >
            {/* Step 1 — Room selection */}
            <Step number="01" title="객실 선택">
              <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
                {ROOM_OPTIONS.map((r) => {
                  const active = form.room === r.slug;
                  return (
                    <button
                      type="button"
                      key={r.slug}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          room: r.slug,
                          guests: Math.min(f.guests, r.capacity),
                        }))
                      }
                      className={`text-left p-5 border transition-all duration-300 ${
                        active
                          ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
                          : "border-[var(--foreground)]/15 hover:border-[var(--foreground)]/50"
                      }`}
                    >
                      <p
                        className={`font-display text-xs tracking-[0.25em] mb-2 ${
                          active ? "opacity-70" : "opacity-50"
                        }`}
                      >
                        {r.en.toUpperCase()}
                      </p>
                      <p className="font-serif text-2xl mb-1">{r.floor}</p>
                      <p
                        className={`text-[11px] tracking-wide ${
                          active ? "opacity-70" : "opacity-60"
                        }`}
                      >
                        {r.type}
                      </p>
                      <p
                        className={`text-[11px] tracking-wide mt-1 ${
                          active ? "opacity-70" : "opacity-60"
                        }`}
                      >
                        최대 {r.capacity}명
                      </p>
                    </button>
                  );
                })}
              </div>
            </Step>

            {/* Step 2 — Schedule */}
            <Step number="02" title="일정 · 인원">
              <DateRangePicker
                checkIn={form.check_in}
                checkOut={form.check_out}
                onCheckInChange={(v) => update("check_in", v)}
                onCheckOutChange={(v) => update("check_out", v)}
              />

              <Field label={`인원수 (최대 ${maxGuests}명)`} required>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => update("guests", Math.max(1, form.guests - 1))}
                    className="w-10 h-10 border border-[var(--foreground)]/20 hover:border-[var(--foreground)] flex items-center justify-center text-lg transition-colors"
                  >
                    −
                  </button>
                  <span className="font-serif text-2xl tabular-nums w-12 text-center">
                    {form.guests}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      update("guests", Math.min(maxGuests, form.guests + 1))
                    }
                    className="w-10 h-10 border border-[var(--foreground)]/20 hover:border-[var(--foreground)] flex items-center justify-center text-lg transition-colors"
                  >
                    +
                  </button>
                  <span className="text-xs opacity-50 ml-2">명</span>
                </div>
              </Field>
            </Step>

            {/* Step 3 — Contact */}
            <Step number="03" title="예약자 정보">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="성함" required>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="luxe-input"
                  />
                </Field>
                <Field label="연락처" required>
                  <input
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="luxe-input"
                  />
                </Field>
              </div>
              <Field label="이메일 (선택)">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="luxe-input"
                />
              </Field>
              <Field label="요청사항 (선택)">
                <textarea
                  rows={4}
                  placeholder="알려주실 사항이 있다면 자유롭게 적어주세요."
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="luxe-input resize-none"
                />
              </Field>
            </Step>

            {/* Summary + submit */}
            <div className="border-t border-[var(--foreground)]/10 pt-10">
              <div className="bg-[var(--warm-bg)] p-6 md:p-8 mb-8">
                <p className="text-xs tracking-[0.25em] uppercase opacity-50 mb-4">
                  Booking Summary
                </p>
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-[13px]">
                  <SummaryItem label="객실" value={`${selectedRoom.floor} · ${selectedRoom.en}`} />
                  <SummaryItem label="체크인" value={form.check_in || "—"} />
                  <SummaryItem label="체크아웃" value={form.check_out || "—"} />
                  <SummaryItem
                    label="기간"
                    value={nights ? `${nights}박` : "—"}
                  />
                  <SummaryItem label="인원" value={`${form.guests}명`} />
                  <SummaryItem label="성함" value={form.name || "—"} />
                  <SummaryItem label="연락처" value={form.phone || "—"} />
                  <SummaryItem label="이메일" value={form.email || "—"} />
                </dl>
              </div>

              {error && (
                <p className="text-sm text-rose-700 border border-rose-200 bg-rose-50 px-5 py-4 mb-6">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                <p className="text-xs opacity-50 leading-relaxed">
                  신청 후 결제·확정 안내를 위해 연락드립니다.
                  <br className="hidden md:block" />
                  실제 결제는 확정 안내 후 진행됩니다.
                </p>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group relative inline-flex items-center justify-center gap-3 border border-[var(--accent)] text-[var(--accent)] px-12 py-4 text-sm tracking-[0.3em] uppercase hover:bg-[var(--accent)] hover:text-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {status === "submitting" ? "처리 중..." : "예약 신청하기"}
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-4 border-b border-[var(--foreground)]/10 pb-4">
        <span className="font-display text-xs tracking-[0.25em] opacity-50">{number}</span>
        <h3 className="font-serif text-xl md:text-2xl tracking-wide">{title}</h3>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-[11px] tracking-[0.25em] uppercase text-[var(--accent-light)] mb-3">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.25em] uppercase opacity-50 mb-1">{label}</dt>
      <dd className="font-serif truncate">{value}</dd>
    </div>
  );
}

export default function ReservePage() {
  return (
    <main>
      <Header solid />
      <Suspense
        fallback={
          <div className="pt-40 text-center opacity-50 min-h-[60vh]">Loading...</div>
        }
      >
        <ReserveForm />
      </Suspense>
      <Footer />
    </main>
  );
}
