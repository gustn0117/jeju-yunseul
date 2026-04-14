"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ImagePlaceholder from "../components/ImagePlaceholder";

type Attraction = {
  name: string;
  en: string;
  desc: string;
  photo?: string;
};

const ATTRACTIONS: Attraction[] = [
  {
    name: "광치기해변",
    en: "Gwangchigi Beach",
    desc: "일출봉에서 섭지코지로 가는 길에 있으며 올레1코스의 마지막이자 2코스가 시작하는 곳.",
    photo: "/images/gwangchigi.jpg",
  },
  {
    name: "섭지코지",
    en: "Seopjikoji",
    desc: "일출봉을 배경으로 한 해안절벽을 따라 걸으며 전형적인 제주의 아름다움을 느껴보세요.",
  },
  {
    name: "성산일출봉",
    en: "Seongsan Ilchulbong",
    desc: "제주도의 다른 오름들과는 달리 마그마가 물속에서 분출하며 만들어진 수성화산체입니다.",
    photo: "/images/gwangchigi.jpg",
  },
  {
    name: "아쿠아플라넷",
    en: "Aqua Planet",
    desc: "아시아 최대 규모, 제주를 담은 프리미엄 해양 테마파크입니다.",
  },
  {
    name: "올레 1 코스",
    en: "Olle Trail No.1",
    desc: "시흥초등학교를 시작으로 광치기해변에 도착하는 약 14.6km의 코스입니다.",
    photo: "/images/yunseul-exterior.jpg",
  },
];

export default function AttractionsPage() {
  return (
    <main>
      <Header solid />

      <section className="relative h-[42vh] min-h-[320px] flex items-end overflow-hidden">
        <ImagePlaceholder
          className="absolute inset-0 ken-burns"
          showLabel={false}
          src="/images/gwangchigi.jpg"
          alt="광치기 해변과 성산일출봉"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/55" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-12 md:pb-16 text-white">
          <p className="text-xs tracking-[0.3em] uppercase opacity-80 mb-3 fade-in-up">
            Around Yunseul
          </p>
          <h1 className="font-serif text-4xl md:text-6xl tracking-wide fade-in-up delay-200">
            주변관광지
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[var(--background)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[15px] opacity-70 leading-relaxed">
            제주의 동쪽, 윤슬을 중심으로 걸어서 혹은 가까이서 만날 수 있는 풍경들을 소개합니다.
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto px-6 space-y-20 md:space-y-28">
          {ATTRACTIONS.map((a, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={a.name}
                className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <ImagePlaceholder
                  src={a.photo}
                  label={a.en}
                  alt={a.name}
                  className="h-72 md:h-96 rounded-lg hover-zoom"
                />
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[var(--accent-light)] mb-4">
                    {String(i + 1).padStart(2, "0")} — {a.en}
                  </p>
                  <h2 className="font-serif text-2xl md:text-4xl tracking-wide mb-6">
                    {a.name}
                  </h2>
                  <div className="w-10 h-[1px] bg-[var(--foreground)]/40 mb-6" />
                  <p className="text-[15px] leading-[1.9] text-[var(--foreground)]/80">
                    {a.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[var(--warm-bg)] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-6">
            더 가까이, 제주의 바람
          </h2>
          <p className="text-[15px] opacity-70 leading-relaxed mb-10">
            윤슬에서 모든 관광지까지 차량으로 10분 이내. 광치기 해변은 테라스에서 바로 이어집니다.
          </p>
          <a
            href="/#directions"
            className="inline-block border border-[var(--accent)] text-[var(--accent)] px-8 py-3 text-sm tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
          >
            오시는 길 보기
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
