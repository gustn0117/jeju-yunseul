"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ImagePlaceholder from "../components/ImagePlaceholder";

type Attraction = {
  name: string;
  en: string;
  distance: string;
  desc: string;
  photo?: string;
};

const ATTRACTIONS: Attraction[] = [
  {
    name: "성산일출봉",
    en: "Seongsan Ilchulbong",
    distance: "차로 7분",
    desc: "제주 동쪽을 대표하는 관광지로, 해돋이 명소이자 유네스코 세계 자연유산으로 등재된 곳입니다. 아침 일찍 올라 바다 위로 떠오르는 일출을 감상해 보세요.",
    photo: "/images/gwangchigi.jpg",
  },
  {
    name: "섭지코지",
    en: "Seopjikoji",
    distance: "차로 3분",
    desc: "푸른 바다와 붉은 오름이 어우러진 제주의 대표 해안 절경지입니다. 일출봉을 배경으로 한 해안절벽을 따라 걸으며 제주의 아름다움을 느껴보세요.",
  },
  {
    name: "광치기해변",
    en: "Gwangchigi Beach",
    distance: "차로 3분",
    desc: "얕고 넓은 백사장과 성산일출봉이 한눈에 보이는 일출 명소이자 제주의 대표 해변입니다. 올레 1코스의 마지막이자 2코스가 시작하는 곳이기도 합니다.",
    photo: "/images/gwangchigi.jpg",
  },
  {
    name: "아쿠아플라넷 제주",
    en: "Aqua Planet",
    distance: "도보 10분",
    desc: "다양한 해양 생물과 체험형 전시를 즐길 수 있는 국내 최대 규모의 해양 테마파크입니다. 아이들과 함께하는 가족 여행에 특히 추천합니다.",
  },
  {
    name: "성산포항 종합여객터미널",
    en: "Seongsan Port",
    distance: "차로 8분",
    desc: "배를 타고 우도로 이동할 수 있는 선착장입니다. 에메랄드빛 바다의 우도에서 특별한 하루를 보내보세요.",
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
            제주윤슬은 제주 동부 여행의 중심지에 위치해 있어, 하루 일정만으로도 제주의 대표 명소를 두루 즐기실 수 있습니다.
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
                  <h2 className="font-serif text-2xl md:text-4xl tracking-wide mb-3">
                    {a.name}
                  </h2>
                  <p className="text-sm text-[var(--accent)] mb-6">{a.distance}</p>
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
