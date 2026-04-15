"use client";

import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ImagePlaceholder from "./components/ImagePlaceholder";
import {
  ArrowRight,
  MountainIcon,
  CliffIcon,
  WaveIcon,
  FishIcon,
  ShipIcon,
} from "./components/Icons";

function HeroSection() {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <ImagePlaceholder
        className="absolute inset-0 ken-burns"
        showLabel={false}
        src="/images/interior-ocean.jpg"
        alt="제주 윤슬 거실과 오션뷰"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center text-white px-4">
        <p className="font-serif text-lg md:text-2xl leading-relaxed tracking-wide mb-2 fade-in-up">
          섭지코지와 성산일출봉 사이,
        </p>
        <p className="font-serif text-lg md:text-2xl leading-relaxed tracking-wide mb-10 fade-in-up delay-200">
          창 너머의 풍경마저 당신의 휴식이 되는 곳 제주 윤슬.
        </p>
        <Link
          href="/reserve"
          className="inline-block border border-white/60 text-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-[var(--foreground)] transition-all duration-300 fade-in-up delay-400"
        >
          예약하기
        </Link>
      </div>
    </section>
  );
}

function WelcomeSection() {
  return (
    <section className="py-24 md:py-32 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent-light)] mb-4">
            01 — Welcome
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-[var(--foreground)] mb-6 tracking-wide leading-tight">
            창 너머의 풍경마저
            <br />
            당신의 휴식이 되도록
          </h2>
          <div className="w-10 h-px bg-[var(--foreground)]/40 mb-8" />
          <p className="text-[var(--foreground)]/80 leading-relaxed mb-6 text-[15px]">
            섭지코지와 성산일출봉 사이, 제주 동쪽의 작은 마을에 자리한 제주윤슬은 통창 너머로 드넓은 제주 바다를 온전히 품은 프리미엄 감성 숙소입니다.
          </p>
          <p className="text-[var(--foreground)]/80 leading-relaxed mb-6 text-[15px]">
            2층부터 4층까지 층별 독립형 구조로 되어 있으며, 각 층마다 개별 테라스와 주방, 통창 오션뷰를 갖추고 있어 연인, 가족, 친구 누구와 함께해도 프라이빗한 여유를 온전히 즐기실 수 있습니다.
          </p>
          <p className="text-[var(--foreground)]/80 leading-relaxed mb-10 text-[15px]">
            한달살기, 일주일살기 등 장기 숙박도 환영하며 장박 시 할인 혜택이 제공됩니다.
          </p>
          <Link
            href="/reserve"
            className="inline-block border border-[var(--accent)] text-[var(--accent)] px-8 py-3 text-sm tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
          >
            예약하기
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ImagePlaceholder
            src="/images/interior-ocean.jpg"
            alt="거실과 오션뷰"
            className="col-span-2 h-72 rounded-lg hover-zoom"
          />
          <ImagePlaceholder label="마샬 스피커" className="h-48 rounded-lg" />
          <ImagePlaceholder
            src="/images/gwangchigi.jpg"
            alt="광치기 해변과 성산일출봉"
            className="h-48 rounded-lg hover-zoom"
          />
        </div>
      </div>
    </section>
  );
}

