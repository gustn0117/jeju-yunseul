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
  name: string;
  title: string;
  description: string[];
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  amenities: string[];
  recommend: string[];
  checkIn: string;
  checkOut: string;
  prices: Record<Season, Price> | null;
  heroLabel: string;
};

const ROOMS: Record<string, Room> = {
  "2f": {
    floor: "2F",
    tag: "2BED",
    name: "비치테라스",
    title: "2F 비치테라스",
    description: [
      "성산일출봉과 제주 바다가 한눈에 펼쳐지는 제주윤슬의 2층 객실 비치테라스. 넓은 공간과 탁 트인 오션뷰 덕분에 가족 여행객 혹은 단체 여행객들에게 가장 인기가 높은 객실입니다.",
      "비치테라스 거실에서는 탁 트인 통유리로 제주 바다를 한눈에 볼 수 있으며, 프리미엄 가구와 모던한 인테리어가 어우러져 여러 명이 함께 머무르기에도 충분한 공간입니다.",
      "4~6인 가족 또는 단체 여행객이 머물 수 있도록 2개의 침실로 구성되어 있으며, 바다가 내려다보이는 작은방과 욕조가 있는 화장실을 품은 큰방까지 어디에서 머물든 내 집 같은 편안함을 느끼실 수 있습니다.",
      "통창 오션뷰와 개별 테라스에서 즐기는 오션뷰 바베큐는 물론, 저녁 무렵엔 붉게 물드는 바다를 바라보며 여유롭게 와인 한 잔을 즐겨보시는 것도 추천드립니다.",
    ],
    bedrooms: 2,
    bathrooms: 2,
    capacity: 6,
    amenities: [
      "대형 TV",
      "블루투스 스피커",
      "캡슐 커피머신",
      "전자레인지 & 밥솥",
      "냉장고 & 전기포트",
      "세탁기",
      "식기류 & 조리도구",
      "호텔식 침구",
      "욕조 (큰방)",
      "개별 바베큐 시설",
      "샴푸/컨디셔너/바디워시/폼클렌저",
      "드라이기/치약/핸드워시",
    ],
    recommend: [
      "제주 오션뷰 숙소를 찾으시는 분",
      "프라이빗한 힐링을 즐기고 싶은 우정 여행객",
      "제주의 일출을 즐기고 싶은 여행객",
      "제주 동쪽 여행에 최적화된 숙소를 찾고 계시는 분",
    ],
    checkIn: "16:00 - 22:00",
    checkOut: "11:00",
    prices: {
      비수기: { weekday: "300,000원", weekend: "320,000원" },
      일반기: { weekday: "350,000원", weekend: "370,000원" },
      성수기: { weekday: "370,000원", weekend: "390,000원" },
    },
    heroLabel: "2F 비치테라스",
  },
  "3f": {
    floor: "3F",
    tag: "1BED",
    name: "오션테라스",
    title: "3F 오션테라스",
    description: [
      "성산일출봉과 제주 바다가 더욱 가까워지는 제주윤슬의 3층 객실 오션테라스. 통창 너머로 펼쳐지는 시원한 오션뷰와 프라이빗한 휴식이 가능한 개별 테라스 덕분에 연인, 소가족, 감성 여행객분들이 가장 선호하시는 객실입니다.",
      "오션테라스의 거실은 높은 층고와 통창 구조 덕분에 제주 바다가 한층 더 가까이 느껴지는 공간입니다. 모던한 인테리어와 프리미엄 가구가 더해져 여유롭고 세련된 분위기 속에서 편안한 휴식을 즐길 수 있습니다.",
      "2~4인 여행객이 머무르기 가장 좋은 구조로, 퀸사이즈 침대와 뽀송한 호텔식 침구, 행거와 수납장까지 준비되어 있어 여행 내내 내 집처럼 편안하게 쉴 수 있는 공간입니다.",
      "테라스로 나가면 탁 트인 제주 바다와 성산일출봉의 실루엣이 눈앞에 펼쳐지며, 저녁 무렵 붉게 물드는 바다와 함께 프라이빗한 바베큐를 즐길 수 있습니다.",
    ],
    bedrooms: 1,
    bathrooms: 1,
    capacity: 4,
    amenities: [
      "대형 TV",
      "블루투스 스피커",
      "캡슐 커피머신",
      "전자레인지 & 밥솥",
      "냉장고 & 전기포트",
      "세탁기",
      "식기류 & 조리도구",
      "퀸사이즈 침대 & 호텔식 침구",
      "개별 바베큐 시설",
      "샴푸/컨디셔너/바디워시/폼클렌저",
      "드라이기/치약/핸드워시",
    ],
    recommend: [
      "감성 오션뷰 숙소를 찾는 커플",
      "바라만 봐도 힐링되는 뷰와 함께 워케이션을 즐기고 싶으신 분",
      "제주의 여유를 오롯이 즐기고 싶은 일주일살기, 한달살기 여행객",
      "제주 동쪽 여행에 최적화된 숙소를 찾고 계시는 분",
    ],
    checkIn: "16:00 - 22:00",
    checkOut: "11:00",
    prices: {
      비수기: { weekday: "210,000원", weekend: "230,000원" },
      일반기: { weekday: "240,000원", weekend: "260,000원" },
      성수기: { weekday: "270,000원", weekend: "290,000원" },
    },
    heroLabel: "3F 오션테라스",
  },
  "4f": {
    floor: "4F",
    tag: "1BED",
    name: "스카이테라스",
    title: "4F 스카이테라스",
    description: [
      "제주 바다 위로 시원하게 펼쳐진 하늘과 성산일출봉까지 한눈에 담을 수 있는 제주윤슬의 가장 높고 조용한 공간, 4층 스카이테라스. 높은 층에서 누리는 프라이빗한 뷰 덕분에 연인, 부부 여행객이나 조용한 휴식을 원하는 분들에게 특히나 인기가 많은 객실입니다.",
      "스카이테라스 거실은 고층에서만 느낄 수 있는 탁 트인 개방감이 가장 큰 매력입니다. 통창 앞에 서있기만 해도 제주 바다와 하늘이 맞닿은 풍경이 한눈에 들어옵니다.",
      "2~3인이 머무르기에 알맞은 구조의 침실에는 포근하고 뽀송한 호텔식 침구가 준비되어 있으며, 행거, 수납장, 사이드 테이블 등 기본 편의 집기도 모두 갖추어져 있습니다.",
      "스카이테라스의 하이라이트는 어디서도 보기 어려운 높은 층의 파노라마 오션뷰입니다. 프라이빗한 개별 테라스에서 성산일출봉과 제주 바다를 바라보며 바베큐를 즐기실 수 있습니다.",
    ],
    bedrooms: 1,
    bathrooms: 1,
    capacity: 3,
    amenities: [
      "대형 TV",
      "블루투스 스피커",
      "캡슐 커피머신",
      "전자레인지 & 밥솥",
      "냉장고 & 전기포트",
      "세탁기",
      "식기류 & 조리도구",
      "호텔식 침구",
      "욕조 & 여유로운 샤워 공간",
      "개별 바베큐 시설",
      "샴푸/컨디셔너/바디워시/폼클렌저",
      "드라이기/치약/핸드워시",
    ],
    recommend: [
      "하늘과 바다가 함께 보이는 고층 오션뷰를 선호하는 여행객",
      "바라만 봐도 힐링되는 뷰와 함께 워케이션을 즐기고 싶으신 분",
      "연인, 부부와 함께 감성적인 시간을 보내고 싶으신 분",
      "제주 동쪽 여행에 최적화된 숙소를 찾고 계시는 분",
    ],
    checkIn: "16:00 - 22:00",
    checkOut: "10:00",
    prices: null,
    heroLabel: "4F 스카이테라스",
  },
};

