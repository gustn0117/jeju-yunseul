"use client";

import Link from "next/link";

export default function Footer() {
  const nav = [
    { label: "홈", href: "/#hero" },
    { label: "객실안내", href: "/#rooms" },
    { label: "2F | 2BED", href: "/rooms/2f" },
    { label: "3F | 1BED", href: "/rooms/3f" },
    { label: "4F | 1BED", href: "/rooms/4f" },
    { label: "주변관광지", href: "/attractions" },
    { label: "오시는길", href: "/#directions" },
  ];

  return (
    <footer className="bg-[var(--warm-bg)] py-16 border-t border-[var(--accent-light)]/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <p className="font-serif text-sm opacity-60 leading-relaxed mb-4">
              [윤ː슬] 햇빛이나 달빛에 비치어 반짝이는 잔물결
            </p>
            <p className="text-sm opacity-60 leading-relaxed">
              포근한 햇살을 맞이하며 광치기 해변의 시원한 바람을 온몸으로 느낄수있는 제주 윤슬에 오신것을 환영합니다.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 opacity-80">사업자 정보</h4>
            <div className="space-y-2 text-sm opacity-50">
              <p>상호명: 제주 윤슬</p>
              <p>사업자 정보: 제2023-제주성산-00067호</p>
              <p>사업자 번호: 871-85-02275</p>
              <p>대표자: 윤광준</p>
              <p>예약문의: 010-5452-2323</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 opacity-80">바로가기</h4>
            <div className="space-y-2 text-sm opacity-50">
              {nav.map((item) => (
                <p key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-[var(--accent)] cursor-pointer transition-colors"
                  >
                    {item.label}
                  </Link>
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--accent-light)]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-sm opacity-40">제주 윤슬</p>
          <div className="flex gap-6 text-xs opacity-40">
            <span className="hover:opacity-60 cursor-pointer">이용약관</span>
            <span className="hover:opacity-60 cursor-pointer">개인정보처리방침</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
