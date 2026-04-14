"use client";

import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ImagePlaceholder from "./components/ImagePlaceholder";
import { ArrowRight } from "./components/Icons";

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
          href="/#rooms"
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
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--accent)] mb-8 tracking-wide">
            Welcome
          </h2>
          <p className="text-[var(--foreground)]/80 leading-relaxed mb-6 text-[15px]">
            섭지코지와 성산일출봉 사이에 자리 잡은 윤슬은 통창과 개별 테라스 등 모던하지만 실용적인 인테리어를 갖춘 감성 숙소입니다.
          </p>
          <p className="text-[var(--foreground)]/80 leading-relaxed mb-10 text-[15px]">
            2F, 3F, 4F 층별 한 채씩 있는 독립적인 공간이며 엘리베이터로 편안하게 접근할 수 있습니다.
          </p>
          <Link
            href="/#rooms"
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
      type: "2Bed / 2Bath",
      desc: "가장 넓고 쾌적한 유닛이므로 6명까지 지낼 수 있는 공간입니다.",
      capacity: "최대인원수: 6명",
      tags: ["테라스", "오션뷰"],
    },
    {
      slug: "3f",
      floor: "3F",
      type: "1Bed / 1Bath",
      desc: "야외 테라스에서 바베큐 하면서 바라보는 성산이 일품인 객실입니다.",
      capacity: "최대인원수: 4명",
      tags: ["테라스", "오션뷰"],
    },
    {
      slug: "4f",
      floor: "4F",
      type: "1Bed / 1Bath",
      desc: "아늑하고 쾌적한 실내에서 보이는 멋진 풍경을 감상하실 수 있습니다.",
      capacity: "최대인원수: 3명",
      tags: ["테라스", "오션뷰"],
    },
  ];

  return (
    <section id="rooms" className="py-24 md:py-32 bg-[var(--warm-bg)]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-16 tracking-wide">
          객실안내
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.floor} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
              <Link href={`/rooms/${room.slug}`} className="block hover-zoom">
                <ImagePlaceholder
                  src="/images/interior-ocean.jpg"
                  alt={`${room.floor} 객실`}
                  className="h-56"
                />
              </Link>
              <div className="p-6">
                <h3 className="font-serif text-xl mb-1">
                  {room.floor}{" "}
                  <span className="text-sm opacity-50 font-sans">
                    ({room.type})
                  </span>
                </h3>
                <p className="text-sm opacity-70 leading-relaxed mt-3 mb-4">
                  {room.desc}
                </p>
                <p className="text-xs opacity-50 mb-4">
                  {room.capacity} | {room.tags.join(" | ")}
                </p>
                <Link
                  href={`/rooms/${room.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-[var(--accent)] border-b border-[var(--accent)]/40 pb-0.5 hover:border-[var(--accent)] transition-colors"
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
      <ReviewSection />
      <DirectionsSection />
      <Footer />
    </main>
  );
}
