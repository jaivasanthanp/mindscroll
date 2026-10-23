# ⚔️ MindScroll

**Scroll to learn, battle to master.**

An Instagram-style learning feed where you swipe through short lessons on a topic — and after your 3rd video, an AI forges a **boss-battle quiz game that is unique to your exact sequence of videos**. Beat it, then challenge a friend with *your* game and *your* score.

Built for the **Fulda 2026 Hackathon** ("serious games · interactive learning · personalised education").

---

## The demo loop (90 seconds)

1. Search a topic → e.g. **"linear algebra"**
2. Swipe 3 short lessons → a status bar fills ("forging your boss…")
3. A boss game appears, built from **those exact 3 videos**
4. Play → get a score → **Copy challenge** link
5. Friend opens the link → plays *your* game → leaderboard updates live

---

## Quickstart (runs in 2 minutes, costs **$0**)

```bash
cd mindscroll
npm install
npm run dev
```

Open **http://localhost:3000**.

It works **immediately with zero API keys** — the default `AI_PROVIDER=mock` generator is deterministic, offline, and free.

> To test on your phone over Wi‑Fi, run `npm run dev -- -H 0.0.0.0` and open the printed **Network** URL on your phone.

---

## What does it cost?

| Service | Hackathon cost | Card needed? |
|---|---|---|
| Vercel (hosting) | Free Hobby tier | No |
| Supabase (DB/auth/realtime) | Free tier | No |
| LLM — **mock mode** | **$0** | No |
| LLM — Google Gemini / Groq | Free tier | No |
| LLM — OpenAI (gpt-4o-mini) | ~$5 prepaid | Yes |

**Total: $0** (or $5 if you insist on OpenAI). No subscriptions.

---

## How it works

```
[Phone / browser]  PWA (Next.js + Tailwind)
        │  feed · status bar · boss game · share link
        ▼
[Next.js API routes]
   ├─ GET  /api/videos?topic=…        → feed
   ├─ POST /api/generate              → transcripts → LLM → game JSON
   ├─ GET  /api/game/:id              → shared challenge
   └─ GET/POST /api/scores            → leaderboard
        ▼
[lib/ai.ts]  mock (free) OR Gemini / Groq / OpenAI via plain fetch
[lib/store.ts]  file-backed `.data/` (local) OR Supabase (production)
```

**The secret sauce** — a game's identity is a deterministic hash:

```
seed = sha256(video1 + video2 + video3 + userId)
```

Same sequence → same game (shareable, replayable, anti-cheat). Different sequence → a different game. Sharing is just a URL: `/game/<seed>`.

---

## Going live (optional, ~5 min each)

### 0. Real video search (any topic, any channel)
Add a free [YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com) key to `.env.local`:

```env
YOUTUBE_API_KEY=your_key_here
```

Now the search box searches **all of YouTube** (embeddable, relevance-ranked videos from any channel) instead of the built-in library. Each result's description feeds the game generator, so the boss game is still built from what you watched. Without a key, search falls back to the 5 built-in topics (Linear Algebra, Machine Learning, Quantum Physics, Calculus, Computer Science).

### 1. Real AI (free)
Create a free key at [Google AI Studio](https://aistudio.google.com) (Gemini) or [Groq](https://console.groq.com), then edit `.env.local`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
# AI_MODEL=gemini-2.0-flash   (optional override)
```

Supported: `gemini` | `groq` | `openai`. If no key is present it **automatically falls back to mock** so your demo can never crash.

### 2. Real videos
Videos are **YouTube embeds by default** — set `youtubeId` in `lib/data.ts` (13 verified, embeddable videos are preloaded across 3 topics). They autoplay muted in the feed and auto-advance after ~8s (tap to skip). To use your own short-form clips, set `videoUrl` to a CORS-open `.mp4` instead; if neither is set, the card falls back to the animated-caption card.

### 3. Supabase (production persistence + realtime)
1. Create a free project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor.
3. Add to `.env.local`:
   ```env
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   ```
4. Swap `lib/store.ts` to Supabase (schema is ready; the file-backed store is fine for the local demo because Vercel serverless has an ephemeral filesystem).

### 4. Deploy to Vercel
Push to GitHub → import in [vercel.com](https://vercel.com) → deploy. Your share links become real public URLs. Add the same env vars in the Vercel dashboard.

---

## Project structure

```
app/
  page.tsx              → the feed
  game/[id]/page.tsx    → shared challenge
  api/
    videos/route.ts     → feed data (curated library)
    search/route.ts     → real YouTube search (with library fallback)
    generate/route.ts   → AI game generation
    game/[id]/route.ts  → fetch a challenge
    scores/route.ts     → leaderboard (GET + POST)
  layout.tsx, globals.css, manifest.ts, icon.svg
components/
  Feed.tsx              → scroll feed + "3/3 → forge boss" logic
  VideoCard.tsx         → one full-screen lesson card
  StatusBar.tsx         → "forging your boss…" progress
  BossGame.tsx          → the boss-battle quiz
  Leaderboard.tsx       → scores
lib/
  data.ts               → seed video library (topics + transcripts + facts)
  ai.ts                 → game generator (mock + Gemini/Groq/OpenAI)
  store.ts              → file-backed persistence
  types.ts              → shared types
supabase/schema.sql     → production schema
```

---

## Sharpest next moves (ranked for judging)

1. **Teacher dashboard mockup** — "78% of your class struggled with eigenvectors" (maps to *collaborate with institutions*).
2. **Attention signals** — track rewinds/slow-downs and feed them into the generator ("you rewatched determinants twice → the boss has a determinant phase").
3. **A Phaser arcade template** (concept-defense) alongside the quiz — more "serious game" wow.
4. **Supabase Realtime leaderboards** so scores update without refresh.

## Scripts

```bash
npm run dev      # local dev
npm run build    # production build (run before deploying)
npm run lint     # lint
```
