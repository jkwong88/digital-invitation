# Wedding Digital Invitation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first digital wedding invitation with 8 animated sections and an RSVP form backed by Google Sheets, deployed on Vercel via GitHub.

**Architecture:** Single Next.js app with all sections on one scrollable page (`app/page.tsx`). The RSVP form POSTs to a Next.js API route (`/api/rsvp`) that appends a row to Google Sheets using a service account. All static content is edge-cached by Vercel; only the RSVP endpoint hits a serverless function.

**Tech Stack:** Next.js 15, Tailwind CSS v3, TypeScript, googleapis npm package, Jest + React Testing Library, Vercel, GitHub

---

## Image Files Required

Before starting, create the folder `public/images/` and place your photos there with these exact names:

| Filename | Usage |
|---|---|
| `hero.jpg` | Hero full-screen background |
| `love-story-1.jpg` | Couple in window with teddy bears |
| `calendar-bg.jpg` | Full-screen background behind calendar |
| `countdown-bg.jpg` | Background behind countdown timer |
| `countdown-2017.jpg` | Historical couple photo labeled 2017 |
| `countdown-2019.jpg` | Historical couple photo labeled 2019 |
| `gallery-1.jpg` … `gallery-4.jpg` | Horizontal photo strip |
| `rsvp-bg.jpg` | Photo behind RSVP section |

---

## File Map

| File | Responsibility |
|---|---|
| `app/layout.tsx` | HTML shell, Google Fonts, metadata |
| `app/globals.css` | Base resets, custom animations |
| `app/page.tsx` | Assembles all sections in order |
| `app/api/rsvp/route.ts` | POST handler → validates → calls googleSheets |
| `components/FadeInSection.tsx` | IntersectionObserver fade-up wrapper |
| `components/Hero.tsx` | Section 1 |
| `components/LoveStory.tsx` | Section 2 |
| `components/InvitationLetter.tsx` | Section 3 |
| `components/CalendarSection.tsx` | Section 4 — November 2026 grid |
| `components/CountdownSection.tsx` | Section 5 — live timer + historical photos |
| `components/PhotoGallery.tsx` | Section 6 — horizontal scroll strip |
| `components/RsvpForm.tsx` | Section 7 — form UI + submission |
| `components/Footer.tsx` | Section 8 |
| `lib/countdown.ts` | Pure function: calculates time left to date |
| `lib/rsvpValidation.ts` | Pure function: validates RSVP form fields |
| `lib/googleSheets.ts` | Appends a row to Google Sheets via service account |
| `__tests__/lib/countdown.test.ts` | Unit tests for countdown logic |
| `__tests__/lib/rsvpValidation.test.ts` | Unit tests for validation logic |
| `__tests__/lib/googleSheets.test.ts` | Unit tests for Sheets client (googleapis mocked) |
| `__tests__/api/rsvp.test.ts` | Integration tests for API route handler |
| `__tests__/components/RsvpForm.test.tsx` | Component tests for form behavior |

---

## Task 1: Project Setup

**Files:**
- Create: `digital-invitation/` (project root)
- Create: `.gitignore`
- Create: `jest.config.ts`
- Create: `jest.setup.ts`

- [ ] **Step 1: Scaffold Next.js project**

Run inside `/Users/kun/Downloads/PersonalProject/digital_invitation/`:
```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
npx create-next-app@15 . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
```
Expected: project files created, `package.json` present.

- [ ] **Step 2: Install additional dependencies**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
npm install googleapis
npm install --save-dev jest @types/jest jest-environment-jsdom ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Expected: no errors, packages appear in `node_modules/`.

- [ ] **Step 3: Create Jest config**

Create `jest.config.ts`:
```typescript
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default config;
```

- [ ] **Step 4: Create Jest setup file**

Create `jest.setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Fix jest.config.ts typo**

Open `jest.config.ts` and change `setupFilesAfterFramework` to `setupFilesAfterFramework`:

Actually — the correct key is `setupFilesAfterFramework`. Correction: the correct Jest key is `setupFilesAfterFramework`. Wait — it is `setupFilesAfterEnv`. Update `jest.config.ts`:
```typescript
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default config;
```

- [ ] **Step 6: Add test script to package.json**

Open `package.json` and add `"test": "jest"` to the `scripts` section:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest"
}
```

