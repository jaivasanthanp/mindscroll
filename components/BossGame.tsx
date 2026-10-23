"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Game, GameQuestion, Score } from "@/lib/types";
import Leaderboard from "./Leaderboard";

const TIME_PER_Q = 12000;

function shuffleOptions(q: GameQuestion): string[] {
  const opts = [q.correct, ...q.wrong];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

export default function BossGame({ game, onExit }: { game: Game; onExit?: () => void }) {
  const [screen, setScreen] = useState<"intro" | "play" | "result">("intro");
  const [name, setName] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [bossHp, setBossHp] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [scores, setScores] = useState<Score[]>([]);
  const [shareCopied, setShareCopied] = useState(false);

  const total = game.questions.length;
  const question = game.questions[Math.min(qIndex, total - 1)];
  const correctRef = useRef(0);
  const pickedRef = useRef<string | null>(null);

  useEffect(() => {
    correctRef.current = correctCount;
  }, [correctCount]);
  useEffect(() => {
    pickedRef.current = picked;
  }, [picked]);

  useEffect(() => {
    const stored = localStorage.getItem("mindscroll.name") ?? "";
    setName(stored);
  }, []);

  useEffect(() => {
    fetch(`/api/scores?gameId=${encodeURIComponent(game.id)}`)
      .then((r) => r.json())
      .then((d) => setScores(d.scores ?? []))
      .catch(() => {});
  }, [game.id]);

  const applyCorrect = useCallback(() => {
    setCorrectCount((c) => c + 1);
    setBossHp((b) => Math.max(0, b - 1 / total));
  }, [total]);

  const applyWrong = useCallback(() => {
    setHearts((h) => h - 1);
  }, []);

  const finish = useCallback(() => {
    const c = correctRef.current;
    const accuracy = total ? c / total : 0;
    const player = (localStorage.getItem("mindscroll.name") || "Anonymous").trim() || "Anonymous";
    fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: game.id,
        playerName: player,
        score: c * 100,
        maxScore: total * 100,
        accuracy,
      }),
    })
      .then((r) => r.json())
      .then((d) => setScores(d.scores ?? []))
      .catch(() => {})
      .finally(() => setScreen("result"));
  }, [game.id, total]);

  const start = useCallback(() => {
    localStorage.setItem("mindscroll.name", name.trim() || "Anonymous");
    setQIndex(0);
    setCorrectCount(0);
    setHearts(3);
    setBossHp(1);
    setPicked(null);
    setScreen("play");
    setOptions(shuffleOptions(game.questions[0]));
  }, [game.questions, name]);

  // timer per question
  useEffect(() => {
    if (screen !== "play" || picked) return;
    setOptions(shuffleOptions(question));
    setTimeLeft(TIME_PER_Q);
    const startT = Date.now();
    const iv = setInterval(() => {
      const left = TIME_PER_Q - (Date.now() - startT);
      setTimeLeft(Math.max(0, left));
      if (left <= 0) {
        clearInterval(iv);
        if (pickedRef.current === null) {
          setPicked("⏱ timeout");
          applyWrong();
          setTimeout(() => {
            setQIndex((i) => i + 1);
            setPicked(null);
          }, 1000);
        }
      }
    }, 100);
    return () => clearInterval(iv);
  }, [screen, qIndex, picked, question, applyWrong]);

  // end detection
  useEffect(() => {
    if (screen !== "play" || total === 0) return;
    if (hearts <= 0 || qIndex >= total) {
      const t = setTimeout(finish, 1000);
      return () => clearTimeout(t);
    }
  }, [screen, hearts, qIndex, total, finish]);

  function onPick(opt: string) {
    if (picked) return;
    setPicked(opt);
    if (opt === question.correct) applyCorrect();
    else applyWrong();
    setTimeout(() => {
      setQIndex((i) => i + 1);
      setPicked(null);
    }, 1000);
  }

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/game/${game.id}` : `/game/${game.id}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator
        .share({ title: game.title, text: `Beat my score on "${game.title}"!`, url: shareUrl })
        .catch(() => {});
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a] text-white">
      {/* ------------------------------------------------ INTRO */}
      {screen === "intro" && (
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
          <div className="pulse-glow text-7xl">🦹</div>
          <h2 className="mt-4 text-3xl font-black">{game.title}</h2>
          <p className="mt-1 text-lg font-semibold text-fuchsia-300">{game.bossName}</p>
          <p className="mt-2 max-w-xs text-sm text-white/70">{game.theme}</p>
          <p className="mt-3 max-w-xs text-xs text-white/50">
            From: {game.videoTitles.join(" → ")}
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-6 w-64 rounded-full bg-white/10 px-4 py-2 text-center text-sm outline-none placeholder:text-white/40"
          />
          <button
            onClick={start}
            className="mt-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-8 py-3 font-black text-black transition hover:opacity-90"
          >
            ⚔️ FIGHT
          </button>
        </div>
      )}

      {/* ------------------------------------------------ PLAY */}
      {screen === "play" && (
        <div className="flex h-full flex-col p-5">
          {/* boss bar */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold">🦹 {game.bossName}</span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className={i < hearts ? "" : "opacity-25 grayscale"}>
                  ❤️
                </span>
              ))}
            </span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-500"
              style={{ width: `${bossHp * 100}%` }}
            />
          </div>

          {/* timer */}
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-cyan-400 transition-[width] duration-100"
              style={{ width: `${(timeLeft / TIME_PER_Q) * 100}%` }}
            />
          </div>

          {/* question */}
          <div className="mt-6 flex-1">
            <div className="text-xs text-white/50">
              Question {Math.min(qIndex + 1, total)}/{total} · difficulty{" "}
              {"⭐".repeat(question?.difficulty ?? 1)}
            </div>
            <h3 className="mt-2 text-xl font-bold leading-snug">{question?.q}</h3>

            <div className="mt-5 grid gap-3">
              {options.map((opt) => {
                const isCorrect = opt === question.correct;
                const isPicked = opt === picked;
                let cls = "border-white/10 bg-white/10 hover:bg-white/20";
                if (picked) {
                  if (isCorrect) cls = "border-emerald-300/60 bg-emerald-500/90";
                  else if (isPicked) cls = "border-red-300/60 bg-red-500/90";
                  else cls = "border-white/5 bg-white/5 opacity-60";
                }
                return (
                  <button
                    key={opt}
                    onClick={() => onPick(opt)}
                    disabled={!!picked}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {picked && question?.explain && (
              <p className="mt-4 rounded-lg bg-white/5 p-3 text-sm text-white/70">
                💡 {question.explain}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------ RESULT */}
      {screen === "result" && (
        <div className="flex h-full flex-col items-center justify-center overflow-y-auto p-6 text-center">
          <div className="text-7xl">
            {correctCount === total ? "🏆" : correctCount >= total * 0.6 ? "🎉" : "💀"}
          </div>
          <h2 className="mt-3 text-3xl font-black">
            {correctCount === total ? "Flawless victory!" : "Boss defeated!"}
          </h2>
          <p className="mt-2 text-lg">
            Score: <span className="font-mono font-bold text-cyan-300">{correctCount * 100}</span>
          </p>
          <p className="text-sm text-white/60">
            {correctCount}/{total} correct · {Math.round((correctCount / Math.max(1, total)) * 100)}%
            accuracy
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={copyLink}
              className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
            >
              {shareCopied ? "✅ Copied!" : "🔗 Copy challenge"}
            </button>
            <button
              onClick={nativeShare}
              className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
            >
              📤 Share
            </button>
            <button
              onClick={start}
              className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
            >
              🔁 Retry
            </button>
          </div>

          <div className="mt-6 w-full max-w-sm">
            <Leaderboard scores={scores} />
          </div>

          {onExit && (
            <button onClick={onExit} className="mt-6 text-sm text-white/50 underline">
              ← Keep scrolling
            </button>
          )}
        </div>
      )}
    </div>
  );
}
