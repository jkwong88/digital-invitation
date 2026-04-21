'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import FadeInSection from './FadeInSection';
import { calculateTimeLeft, type TimeLeft } from '@/lib/countdown';

const WEDDING_DATE = new Date('2026-11-14T00:00:00');

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-deep-red text-white w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-sm">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] tracking-widest text-gray-600 mt-1">{label}</span>
    </div>
  );
}

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(WEDDING_DATE));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(WEDDING_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-warm-white">
      {/* Background photo with SAVE THE DATE */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src="/images/countdown-bg.jpg"
          alt="Save the date"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="font-playfair text-3xl text-white tracking-widest">SAVE THE DATE</h2>
        </div>
      </div>

      {/* Countdown content */}
      <div className="px-6 py-10">
        <FadeInSection>
          <p className="font-playfair text-lg text-gray-800 tracking-widest mb-8">
            2026.11.14 Saturday
          </p>

          <div className="flex gap-4 items-start">
            {/* Countdown blocks */}
            <div className="flex flex-col gap-3">
              <CountdownBlock value={timeLeft.days} label="DAY" />
              <CountdownBlock value={timeLeft.hours} label="HOUR" />
              <CountdownBlock value={timeLeft.minutes} label="MIN" />
              <CountdownBlock value={timeLeft.seconds} label="SEC" />
            </div>

            {/* Side content */}
            <div className="flex-1 pl-4">
              <p className="font-noto text-sm text-gray-600 leading-7 mb-6 text-right">
                天光乍泄，落入凡尘烟火里<br />
                我跨越千山万水而来<br />
                只为与你共赴三餐四季
              </p>

              {/* Historical photos */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative aspect-square">
                    <Image src="/images/countdown-2017.jpg" alt="2017" fill className="object-cover" />
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-1 tracking-widest">2017</p>
                </div>
                <div className="flex-1">
                  <div className="relative aspect-square">
                    <Image src="/images/countdown-2019.jpg" alt="2019" fill className="object-cover" />
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-1 tracking-widest">2019</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quote */}
          <p className="font-cormorant italic text-center text-gray-500 mt-8 text-sm leading-7">
            As the clouds and mist dissipate<br />
            love you and everyone knows it
          </p>
        </FadeInSection>
      </div>
    </section>
  );
}
