'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import FadeInSection from './FadeInSection';
import { calculateTimeLeft, type TimeLeft } from '@/lib/countdown';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const WEEKS = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, null, null, null, null, null, null],
];

const WEDDING_DAY = 14;
const WEDDING_DATE = new Date('2026-11-14T00:00:00');

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-deep-red text-white w-14 h-14 flex items-center justify-center text-xl font-bold rounded-sm">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[9px] tracking-widest text-white/70 mt-1">{label}</span>
    </div>
  );
}

export default function CalendarSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(WEDDING_DATE));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(WEDDING_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/images/calendar-bg.jpg"
        alt="Calendar background"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/40" />

      <FadeInSection className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16 gap-6">
        {/* SAVE THE DATE */}
        <h2 className="font-playfair text-2xl text-white tracking-widest">SAVE THE DATE</h2>

        {/* Date header */}
        <div className="text-white text-center">
          <div className="flex items-center justify-center gap-3 text-3xl font-light tracking-widest">
            <span>11</span>
            <span className="text-lg">/</span>
            <span className="text-5xl font-bold">14</span>
            <span className="text-lg ml-4">—2026—</span>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="bg-white/15 backdrop-blur-sm rounded p-4 w-full max-w-sm">
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-white text-center text-[10px] tracking-wider py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="border-t border-white/40 mb-2" />
          {WEEKS.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((day, di) => (
                <div key={di} className="flex items-center justify-center h-9 text-sm">
                  {day === WEDDING_DAY ? (
                    <span className="animate-heartbeat text-red-400 text-xl">♥</span>
                  ) : day ? (
                    <span className="text-white">{day}</span>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Countdown — horizontal */}
        <div className="flex gap-4 justify-center">
          <CountdownBlock value={timeLeft?.days ?? 0} label="DAY" />
          <CountdownBlock value={timeLeft?.hours ?? 0} label="HOUR" />
          <CountdownBlock value={timeLeft?.minutes ?? 0} label="MIN" />
          <CountdownBlock value={timeLeft?.seconds ?? 0} label="SEC" />
        </div>

        {/* English quote */}
        <p className="font-cormorant italic text-center text-white/70 text-sm leading-7">
          As the clouds and mist dissipate<br />
          love you and everyone knows it
        </p>
      </FadeInSection>
    </section>
  );
}
