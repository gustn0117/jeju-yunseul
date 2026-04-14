"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ROOM_LABELS, ROOM_CAPACITY } from "@/lib/types";

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guests: Number(form.guests),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "예약 신청에 실패했습니다.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    }
  }

  if (status === "done") {
    return (
      <section className="pt-32 md:pt-40 pb-24 md:pb-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-[var(--accent-light)] mb-4">
            Reservation Received
          </p>
          <h1 className="font-serif text-3xl md:text-4xl mb-8 tracking-wide">
            예약 신청이 접수되었습니다
          </h1>
          <p className="text-[15px] opacity-70 leading-relaxed mb-10">
            빠른 시일 내에 010-5452-2323 또는 입력해주신 연락처로 확정 안내를 드리겠습니다.
            감사합니다.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="inline-block border border-[var(--accent)] text-[var(--accent)] px-8 py-3 text-sm tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
            >
              홈으로
            </button>
          </div>
        </div>
      </section>
    );
  }

  const maxGuests = ROOM_CAPACITY[form.room] ?? 6;

  return (
    <section className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-[var(--accent-light)] mb-4">
            Reservation
          </p>
          <h1 className="font-serif text-3xl md:text-5xl tracking-wide mb-4">예약 신청</h1>
          <p className="text-[15px] opacity-70">
            신청 후 확정을 위한 연락을 드립니다. 아래 정보를 입력해주세요.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <Row label="객실 선택" required>
            <select
              value={form.room}
              onChange={(e) => update("room", e.target.value)}
              className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-3 text-[15px] focus:outline-none focus:border-[var(--foreground)]"
            >
              {Object.entries(ROOM_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Row>

          <div className="grid md:grid-cols-2 gap-8">
            <Row label="체크인" required>
              <input
                type="date"
                required
                value={form.check_in}
                onChange={(e) => update("check_in", e.target.value)}
                className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-3 text-[15px] focus:outline-none focus:border-[var(--foreground)]"
              />
            </Row>
            <Row label="체크아웃" required>
              <input
                type="date"
                required
                value={form.check_out}
                onChange={(e) => update("check_out", e.target.value)}
                className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-3 text-[15px] focus:outline-none focus:border-[var(--foreground)]"
              />
            </Row>
          </div>

          <Row label={`인원수 (최대 ${maxGuests}명)`} required>
            <input
              type="number"
              min={1}
              max={maxGuests}
              required
              value={form.guests}
              onChange={(e) => update("guests", Number(e.target.value))}
              className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-3 text-[15px] focus:outline-none focus:border-[var(--foreground)]"
            />
          </Row>

          <div className="grid md:grid-cols-2 gap-8">
            <Row label="성함" required>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-3 text-[15px] focus:outline-none focus:border-[var(--foreground)]"
              />
            </Row>
            <Row label="연락처" required>
              <input
                type="tel"
                required
                placeholder="010-0000-0000"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-3 text-[15px] focus:outline-none focus:border-[var(--foreground)]"
              />
            </Row>
          </div>

          <Row label="이메일 (선택)">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-3 text-[15px] focus:outline-none focus:border-[var(--foreground)]"
            />
          </Row>

          <Row label="요청사항 (선택)">
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-3 text-[15px] focus:outline-none focus:border-[var(--foreground)] resize-none"
            />
          </Row>

          {error && (
            <p className="text-sm text-red-600 border border-red-300 bg-red-50 px-4 py-3 rounded">
              {error}
            </p>
          )}

          <div className="pt-4 flex items-center justify-center">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-block border border-[var(--accent)] text-[var(--accent)] px-10 py-4 text-sm tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "처리 중..." : "예약 신청하기"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Row({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs tracking-[0.2em] uppercase text-[var(--accent-light)] mb-3">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function ReservePage() {
  return (
    <main>
      <Header solid />
      <Suspense fallback={<div className="pt-40 text-center opacity-50">Loading...</div>}>
        <ReserveForm />
      </Suspense>
      <Footer />
    </main>
  );
}