- [ ] **Step 7: Create image directory**

```bash
mkdir -p public/images
```

Copy all your couple photos into `public/images/` using the filenames from the Image Files table above.

- [ ] **Step 8: Init git and make first commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js project with Jest"
```

---

## Task 2: Global Styles & Tailwind Config

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Update Tailwind config with custom colors and fonts**

Replace the contents of `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-red': '#8B1A1A',
        'accent-red': '#c0392b',
        'warm-white': '#f5f0eb',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        noto: ['var(--font-noto)', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'slide-in': 'slide-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Update layout.tsx with Google Fonts and metadata**

Replace `app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, Noto_Serif_SC } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const noto = Noto_Serif_SC({
  subsets: ['chinese-simplified'],
  weight: ['400', '700'],
  variable: '--font-noto',
});

export const metadata: Metadata = {
  title: '婚礼邀请函 | Wedding Invitation 2026',
  description: 'You are cordially invited to our wedding on 2026.11.14 at Ascott Gurney Penang.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className={`${playfair.variable} ${cormorant.variable} ${noto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Update globals.css**

Replace `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #ffffff;
  color: #1a1a1a;
  overflow-x: hidden;
}

/* Vertical text utility */
.writing-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
```

- [ ] **Step 4: Verify dev server starts**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
npm run dev
```
Open http://localhost:3000 in browser. Expected: default Next.js page loads without errors. Stop server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts app/layout.tsx app/globals.css
git commit -m "chore: configure Tailwind colors, fonts, and animations"
```

---

## Task 3: FadeInSection Utility Component

**Files:**
- Create: `components/FadeInSection.tsx`

- [ ] **Step 1: Create FadeInSection component**

Create `components/FadeInSection.tsx`:
```tsx
'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}

export default function FadeInSection({ children, className = '', delay = '0ms' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: delay }}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/FadeInSection.tsx
git commit -m "feat: add FadeInSection scroll animation wrapper"
```

---

## Task 4: Hero Section

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: Create Hero component**

Create `components/Hero.tsx`:
```tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Wedding hero photo"
        fill
        className="object-cover object-top"
        priority
      />
      <div className="absolute inset-0 bg-black/25" />

      {/* Music button placeholder */}
      <button
        aria-label="Toggle music"
        className="absolute top-5 right-5 w-10 h-10 rounded-full border-2 border-white text-white flex items-center justify-center text-lg z-10"
      >
        ♪
      </button>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 z-10">
        <p className="text-sm tracking-[0.25em] mb-2 font-light">2026.11.14</p>
        <p className="text-xl tracking-wider">Ascott Gurney Penang</p>
        <p className="mt-10 text-base tracking-[0.3em] font-noto font-light">
          合情 | 合理 | 合法 | 和你
        </p>
        <p className="mt-5 text-xs italic opacity-75 leading-6 max-w-xs font-cormorant">
          To Our Family And Friends, Thank You For Celebrating Our Special Day,
          Supporting Us And Sharing Our Love.
        </p>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 w-full flex justify-between items-center px-6 py-3 bg-white/90 text-[10px] tracking-[0.25em] text-gray-800 z-10">
        <span>WEDDING</span>
        <span>INVITATION</span>
        <span>2026</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add Hero section"
```

---

## Task 5: Love Story Section

**Files:**
- Create: `components/LoveStory.tsx`

- [ ] **Step 1: Create LoveStory component**

Create `components/LoveStory.tsx`:
```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/LoveStory.tsx
git commit -m "feat: add LoveStory section"
```

---

## Task 6: Invitation Letter Section

**Files:**
- Create: `components/InvitationLetter.tsx`

- [ ] **Step 1: Create InvitationLetter component**

Create `components/InvitationLetter.tsx`:
```tsx
import FadeInSection from './FadeInSection';

const poem = [
  '以前觉得婚礼是一则官方公告',
  '现在才明白这是一场人生为数不多的相聚',
  '是千里之外的奔赴',
  '是不计得失的支持',
  '感谢一路相伴的家人朋友',
  '许久未见 甚是想念',
];

export default function InvitationLetter() {
  return (
    <section className="bg-white py-16 px-6">
      {/* Poem */}
      <FadeInSection>
        <div className="text-center space-y-3">
          {poem.map((line, i) => (
            <p key={i} className="font-noto text-sm text-gray-700 leading-7">
              {line}
            </p>
          ))}
        </div>
      </FadeInSection>

      {/* Date */}
      <FadeInSection className="mt-10 text-center" delay="100ms">
        <p className="tracking-[0.3em] text-gray-800 text-sm">2026.11.14</p>
      </FadeInSection>

      {/* Closing */}
      <FadeInSection className="mt-4 text-center" delay="200ms">
        <p className="font-noto text-2xl text-gray-900">我们，婚礼见~</p>
      </FadeInSection>

      {/* Bottom bar */}
      <div className="mt-12 flex justify-between items-center text-[10px] tracking-[0.25em] text-gray-800 border-t pt-4">
        <span>WEDDING</span>
        <span>INVITATION</span>
        <span>2026</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/InvitationLetter.tsx
git commit -m "feat: add InvitationLetter section"
```

---

## Task 7: Calendar Section

**Files:**
- Create: `components/CalendarSection.tsx`

- [ ] **Step 1: Create CalendarSection component**

November 2026: Nov 1 is a Sunday. Using MON–SUN week layout, Nov 14 falls on Saturday.

Create `components/CalendarSection.tsx`:
```tsx
import Image from 'next/image';
import FadeInSection from './FadeInSection';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// November 2026 — Nov 1 = Sunday, so week starts with 6 empty slots
const WEEKS = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, null, null, null, null, null, null],
];

const WEDDING_DAY = 14;

export default function CalendarSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/images/calendar-bg.jpg"
        alt="Calendar background"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/40" />

      <FadeInSection className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16">
        {/* Date header */}
        <div className="text-white text-center mb-8">
          <div className="flex items-center justify-center gap-3 text-3xl font-light tracking-widest">
            <span>11</span>
            <span className="text-lg">/</span>
            <span className="text-5xl font-bold">14</span>
            <span className="text-lg ml-4">—2026—</span>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="bg-white/15 backdrop-blur-sm rounded p-4 w-full max-w-sm">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-white text-center text-[10px] tracking-wider py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="border-t border-white/40 mb-2" />
          {/* Weeks */}
          {WEEKS.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="flex items-center justify-center h-9 text-sm"
                >
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
      </FadeInSection>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/CalendarSection.tsx
git commit -m "feat: add CalendarSection with November 2026 grid"
```

---

## Task 8: Countdown Logic (TDD)

**Files:**
- Create: `lib/countdown.ts`
- Create: `__tests__/lib/countdown.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/countdown.test.ts`:
```typescript
import { calculateTimeLeft } from '@/lib/countdown';

const target = new Date('2026-11-14T00:00:00');

describe('calculateTimeLeft', () => {
  it('returns correct days when exactly 1 day away', () => {
    const now = new Date('2026-11-13T00:00:00');
    const result = calculateTimeLeft(target, now);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it('returns correct hours and minutes', () => {
    const now = new Date('2026-11-13T22:30:00');
    const result = calculateTimeLeft(target, now);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(0);
  });

  it('returns zeros when target date has passed', () => {
    const now = new Date('2026-11-15T00:00:00');
    const result = calculateTimeLeft(target, now);
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('returns zeros when now equals target', () => {
    const result = calculateTimeLeft(target, target);
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
npm test -- __tests__/lib/countdown.test.ts
```
Expected: FAIL — `Cannot find module '@/lib/countdown'`

- [ ] **Step 3: Implement countdown logic**

Create `lib/countdown.ts`:
```typescript
export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function calculateTimeLeft(targetDate: Date, now: Date = new Date()): TimeLeft {
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test -- __tests__/lib/countdown.test.ts
```
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add lib/countdown.ts __tests__/lib/countdown.test.ts
git commit -m "feat: add countdown logic with tests"
```

---

## Task 9: Countdown Section Component

**Files:**
- Create: `components/CountdownSection.tsx`

- [ ] **Step 1: Create CountdownSection component**

Create `components/CountdownSection.tsx`:
```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/CountdownSection.tsx
git commit -m "feat: add CountdownSection with live timer"
```

---

## Task 10: Photo Gallery Section

**Files:**
- Create: `components/PhotoGallery.tsx`

- [ ] **Step 1: Create PhotoGallery component**

Create `components/PhotoGallery.tsx`:
```tsx
import Image from 'next/image';
import FadeInSection from './FadeInSection';

const GALLERY_PHOTOS = [
  { src: '/images/gallery-1.jpg', alt: 'Gallery photo 1' },
  { src: '/images/gallery-2.jpg', alt: 'Gallery photo 2' },
  { src: '/images/gallery-3.jpg', alt: 'Gallery photo 3' },
  { src: '/images/gallery-4.jpg', alt: 'Gallery photo 4' },
];

export default function PhotoGallery() {
  return (
    <section className="bg-warm-white py-10 overflow-hidden">
      <FadeInSection>
        {/* Horizontal scroll strip */}
        <div className="flex gap-3 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide">
          {GALLERY_PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-60 aspect-[3/4] snap-start"
            >
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
            </div>
          ))}

          {/* FOREVER AND EVER vertical text beside last photo */}
          <div className="flex-shrink-0 flex items-center px-4">
            <div className="writing-vertical text-[10px] tracking-[0.4em] text-gray-400 space-y-6">
              <span>FOREVER</span>
              <span>AND</span>
              <span>EVER</span>
            </div>
          </div>
        </div>

        {/* Handwritten overlay text */}
        <div className="px-6 mt-4">
          <p
            className="font-cormorant italic text-3xl text-gray-700 leading-tight"
            style={{ fontStyle: 'italic', transform: 'rotate(-3deg)', display: 'inline-block' }}
          >
            好久不见<br />婚礼见~
          </p>
        </div>
      </FadeInSection>
    </section>
  );
}
```

- [ ] **Step 2: Hide scrollbar with global CSS**

Add to `app/globals.css`:
```css
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/PhotoGallery.tsx app/globals.css
git commit -m "feat: add PhotoGallery horizontal scroll section"
```

---

## Task 11: RSVP Validation Logic (TDD)

**Files:**
- Create: `lib/rsvpValidation.ts`
- Create: `__tests__/lib/rsvpValidation.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/rsvpValidation.test.ts`:
```typescript
import { validateRsvp } from '@/lib/rsvpValidation';

