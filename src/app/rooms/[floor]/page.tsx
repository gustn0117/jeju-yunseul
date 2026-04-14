"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ImagePlaceholder from "../../components/ImagePlaceholder";
import { BedIcon, BathIcon, PersonIcon, ClockIcon } from "../../components/Icons";

type Season = "비수기" | "일반기" | "성수기";
type Price = { weekday: string; weekend: string };

type Room = {
  floor: string;
  tag: string;
  title: string;
  description: string[];
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  amenities: string[];
  checkIn: string;
  checkOut: string;
  prices: Record<Season, Price> | null;
  heroLabel: string;
};

const ROOMS: Record<string, Room> = {
  "2f": {
    floor: "2F",
    tag: "2BED",
    title: "2F | 2BED",
    description: [
      "2F는 윤슬의 가장 넓고 쾌적한 유닛이므로 6명까지 지낼 수 있는 공간입니다.",
      "거실과 주방을 둘러싸는 통유리 너머로 보이는 바다와 성산 일출봉을 마음껏 감상할 수 있고 주방 바깥으로 나갈 수 있는 테라스에서 바로 광치기 해변으로 걸어 나갈 수 있습니다.",
      "두 개의 침실과 화장실을 갖추어 여러 명이 함께 편안하게 머물 수 있고 프로젝터와 고급 음향 기기와 함께 최상의 낭만을 경험하게 될 것입니다.",
      "최고급 어메니티와 제주의 절경을 보시면서 스트레스를 풀어보세요.",
    ],
    bedrooms: 2,
    bathrooms: 2,
    capacity: 6,
    amenities: [
      "프로젝터 & 고급 음향 기기",
      "취사도구",
      "최고급 타월",
      "샴푸/린스, 세면도구",
      "스타벅스 캡슐커피",
    ],
    checkIn: "16:00 - 22:00",
    checkOut: "11:00",
    prices: {
      비수기: { weekday: "300,000원", weekend: "320,000원" },
      일반기: { weekday: "350,000원", weekend: "370,000원" },
      성수기: { weekday: "370,000원", weekend: "390,000원" },
    },
    heroLabel: "2F 객실",
  },
  "3f": {
    floor: "3F",
    tag: "1BED",
    title: "3F | 1BED",
    description: [
      "3F는 최대 4명까지 머물 수 있는 편안한 공간입니다.",
      "넓은 거실에서 한눈에 넓은 바다를 품고 일출봉을 바라보는 쾌적한 독립공간이며 야외 테라스도 있어서 바베큐 하면서 제주의 자연을 마음껏 즐길 수 있습니다.",
      "고급스럽고 산뜻한 실내 인테리어와 최상 스마트 TV, Marshall 스피커로 더욱 편안함을 경험하게 될 것입니다.",
      "최고급 어메니티와 제주의 절경을 감상하면서 스트레스를 풀어보세요.",
    ],
    bedrooms: 1,
    bathrooms: 1,
    capacity: 4,
    amenities: [
      "최신형 스마트 TV와 Marshall 스피커",
      "취사도구",
      "최고급 타월",
      "샴푸/린스, 세면도구",
      "스타벅스 캡슐커피",
    ],
    checkIn: "16:00 - 22:00",
    checkOut: "11:00",
    prices: {
      비수기: { weekday: "210,000원", weekend: "230,000원" },
      일반기: { weekday: "240,000원", weekend: "260,000원" },
      성수기: { weekday: "270,000원", weekend: "290,000원" },
    },
    heroLabel: "3F 객실",
  },
  "4f": {
    floor: "4F",
    tag: "1BED",
    title: "4F | 1BED",
    description: [
      "4F는 최대 3명이 머물 수 있는 편안한 공간입니다.",
      "아늑한 거실에서 탁 트인 바다와 성산 일출봉을 더욱 시원하게 느낄 수 있고 넓은 야외 테라스도 있어서 바베큐 하면서 제주의 자연을 마음껏 즐길 수 있습니다.",
      "고급스럽고 산뜻한 실내 인테리어와 최상 스마트 TV로 더욱 편안함을 경험하게 될 것입니다.",
      "최고급 어메니티와 제주의 절경을 감상하면서 스트레스를 풀어보세요.",
    ],
    bedrooms: 1,
    bathrooms: 1,
    capacity: 3,
    amenities: [
      "최신형 스마트 TV",
      "넓은 2인 욕조",
      "취사도구",
      "최고급 타월",
      "샴푸/린스, 세면도구",
      "스타벅스 캡슐커피",
    ],
    checkIn: "16:00 - 22:00",
    checkOut: "10:00",
    prices: null,
    heroLabel: "4F 객실",
  },
};

const FLOOR_ORDER: { key: string; label: string }[] = [
  { key: "2f", label: "2F | 2BED" },
  { key: "3f", label: "3F | 1BED" },
  { key: "4f", label: "4F | 1BED" },
];

