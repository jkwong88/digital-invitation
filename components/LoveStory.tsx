import Image from 'next/image';
import FadeInSection from './FadeInSection';

export default function LoveStory() {
  return (
    <section className="bg-white py-16 px-6">
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

      {/* Photo */}
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

      {/* Badge */}
      <FadeInSection className="mt-6 flex justify-center" delay="200ms">
        <div className="text-center">
          <span className="text-[10px] tracking-[0.2em] text-gray-400">❧</span>
          <p className="text-[10px] tracking-[0.3em] text-gray-500 mt-1">
            WEDDING<br />INVITATION
          </p>
          <span className="text-[10px] tracking-[0.2em] text-gray-400">❧</span>
        </div>
      </FadeInSection>
    </section>
  );
}