function RoomsSection() {
  const rooms = [
    {
      slug: "2f",
      floor: "2F",
      name: "비치테라스",
      type: "2Bed / 2Bath",
      desc: "성산일출봉과 제주 바다가 한눈에 펼쳐지는 가장 넓은 객실. 가족 여행객과 단체 여행객에게 가장 인기가 높은 공간입니다.",
      capacity: "최대인원수: 6명",
      tags: ["테라스", "오션뷰", "바베큐"],
    },
    {
      slug: "3f",
      floor: "3F",
      name: "오션테라스",
      type: "1Bed / 1Bath",
      desc: "통창 너머로 펼쳐지는 시원한 오션뷰와 프라이빗한 개별 테라스. 연인, 소가족, 감성 여행객분들이 가장 선호하시는 객실입니다.",
      capacity: "최대인원수: 4명",
      tags: ["테라스", "오션뷰", "바베큐"],
    },
    {
      slug: "4f",
      floor: "4F",
      name: "스카이테라스",
      type: "1Bed / 1Bath",
      desc: "제주윤슬의 가장 높고 조용한 공간. 높은 층에서 누리는 파노라마 오션뷰와 욕조가 매력인 객실입니다.",
      capacity: "최대인원수: 3명",
      tags: ["테라스", "오션뷰", "욕조", "바베큐"],
    },
  ];

  return (
    <section id="rooms" className="py-24 md:py-32 bg-[var(--warm-bg)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent-light)] mb-4">
            02 — Accommodations
          </p>
          <h2 className="font-serif text-3xl md:text-5xl tracking-wide mb-6">
            객실안내
          </h2>
          <div className="w-10 h-px bg-[var(--foreground)]/40 mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {rooms.map((room, i) => (
            <div
              key={room.floor}
              className="group bg-white border border-[var(--foreground)]/8 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[var(--foreground)]/20"
            >
              <Link href={`/rooms/${room.slug}`} className="block hover-zoom relative">
                <ImagePlaceholder
                  src="/images/interior-ocean.jpg"
                  alt={`${room.floor} 객실`}
                  className="h-64"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm font-serif text-xs tracking-[0.25em] px-3 py-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
              <div className="p-7 md:p-8">
                <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-3">
                  {room.floor} · {room.type}
                </p>
                <h3 className="font-serif text-2xl tracking-wide mb-1">
                  {room.name}
                </h3>
                <div className="w-8 h-px bg-[var(--foreground)]/30 my-5" />
                <p className="text-sm opacity-70 leading-[1.9] mb-6">
                  {room.desc}
                </p>
                <p className="text-[11px] tracking-[0.15em] uppercase opacity-50 mb-6">
                  {room.capacity} · {room.tags.join(" · ")}
                </p>
                <Link
                  href={`/rooms/${room.slug}`}
                  className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-[var(--foreground)] border-b border-[var(--foreground)]/30 pb-1 hover:border-[var(--foreground)] transition-colors"
                >
                  상세보기 <ArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NearbySection() {
  const spots = [
    {
      Icon: MountainIcon,
      name: "성산일출봉",
      en: "Seongsan Ilchulbong",
      time: "차로 7분",
      desc: "유네스코 세계 자연유산, 해돋이 명소",
    },
    {
      Icon: CliffIcon,
      name: "섭지코지",
      en: "Seopjikoji",
      time: "차로 3분",
      desc: "푸른 바다와 붉은 오름이 어우러진 해안 절경",
    },
    {
      Icon: WaveIcon,
      name: "광치기해변",
      en: "Gwangchigi Beach",
      time: "차로 3분",
      desc: "성산일출봉이 한눈에 보이는 일출 명소",
    },
    {
      Icon: FishIcon,
      name: "아쿠아플라넷 제주",
      en: "Aqua Planet",
      time: "도보 10분",
      desc: "국내 최대 규모의 해양 테마파크",
    },
    {
      Icon: ShipIcon,
      name: "성산포항 여객터미널",
      en: "Seongsan Port",
      time: "차로 8분",
      desc: "우도로 이동할 수 있는 선착장",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent-light)] mb-4">
            Around Yunseul
          </p>
          <h2 className="font-serif text-3xl md:text-5xl tracking-wide mb-6">
            주변 관광지
          </h2>
          <div className="w-10 h-px bg-[var(--foreground)]/40 mx-auto mb-6" />
          <p className="text-[15px] opacity-60 leading-relaxed max-w-xl mx-auto">
            제주 동부의 중심에 자리한 윤슬에서, 하루 일정만으로도
            <br className="hidden md:block" />
            제주의 대표 명소를 두루 만나실 수 있습니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--foreground)]/10 border border-[var(--foreground)]/10">
          {spots.map((s, i) => (
            <div
              key={s.name}
              className="group bg-white p-8 text-center transition-colors duration-500 hover:bg-[var(--warm-bg)]"
            >
              <p className="font-serif text-xs tracking-[0.25em] opacity-40 mb-6">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="w-12 h-12 mx-auto mb-6 rounded-full border border-[var(--foreground)]/15 flex items-center justify-center text-[var(--foreground)] transition-colors duration-500 group-hover:border-[var(--foreground)]/50">
                <s.Icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base mb-1 tracking-wide">{s.name}</h3>
              <p className="text-[10px] tracking-[0.25em] uppercase opacity-40 mb-4">
                {s.en}
              </p>
              <div className="w-6 h-px bg-[var(--foreground)]/20 mx-auto mb-4" />
              <p className="text-[11px] tracking-widest uppercase opacity-60 mb-3">
                {s.time}
              </p>
              <p className="text-xs opacity-60 leading-[1.9]">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/attractions"
            className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-[var(--foreground)] border-b border-[var(--foreground)]/30 pb-1 hover:border-[var(--foreground)] transition-colors"
          >
            자세히 보기
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReviewSection() {
  return (
    <section id="review" className="py-24 md:py-32 bg-[var(--dark-bg)] text-[var(--dark-text)]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="text-6xl text-[var(--accent)] opacity-40 font-serif mb-8">&ldquo;</div>
        <p className="font-serif text-lg md:text-xl leading-loose tracking-wide">
          왼쪽으로는 성산일출봉이 보이고
          <br />
          오른쪽에는 해가 떠오르고 있었어요.
          <br />
          정말 멋진 광경이었습니다.
          <br />
          제주 윤슬에서 그토록 아름다운 일출을
          <br />
          감상하게 될 줄 몰랐어요.
        </p>
        <div className="text-6xl text-[var(--accent)] opacity-40 font-serif mt-8">&rdquo;</div>
        <button className="inline-block mt-8 text-sm text-[var(--accent-light)] border-b border-[var(--accent-light)]/40 pb-0.5 hover:border-[var(--accent-light)] transition-colors tracking-wide">
          풀 리뷰 보러가기 &gt;
        </button>
      </div>
    </section>
  );
}

function DirectionsSection() {
  return (
    <section id="directions" className="py-24 md:py-32 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl mb-16 tracking-wide">
          오시는 길
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="mb-10">
              <h3 className="font-serif text-xl mb-4">주소</h3>
              <p className="opacity-70 text-[15px] leading-relaxed">
                제주 서귀포시 성산읍 섭지코지로 43 제주 윤슬
              </p>
            </div>
            <div className="mb-10">
              <h3 className="font-serif text-xl mb-4">주차안내</h3>
              <p className="opacity-70 text-[15px] leading-relaxed">
                건물 1층에 주차공간이 있습니다. 객실당 자가용 한대씩 주차 가능합니다.
                한대 이상의 공간이 필요하시다면 문의 부탁드립니다.
                주차장 혼잡시 도로변에 주차가능합니다.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-4">문의</h3>
              <p className="opacity-70 text-[15px] leading-relaxed">
                기타 문의는{" "}
                <span className="text-[var(--accent)] font-medium">010-5452-2323</span>
                으로 연락주시면 성실히 답변 드리겠습니다 (텍스트만 가능).
              </p>
            </div>
          </div>
          <div>
            <ImagePlaceholder
              src="/images/yunseul-exterior.jpg"
              alt="제주 윤슬 외관"
              className="h-80 rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <WelcomeSection />
      <RoomsSection />
      <NearbySection />
      <ReviewSection />
      <DirectionsSection />
      <Footer />
    </main>
  );
}