const FLOOR_ORDER: { key: string; label: string }[] = [
  { key: "2f", label: "2F 비치테라스" },
  { key: "3f", label: "3F 오션테라스" },
  { key: "4f", label: "4F 스카이테라스" },
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

      <section className="relative h-[42vh] min-h-[320px] flex items-end overflow-hidden">
        <ImagePlaceholder
          className="absolute inset-0 ken-burns"
          showLabel={false}
          src="/images/interior-ocean.jpg"
          alt={room.heroLabel}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/55" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-12 md:pb-16 text-white">
          <p className="text-xs tracking-[0.3em] uppercase opacity-80 mb-3 fade-in-up">
            Accommodations · {room.floor}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl tracking-wide fade-in-up delay-200">
            {room.title}
          </h1>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-[var(--background)] border-b border-[var(--foreground)]/10">
        <div className="max-w-6xl mx-auto px-6">
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

      <section className="py-20 md:py-28 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--accent-light)] mb-4">
              Recommend
            </p>
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide">
              이런 분들께 추천
            </h2>
          </div>
          <ul className="md:col-span-2 space-y-4">
            {room.recommend.map((r) => (
              <li
                key={r}
                className="flex items-start gap-3 text-[15px] text-[var(--foreground)]/80 border-b border-[var(--foreground)]/10 pb-4"
              >
                <span className="text-[var(--accent)] mt-0.5">&#10003;</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
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
              <div className="mt-10 pt-10 border-t border-white/10">
                <Link
                  href={`/reserve?room=${key}`}
                  className="inline-block border border-white/70 text-white px-10 py-4 text-sm tracking-widest hover:bg-white hover:text-[var(--dark-bg)] transition-all duration-300"
                >
                  이 객실 예약하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