export default function RoomDetail({
  params,
}: {
  params: Promise<{ floor: string }>;
}) {
  const { floor } = use(params);
  const key = floor.toLowerCase();
  const room = ROOMS[key];
  if (!room) notFound();

  return (
    <main>
      <Header solid />

      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-serif text-3xl md:text-4xl text-center mb-10 tracking-wide">
            객실안내
          </h1>
          <nav className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            {FLOOR_ORDER.map((f) => {
              const active = f.key === key;
              return (
                <Link
                  key={f.key}
                  href={`/rooms/${f.key}`}
                  className={`px-5 md:px-6 py-2.5 text-sm tracking-wide border transition-all duration-300 ${
                    active
                      ? "bg-[var(--foreground)] text-white border-[var(--foreground)]"
                      : "border-[var(--foreground)]/20 text-[var(--foreground)]/70 hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {f.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <ImagePlaceholder
            src="/images/interior-ocean.jpg"
            alt={room.heroLabel}
            priority
            className="h-[400px] md:h-[520px] rounded-lg scale-in hover-zoom"
          />
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 md:gap-16">
          <div className="md:col-span-2">
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--accent-light)] mb-4">
              Room Detail
            </p>
            <h2 className="font-serif text-2xl md:text-3xl mb-8 tracking-wide">
              {room.title}
            </h2>
            <div className="space-y-5">
              {room.description.map((p, i) => (
                <p key={i} className="text-[15px] leading-[1.9] text-[var(--foreground)]/80">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="bg-[var(--warm-bg)] p-8 rounded-lg">
              <h3 className="font-serif text-lg mb-6 tracking-wide">객실 정보</h3>
              <dl className="space-y-4 text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--foreground)]/10">
                  <dt className="flex items-center gap-2.5 opacity-70">
                    <BedIcon /> 침실
                  </dt>
                  <dd>{room.bedrooms}</dd>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[var(--foreground)]/10">
                  <dt className="flex items-center gap-2.5 opacity-70">
                    <BathIcon /> 화장실
                  </dt>
                  <dd>{room.bathrooms}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2.5 opacity-70">
                    <PersonIcon /> 최대 인원수
                  </dt>
                  <dd>{room.capacity}명</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section className="pb-20 md:pb-28 bg-[var(--warm-bg)] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--accent-light)] mb-4">
              Amenities
            </p>
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide">
              어메니티
            </h2>
          </div>
          <ul className="md:col-span-2 grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {room.amenities.map((a) => (
              <li
                key={a}
                className="flex items-start gap-3 text-[15px] text-[var(--foreground)]/80 border-b border-[var(--foreground)]/10 pb-4"
              >
                <span className="opacity-40">—</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--accent-light)] mb-4">
              Policy
            </p>
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide">
              이용 정책
            </h2>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
            <div className="border-t border-[var(--foreground)]/20 pt-6">
              <p className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase opacity-50 mb-2">
                <ClockIcon className="w-3.5 h-3.5" /> Check-in
              </p>
              <p className="font-serif text-xl">{room.checkIn}</p>
            </div>
            <div className="border-t border-[var(--foreground)]/20 pt-6">
              <p className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase opacity-50 mb-2">
                <ClockIcon className="w-3.5 h-3.5" /> Check-out
              </p>
              <p className="font-serif text-xl">{room.checkOut}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-[var(--dark-bg)] text-[var(--dark-text)] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 md:gap-16 mb-12">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase opacity-50 mb-4">
                Rate
              </p>
              <h2 className="font-serif text-2xl md:text-3xl tracking-wide">
                가격
              </h2>
            </div>
            <div className="md:col-span-2">
              {room.prices ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-4 px-2 font-serif text-sm opacity-60 tracking-wide"></th>
                        <th className="text-right py-4 px-2 font-serif text-sm opacity-60 tracking-wide">
                          비수기
                        </th>
                        <th className="text-right py-4 px-2 font-serif text-sm opacity-60 tracking-wide">
                          일반기
                        </th>
                        <th className="text-right py-4 px-2 font-serif text-sm opacity-60 tracking-wide">
                          성수기
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="py-5 px-2 text-sm opacity-80">평일</td>
                        <td className="text-right py-5 px-2 text-sm">
                          {room.prices.비수기.weekday}
                        </td>
                        <td className="text-right py-5 px-2 text-sm">
                          {room.prices.일반기.weekday}
                        </td>
                        <td className="text-right py-5 px-2 text-sm">
                          {room.prices.성수기.weekday}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-5 px-2 text-sm opacity-80">주말</td>
                        <td className="text-right py-5 px-2 text-sm">
                          {room.prices.비수기.weekend}
                        </td>
                        <td className="text-right py-5 px-2 text-sm">
                          {room.prices.일반기.weekend}
                        </td>
                        <td className="text-right py-5 px-2 text-sm">
                          {room.prices.성수기.weekend}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm opacity-70 leading-relaxed">
                  가격 문의: <span className="font-medium">010-5452-2323</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
