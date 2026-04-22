import Image from 'next/image';
import FadeInSection from './FadeInSection';

const YEAR_PHOTOS: { year: number; src: string; milestone?: string }[] = [
  { year: 2017, src: '/images/story-2017.jpg', milestone: '在一起100天' },
  { year: 2018, src: '/images/story-2018.jpg', milestone: '第一個新年' },
  { year: 2019, src: '/images/story-2019.jpg', milestone: '大學畢業咯' },
  { year: 2020, src: '/images/story-2020.jpg', milestone: '跨年夜' },
  { year: 2021, src: '/images/story-2021.jpg', milestone: '我們又畢業了' },
  { year: 2022, src: '/images/story-2022.jpg', milestone: '第一輛機車' },
  { year: 2023, src: '/images/story-2023.jpg', milestone: '再見台灣' },
  { year: 2024, src: '/images/story-2024.jpg', milestone: '今天你要嫁給我' },
  { year: 2025, src: '/images/story-2025.jpg', milestone: '我們註冊啦！' },
];

export default function LoveStory() {
  return (
    <section className="bg-white pt-8 pb-16 px-6">
      {/* Header row */}
      <FadeInSection>
        <div className="flex justify-between items-start mb-2">
          <span className="font-noto text-sm text-gray-700">我的一封情书</span>
          <span className="text-accent-red text-xs tracking-widest">FOREVER</span>
        </div>
        <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-1">
          OUR LOVE STORY
        </h2>
        <div className="flex justify-end">
          <span className="text-[10px] tracking-[0.3em] text-gray-500">FALL IN LOVE</span>
        </div>
      </FadeInSection>

      {/* Main photo */}
      <FadeInSection className="mt-6" delay="100ms">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src="/images/love-story-1.jpg"
            alt="Our love story"
            fill
            className="object-cover"
          />
        </div>
      </FadeInSection>

      <FadeInSection className="mt-10" delay="200ms">
        <div className="relative">
          {/* Full-height solid line as base */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 bg-gray-200 w-px" />

          {/* Past section — solid line shows through */}
          <div>
            {/* Timeline start label */}
            <div className="relative flex justify-center mb-6">
              <span className="font-noto text-xs text-gray-400 tracking-[0.3em] bg-white px-3">故事開始</span>
            </div>

            {YEAR_PHOTOS.map(({ year, src, milestone }, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={year} className="relative flex items-center mb-8">
                  {isLeft ? (
                    <>
                      <div className="w-[45%]">
                        <div className="relative aspect-[3/4]">
                          <Image src={src} alt={String(year)} fill className="object-cover" />
                        </div>
                      </div>
                      <div className="w-[10%] flex flex-col items-center gap-1 relative">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        {year !== 2025 && (
                          <span className="text-[9px] tracking-widest text-gray-500 [writing-mode:vertical-rl]">
                            {year}
                          </span>
                        )}
                        {milestone && (
                          <span className="absolute left-full top-0 pl-2 font-noto text-[11px] text-gray-500 whitespace-nowrap">
                            {milestone}
                          </span>
                        )}
                      </div>
                      <div className="w-[45%]" />
                    </>
                  ) : (
                    <>
                      <div className="w-[45%]" />
                      <div className="w-[10%] flex flex-col items-center gap-1 relative">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        {year !== 2025 && (
                          <span className="text-[9px] tracking-widest text-gray-500 [writing-mode:vertical-rl]">
                            {year}
                          </span>
                        )}
                        {milestone && (
                          <span className="absolute right-full top-0 pr-2 font-noto text-[11px] text-gray-500 whitespace-nowrap text-right">
                            {milestone}
                          </span>
                        )}
                      </div>
                      <div className="w-[45%]">
                        <div className="relative aspect-[3/4]">
                          <Image src={src} alt={String(year)} fill className="object-cover" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Future section — white strip erases solid line, dashed overlays */}
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-[2px] top-0 bottom-0 w-1 bg-white" />
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0 border-l border-dashed border-gray-300" />
            <div className="pt-10 pb-24 flex justify-center relative">
              <div className="text-center bg-white px-4">
                <span className="text-[10px] tracking-[0.2em] text-gray-400">❧</span>
                <p className="text-base font-bold tracking-[0.3em] text-gray-700 mt-1">
                  我們婚禮見
                </p>
                <span className="text-[10px] tracking-[0.2em] text-gray-400">❧</span>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}