describe('validateRsvp', () => {
  it('returns no errors for valid input', () => {
    const errors = validateRsvp({ name: 'Alice', pax: '2', phone: '0123456789' });
    expect(errors).toEqual({});
  });

  it('requires name', () => {
    const errors = validateRsvp({ name: '', pax: '2', phone: '0123456789' });
    expect(errors.name).toBeDefined();
  });

  it('requires name to be non-whitespace', () => {
    const errors = validateRsvp({ name: '   ', pax: '2', phone: '0123456789' });
    expect(errors.name).toBeDefined();
  });

  it('requires pax to be a positive integer', () => {
    expect(validateRsvp({ name: 'A', pax: '0', phone: '123' }).pax).toBeDefined();
    expect(validateRsvp({ name: 'A', pax: '-1', phone: '123' }).pax).toBeDefined();
    expect(validateRsvp({ name: 'A', pax: '1.5', phone: '123' }).pax).toBeDefined();
    expect(validateRsvp({ name: 'A', pax: 'abc', phone: '123' }).pax).toBeDefined();
    expect(validateRsvp({ name: 'A', pax: '', phone: '123' }).pax).toBeDefined();
  });

  it('requires phone', () => {
    const errors = validateRsvp({ name: 'Alice', pax: '2', phone: '' });
    expect(errors.phone).toBeDefined();
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npm test -- __tests__/lib/rsvpValidation.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement validation**

Create `lib/rsvpValidation.ts`:
```typescript
export interface RsvpFormData {
  name: string;
  pax: string;
  phone: string;
}

export interface ValidationErrors {
  name?: string;
  pax?: string;
  phone?: string;
}

export function validateRsvp(data: RsvpFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  const paxNum = Number(data.pax);
  if (!data.pax || isNaN(paxNum) || paxNum < 1 || !Number.isInteger(paxNum)) {
    errors.pax = 'Pax must be a positive whole number';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone is required';
  }

  return errors;
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test -- __tests__/lib/rsvpValidation.test.ts
```
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add lib/rsvpValidation.ts __tests__/lib/rsvpValidation.test.ts
git commit -m "feat: add RSVP validation logic with tests"
```

---

## Task 12: RSVP Form Component

**Files:**
- Create: `components/RsvpForm.tsx`
- Create: `__tests__/components/RsvpForm.test.tsx`

- [ ] **Step 1: Write failing component tests**

Create `__tests__/components/RsvpForm.test.tsx`:
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RsvpForm from '@/components/RsvpForm';

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('RsvpForm', () => {
  it('renders all three input fields and submit button', () => {
    render(<RsvpForm />);
    expect(screen.getByPlaceholderText(/姓名 NAME/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/出席人数 PAX/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/電話 PHONE/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SUBMIT/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitted empty', async () => {
    render(<RsvpForm />);
    fireEvent.click(screen.getByRole('button', { name: /SUBMIT/i }));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Pax must be a positive whole number')).toBeInTheDocument();
    expect(screen.getByText('Phone is required')).toBeInTheDocument();
  });

  it('calls fetch with correct payload on valid submit', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
    render(<RsvpForm />);
    fireEvent.change(screen.getByPlaceholderText(/姓名 NAME/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText(/出席人数 PAX/i), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText(/電話 PHONE/i), { target: { value: '0123456789' } });
    fireEvent.click(screen.getByRole('button', { name: /SUBMIT/i }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/rsvp', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Alice', pax: 2, phone: '0123456789' }),
      }));
    });
  });

  it('shows success message after successful submit', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
    render(<RsvpForm />);
    fireEvent.change(screen.getByPlaceholderText(/姓名 NAME/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText(/出席人数 PAX/i), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText(/電話 PHONE/i), { target: { value: '0123456789' } });
    fireEvent.click(screen.getByRole('button', { name: /SUBMIT/i }));
    expect(await screen.findByText(/感謝您的回覆/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npm test -- __tests__/components/RsvpForm.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Create RsvpForm component**

Create `components/RsvpForm.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { validateRsvp, type RsvpFormData, type ValidationErrors } from '@/lib/rsvpValidation';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function RsvpForm() {
  const [form, setForm] = useState<RsvpFormData>({ name: '', pax: '', phone: '' });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (field: keyof RsvpFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRsvp(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus('loading');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          pax: Number(form.pax),
          phone: form.phone.trim(),
        }),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12 animate-slide-in">
        <p className="font-noto text-deep-red text-xl">感謝您的回覆！</p>
        <p className="text-gray-500 text-sm mt-2">We look forward to celebrating with you.</p>
      </div>
    );
  }

  const inputClass =
    'w-full border border-deep-red px-4 py-3 text-sm placeholder-deep-red/70 focus:outline-none focus:ring-1 focus:ring-deep-red bg-transparent';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <input
          type="text"
          placeholder="* 姓名 NAME"
          value={form.name}
          onChange={handleChange('name')}
          className={inputClass}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <input
          type="number"
          placeholder="* 出席人数 PAX"
          value={form.pax}
          onChange={handleChange('pax')}
          min="1"
          step="1"
          className={inputClass}
        />
        {errors.pax && <p className="text-red-500 text-xs mt-1">{errors.pax}</p>}
      </div>
      <div>
        <input
          type="tel"
          placeholder="* 電話 PHONE"
          value={form.phone}
          onChange={handleChange('phone')}
          className={inputClass}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
      {status === 'error' && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-deep-red text-white py-4 text-sm tracking-widest disabled:opacity-60 hover:bg-accent-red transition-colors"
      >
        {status === 'loading' ? '...' : 'SUBMIT'}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test -- __tests__/components/RsvpForm.test.tsx
```
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add components/RsvpForm.tsx __tests__/components/RsvpForm.test.tsx
git commit -m "feat: add RsvpForm component with validation and tests"
```

---

## Task 13: RSVP Section Wrapper + Footer

**Files:**
- Create: `components/RsvpSection.tsx`
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create RsvpSection component**

Create `components/RsvpSection.tsx`:
```tsx
import Image from 'next/image';
import FadeInSection from './FadeInSection';
import RsvpForm from './RsvpForm';

export default function RsvpSection() {
  return (
    <section>
      {/* Background photo */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/images/rsvp-bg.jpg"
          alt="RSVP background"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Form */}
      <div className="bg-white px-6 py-12">
        <FadeInSection>
          <h2 className="font-playfair text-3xl text-center tracking-[0.4em] text-deep-red mb-10">
            RSVP
          </h2>
          <RsvpForm />
        </FadeInSection>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `components/Footer.tsx`:
```tsx
import FadeInSection from './FadeInSection';

export default function Footer() {
  return (
    <footer className="bg-white py-16 px-6 text-center">
      <FadeInSection>
        <p className="text-deep-red text-sm tracking-[0.3em] font-semibold">SEE YOU SOON</p>
        <p className="font-noto text-gray-800 text-xl mt-3">我們期待與您共度美好時刻</p>
      </FadeInSection>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/RsvpSection.tsx components/Footer.tsx
git commit -m "feat: add RsvpSection and Footer"
```

---

## Task 14: Assemble Main Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace page.tsx with assembled invitation**

Replace `app/page.tsx`:
```tsx
import Hero from '@/components/Hero';
import LoveStory from '@/components/LoveStory';
import InvitationLetter from '@/components/InvitationLetter';
import CalendarSection from '@/components/CalendarSection';
import CountdownSection from '@/components/CountdownSection';
import PhotoGallery from '@/components/PhotoGallery';
import RsvpSection from '@/components/RsvpSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <LoveStory />
      <InvitationLetter />
      <CalendarSection />
      <CountdownSection />
      <PhotoGallery />
      <RsvpSection />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Start dev server and verify all sections render**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
npm run dev
```
Open http://localhost:3000. Scroll through all sections. Check:
- Hero shows photo + text overlay + bottom bar
- Love Story shows heading + photo
- Invitation letter shows Chinese poem
- Calendar shows November 2026 grid with ♥ on day 14
- Countdown shows live timer blocks
- Photo gallery scrolls horizontally
- RSVP form shows all 3 fields
- Footer shows closing text

Stop server with Ctrl+C when done.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble full invitation page"
```

---

## Task 15: Google Sheets Library (TDD)

**Files:**
- Create: `lib/googleSheets.ts`
- Create: `__tests__/lib/googleSheets.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/googleSheets.test.ts`:
```typescript
jest.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: jest.fn().mockImplementation(() => ({})),
    },
    sheets: jest.fn().mockReturnValue({
      spreadsheets: {
        values: {
          append: jest.fn().mockResolvedValue({ data: {} }),
        },
      },
    }),
  },
}));

import { appendRsvpRow } from '@/lib/googleSheets';
import { google } from 'googleapis';

describe('appendRsvpRow', () => {
  const mockSheets = {
    spreadsheets: {
      values: {
        append: jest.fn().mockResolvedValue({ data: {} }),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (google.sheets as jest.Mock).mockReturnValue(mockSheets);
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test.iam.gserviceaccount.com';
    process.env.GOOGLE_PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\ntest\n-----END RSA PRIVATE KEY-----';
    process.env.GOOGLE_SHEET_ID = 'test-sheet-id';
  });

  it('calls sheets.spreadsheets.values.append with correct spreadsheetId', async () => {
    await appendRsvpRow({ name: 'Alice', pax: 2, phone: '0123456789' });
    expect(mockSheets.spreadsheets.values.append).toHaveBeenCalledWith(
      expect.objectContaining({ spreadsheetId: 'test-sheet-id' })
    );
  });

  it('includes name, pax, and phone in the appended row', async () => {
    await appendRsvpRow({ name: 'Alice', pax: 2, phone: '0123456789' });
    const call = mockSheets.spreadsheets.values.append.mock.calls[0][0];
    const row: unknown[] = call.requestBody.values[0];
    expect(row).toContain('Alice');
    expect(row).toContain(2);
    expect(row).toContain('0123456789');
  });

  it('includes a timestamp as the first element of the row', async () => {
    await appendRsvpRow({ name: 'Alice', pax: 2, phone: '0123456789' });
    const call = mockSheets.spreadsheets.values.append.mock.calls[0][0];
    const row: unknown[] = call.requestBody.values[0];
    expect(typeof row[0]).toBe('string');
    expect(row[0]).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npm test -- __tests__/lib/googleSheets.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement Google Sheets library**

Create `lib/googleSheets.ts`:
```typescript
import { google } from 'googleapis';

interface RsvpRow {
  name: string;
  pax: number;
  phone: string;
}

export async function appendRsvpRow(data: RsvpRow): Promise<void> {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const timestamp = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A:D',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[timestamp, data.name, data.pax, data.phone]],
    },
  });
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test -- __tests__/lib/googleSheets.test.ts
```
Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add lib/googleSheets.ts __tests__/lib/googleSheets.test.ts
git commit -m "feat: add Google Sheets client with tests"
```

---

## Task 16: RSVP API Route (TDD)

**Files:**
- Create: `app/api/rsvp/route.ts`
- Create: `__tests__/api/rsvp.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/api/rsvp.test.ts`:
```typescript
/**
 * @jest-environment node
 */
jest.mock('@/lib/googleSheets', () => ({
  appendRsvpRow: jest.fn().mockResolvedValue(undefined),
}));

import { POST } from '@/app/api/rsvp/route';
import { appendRsvpRow } from '@/lib/googleSheets';
import { NextRequest } from 'next/server';

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/rsvp', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 200 and calls appendRsvpRow with valid data', async () => {
    const req = makeRequest({ name: 'Alice', pax: 2, phone: '0123456789' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(appendRsvpRow).toHaveBeenCalledWith({ name: 'Alice', pax: 2, phone: '0123456789' });
  });

  it('returns 400 when name is missing', async () => {
    const req = makeRequest({ name: '', pax: 2, phone: '0123456789' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it('returns 400 when pax is not a positive integer', async () => {
    const req = makeRequest({ name: 'Alice', pax: 0, phone: '0123456789' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when phone is missing', async () => {
    const req = makeRequest({ name: 'Alice', pax: 2, phone: '' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 500 when Google Sheets throws', async () => {
    (appendRsvpRow as jest.Mock).mockRejectedValueOnce(new Error('Sheets error'));
    const req = makeRequest({ name: 'Alice', pax: 2, phone: '0123456789' });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npm test -- __tests__/api/rsvp.test.ts
```
Expected: FAIL — route module not found.

- [ ] **Step 3: Create API route**

Create `app/api/rsvp/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { appendRsvpRow } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, pax, phone } = body as Record<string, unknown>;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (typeof pax !== 'number' || pax < 1 || !Number.isInteger(pax)) {
    return NextResponse.json({ error: 'Pax must be a positive integer' }, { status: 400 });
  }
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
  }

  try {
    await appendRsvpRow({ name: name.trim(), pax, phone: phone.trim() });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Google Sheets error:', error);
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test -- __tests__/api/rsvp.test.ts
```
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Run all tests**

```bash
npm test
```
Expected: All tests pass across all test files.

- [ ] **Step 6: Commit**

```bash
git add app/api/rsvp/route.ts __tests__/api/rsvp.test.ts
git commit -m "feat: add RSVP API route with Google Sheets integration and tests"
```

---

## Task 17: Google Sheets Service Account Setup

This task is setup/configuration — no code changes. Follow each step before deploying.

- [ ] **Step 1: Create a Google Cloud project**

1. Go to https://console.cloud.google.com/
2. Click "New Project" → name it `wedding-invitation` → Create.

- [ ] **Step 2: Enable the Google Sheets API**

1. In your project, go to "APIs & Services" → "Library"
2. Search "Google Sheets API" → Enable it.

- [ ] **Step 3: Create a service account**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: `wedding-rsvp` → Create
4. Skip optional steps → Done

- [ ] **Step 4: Generate a JSON key**

1. Click your new service account → "Keys" tab
2. "Add Key" → "Create new key" → JSON → Create
3. A `.json` file downloads — keep it safe, do not commit it.

- [ ] **Step 5: Create your Google Sheet**

1. Go to https://sheets.google.com → create a new spreadsheet
2. Name it "Wedding RSVP"
3. In row 1, add headers: `Timestamp | Name | Pax | Phone`
4. Copy the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`

- [ ] **Step 6: Share the sheet with your service account**

1. In your spreadsheet → Share
2. Add the service account email (found in the JSON key file, field `client_email`)
3. Role: Editor → Share

- [ ] **Step 7: Create .env.local**

In your project root, create `.env.local` (never commit this file):
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nABC123...\n-----END RSA PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-spreadsheet-id-here
```

Copy `client_email` and `private_key` from the downloaded JSON file.
For `GOOGLE_PRIVATE_KEY`: paste the key value inside double quotes, replacing literal newlines with `\n`.

- [ ] **Step 8: Test locally**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
npm run dev
```
Open http://localhost:3000, scroll to RSVP, submit a test entry. Check your Google Sheet — a new row should appear within seconds.

---

## Task 18: GitHub Repository Setup

- [ ] **Step 1: Create GitHub repository**

Go to https://github.com/new:
- Repository name: `digital-invitation`
- Visibility: Private (recommended)
- Do NOT initialize with README (you already have one locally)
- Click "Create repository"

- [ ] **Step 2: Add remote and push**

```bash
git remote add origin https://github.com/YOUR_USERNAME/digital-invitation.git
git branch -M main
git push -u origin main
```
Replace `YOUR_USERNAME` with your GitHub username.
Expected: all commits pushed, repo visible on GitHub.

---

## Task 19: Vercel Deployment

- [ ] **Step 1: Connect repo to Vercel**

1. Go to https://vercel.com → Log in (create free account if needed)
2. Click "Add New Project"
3. Import your `digital-invitation` GitHub repo
4. Framework: Next.js (auto-detected)
5. Root directory: `.` (leave default)
6. Click "Deploy"

- [ ] **Step 2: Add environment variables in Vercel**

After first deploy (it will fail without env vars — that's expected):
1. Go to your Vercel project → "Settings" → "Environment Variables"
2. Add these three variables (same values as your `.env.local`):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`
3. Apply to: Production, Preview, Development

- [ ] **Step 3: Redeploy**

1. Go to "Deployments" tab → click the failed deployment → "Redeploy"
   OR push a new commit to trigger auto-deploy:
```bash
git commit --allow-empty -m "chore: trigger redeploy with env vars"
git push
```
Expected: deployment succeeds, live URL appears (e.g. `https://digital-invitation-abc.vercel.app`).

- [ ] **Step 4: Test production**

Open the live Vercel URL on your phone:
- Scroll through all sections
- Submit a test RSVP
- Confirm the row appears in your Google Sheet

- [ ] **Step 5: (Optional) Add custom domain**

In Vercel project → "Settings" → "Domains" → add your custom domain and follow the DNS instructions.

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "chore: add deployment notes to gitignore"
git push
```

---

## Done — Future Additions

| Feature | What to do |
|---|---|
| Background music | Add MP3 to `public/music/song.mp3`, wire up the existing music button in `Hero.tsx` with a `<audio>` element and toggle state |
| Personalized guest URLs | Add `?guest=Name` query param, read in page component, pre-fill RSVP name field |
| RSVP admin view | Google Sheets already serves this — share the sheet with whoever needs access |
