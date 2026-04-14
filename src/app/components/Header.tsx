"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(solid);

  useEffect(() => {
    if (solid) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  const nav = [
    { label: "홈", href: "/#hero" },
    { label: "객실안내", href: "/#rooms" },
    { label: "주변관광지", href: "/attractions" },
    { label: "오시는길", href: "/#directions" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className={`font-serif text-lg tracking-wider transition-colors ${
            scrolled ? "text-[var(--foreground)]" : "text-white"
          }`}
        >
          제주 윤슬
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm tracking-wide transition-colors hover:opacity-70 ${
                scrolled ? "text-[var(--foreground)]" : "text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
