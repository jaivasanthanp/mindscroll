"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Game, TopicMeta, VideoCardData } from "@/lib/types";
import VideoCard from "./VideoCard";
import StatusBar from "./StatusBar";
import BossGame from "./BossGame";

function getUid(): string {
  const key = "mindscroll.uid";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const uid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem(key, uid);
  return uid;
}

export default function Feed() {
  const [topics, setTopics] = useState<TopicMeta[]>([]);
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<VideoCardData[]>([]);
  const [active, setActive] = useState(0);
  const [maxSeen, setMaxSeen] = useState(0);
  const [phase, setPhase] = useState<"feed" | "generating" | "game">("feed");
  const [statusStep, setStatusStep] = useState(0);
  const [game, setGame] = useState<Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load the curated library (initial load + topic chips).
  const load = useCallback(async (topic: string) => {
    setVideos([]);
    const res = await fetch(`/api/videos?topic=${encodeURIComponent(topic)}`);
    const data = await res.json();
    setTopics(data.topics ?? []);
    setVideos(data.videos ?? []);
    setActive(0);
    setMaxSeen(0);
    setPhase("feed");
    setGame(null);
  }, []);

  // Real search: hits YouTube when a key is configured, else the curated library.
  const search = useCallback(
    async (q: string) => {
      const query = q.trim();
      if (!query) {
        load("");
        return;
      }
      setVideos([]);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setVideos(data.videos ?? []);
      setActive(0);
      setMaxSeen(0);
      setPhase("feed");
      setGame(null);
    },
    [load],
  );

  useEffect(() => {
    load("");
  }, [load]);

  const startGenerate = useCallback(async (watched: VideoCardData[]) => {
    setPhase("generating");
    setStatusStep(0);
    const userId = getUid();

    const fetchGame = fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videos: watched, userId }),
    })
      .then((r) => r.json())
      .then((d) => d.game as Game);

    const animate = new Promise<void>((resolve) => {
      let step = 0;
      const iv = setInterval(() => {
        step++;
        setStatusStep(step);
        if (step >= 3) {
          clearInterval(iv);
          resolve();
        }
      }, 550);
    });

    const [g] = await Promise.all([fetchGame, animate]);
    setGame(g);
    setPhase("game");
  }, []);

  // Advance to the next card (called on video end or tap).
  const advance = useCallback(() => {
    setActive((a) => (a < videos.length - 1 ? a + 1 : a));
  }, [videos.length]);

  // "watched" count = highest card index the user has reached.
  useEffect(() => {
    setMaxSeen((m) => Math.max(m, active));
  }, [active]);

  // After 3 watched videos → forge the boss game from that exact sequence.
  useEffect(() => {
    if (phase !== "feed" || videos.length === 0) return;
    if (maxSeen >= 3) {
      startGenerate(videos.slice(0, 3));
    }
  }, [maxSeen, phase, videos, startGenerate]);

  // Scroll to the active card.
  useEffect(() => {
    if (phase !== "feed") return;
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: active * el.clientHeight, behavior: "smooth" });
  }, [active, phase, videos.length]);

  // Reconcile the active card when the user swipes manually.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || phase !== "feed") return;
    const cards = Array.from(el.querySelectorAll("[data-card]"));
    const obs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            const idx = Number((en.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { root: el, threshold: 0.6 },
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [videos.length, phase]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black text-white">
      {/* game overlay */}
      {phase === "game" && game && (
        <BossGame
          game={game}
          onExit={() => {
            setPhase("feed");
            setActive(0);
            setMaxSeen(0);
          }}
        />
      )}

      {/* generating overlay */}
      {phase === "generating" && <StatusBar step={statusStep} />}

      {/* search + topic chips */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search(query);
          }}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 backdrop-blur"
        >
          <span className="text-sm">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any topic — “linear algebra”, “biology”…"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
          />
        </form>
        <div className="pointer-events-auto mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          {topics.map((t) => (
            <button
              key={t.slug}
              onClick={() => {
                setQuery(t.label);
                load(t.label);
              }}
              className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur transition hover:bg-white/20"
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* unlock progress pill */}
      <div className="absolute bottom-6 right-3 z-30 flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 text-xs font-bold backdrop-blur">
        <span>📚 {Math.min(maxSeen, 3)}/3</span>
        <span className="text-white/40">·</span>
        <span className={maxSeen >= 3 ? "text-cyan-300" : "text-white/70"}>
          ⚔️ {maxSeen >= 3 ? "Ready!" : "forge boss"}
        </span>
      </div>

      {/* feed */}
      <div
        ref={containerRef}
        className="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll"
      >
        {videos.map((v, i) => (
          <VideoCard key={v.id} video={v} index={i} active={i === active} onWatched={advance} />
        ))}
        {videos.length === 0 && (
          <div className="flex h-full items-center justify-center text-white/50">
            Loading videos…
          </div>
        )}
      </div>
    </div>
  );
}
