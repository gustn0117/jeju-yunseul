import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "제주 윤슬",
  description: "섭지코지와 성산일출봉 사이, 창 너머의 풍경마저 당신의 휴식이 되는 곳 제주 윤슬.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
