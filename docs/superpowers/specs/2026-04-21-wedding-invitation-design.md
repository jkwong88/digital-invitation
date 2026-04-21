# Wedding Digital Invitation — Design Spec

**Date:** 2026-04-21  
**Wedding date:** 2026-11-14 (Saturday)  
**Venue:** Ascott Gurney Penang

---

## Overview

A mobile-first digital wedding invitation web app that replicates the style of the reference screenshots. Guests open a URL on their phones and scroll through the full invitation experience, ending with an RSVP form that writes submissions to Google Sheets.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Native Vercel support, API routes built-in |
| Styling | Tailwind CSS | Utility-first, easy responsive design |
| Animations | Intersection Observer API | Fade-in on scroll, no heavy deps |
| RSVP backend | Next.js API route (`/api/rsvp`) | No separate server needed |
| RSVP storage | Google Sheets (via Google Sheets API v4) | Easy to view/manage without a database |
| Hosting | Vercel | Free tier, auto-deploy from GitHub |
| Version control | GitHub | Push to `main` → Vercel auto-deploys |

---

## Page Sections (top → bottom)

### 1. Hero
- Full-screen couple photo as background
- Overlay text: date `2026.11.14`, venue `Ascott Gurney Penang`
- Floating music button (top-right) — placeholder only, music skipped for now
- Text line: `合情 | 合理 | 合法 | 和你`
- Subtitle: `To Our Family And Friends, Thank You For Celebrating Our Special Day, Supporting Us And Sharing Our Love.`
- Bottom bar: `WEDDING   INVITATION   2026`

### 2. Love Story
- Header: `我的一封情书` (left) + `FOREVER` (right, red)
- Large display: `OUR LOVE STORY`
- Sub: `FALL IN LOVE`
- Couple photo (full width)
- `WEDDING INVITATION` badge with laurel decoration

### 3. Invitation Letter
- Multi-line Chinese poem text (centered):
  - 以前觉得婚礼是一则官方公告
  - 现在才明白这是一场人生为数不多的相聚
  - 是千里之外的奔赴
  - 是不计得失的支持
  - 感谢一路相伴的家人朋友
  - 许久未见 甚是想念
- Date: `2026.11.14`
- Large text: `我们，婚礼见~`
- Bottom bar: `WEDDING   INVITATION   2026`

### 4. Calendar
- Full-screen couple photo background
- Overlay calendar for November 2026
- Date 14 highlighted with a red heart icon
- Header shows: `11 / 14 —2026—`
- Weekday headers: MON TUE WED THU FRI SAT SUN

### 5. Countdown (Save the Date)
- Background: couple walking photo
- `SAVE THE DATE` heading
- `2026.11.14 Saturday`
- Live countdown blocks: DAYS / HOURS / MIN / SEC (deep red boxes, white text)
- Side text: `天光乍泄，落入凡尘烟火里 / 我跨越千山万水而来 / 只为与你共赴三餐四季`
- Two historical couple photos labeled `2017` and `2019`
- Script text: `As the clouds and mist dissipate / love you and everyone knows it`

### 6. Photo Gallery
- Horizontally scrollable strip of couple photos
- `FOREVER AND EVER` text rotated vertically beside the main photo
- Overlaid handwritten-style text: `好久不见 / 婚礼见~`

### 7. RSVP Form
- Section heading: `RSVP` (letter-spaced, red)
- Fields:
  - `* 姓名 NAME` (text)
  - `* 出席人数 PAX` (number)
  - `* 電話 PHONE` (tel)
- Submit button: deep red rounded, label `SUBMIT`
- Decorative couple illustration beside button
- Success state: slide-in confirmation message after submit

### 8. Footer
- `SEE YOU SOON` (red, letter-spaced)
- `我們期待與您共度美好時刻`

---

## RSVP API

**Endpoint:** `POST /api/rsvp`

**Request body:**
```json
{ "name": "string", "pax": "number", "phone": "string" }
```

**Validation:** all three fields required; pax must be a positive integer.

**Success response:** `200 { "ok": true }`

**Error response:** `400 { "error": "message" }` or `500 { "error": "..." }`

**Google Sheets write:** appends a row `[timestamp, name, pax, phone]` to the configured sheet using a service account.

---

## Visual Design

### Colors
| Name | Hex |
|---|---|
| White | `#ffffff` |
| Warm off-white | `#f5f0eb` |
| Near black | `#1a1a1a` |
| Deep red (primary) | `#8B1A1A` |
| Accent red | `#c0392b` |

### Fonts (Google Fonts)
| Font | Usage |
|---|---|
| Playfair Display | English headings |
| Cormorant Garamond | Script / italic quote text |
| Noto Serif SC | Chinese text |
| System sans-serif | Small caps labels (WEDDING, INVITATION, etc.) |

### Animations
- **Fade-up on scroll** — each section uses `IntersectionObserver` to fade in as it enters the viewport
- **Countdown timer** — `setInterval` every 1 second
- **Calendar heart** — CSS `@keyframes` pulse on the highlighted date
- **RSVP success** — CSS slide-in transition after successful submit

---

## Responsive Design

- Mobile-first (primary target: 390px wide iPhone)
- Breakpoint at `md` (768px) for tablet/desktop adjustments
- All photos use `next/image` with `width`/`height` for optimized loading
- Font sizes scale with `clamp()` or Tailwind responsive variants

---

## Environment Variables

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@yyy.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
GOOGLE_SHEET_ID=your-spreadsheet-id
```

Stored in `.env.local` locally; added in Vercel dashboard for production. Never committed to Git.

---

## GitHub & Deployment

1. Initialize Git repo in project root
2. Create GitHub repo, push to `main`
3. Connect repo to Vercel (one-time setup via vercel.com)
4. Every `git push origin main` triggers an automatic Vercel deploy (~30 sec)
5. Live URL: `https://your-project.vercel.app` (custom domain optional)

---

## Performance

- Static sections served from Vercel's CDN edge — handles 30+ simultaneous opens trivially
- Only the RSVP `POST /api/rsvp` hits a serverless function
- `next/image` handles photo optimization and lazy loading automatically

---

## Out of Scope

- Background music (can be added later by dropping an MP3 into `public/` and wiring up the existing music button)
- Guest-specific URLs / personalized invitations
- Admin dashboard for RSVP management (Google Sheets serves this purpose)
