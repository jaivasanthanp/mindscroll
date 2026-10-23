"use client";

import type { Score } from "@/lib/types";

export default function Leaderboard({ scores }: { scores: Score[] }) {
  return (
    <div className="w-full">
      <h3 className="mb-2 text-sm font-bold text-white/80">🏆 Leaderboard</h3>
      {scores.length === 0 ? (
        <p className="text-sm text-white/50">No challengers yet — be the first!</p>
      ) : (
        <ul className="space-y-1">
          {scores.slice(0, 10).map((s, i) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="w-5 shrink-0 text-white/50">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                </span>
                <span className="truncate text-white/90">{s.playerName}</span>
              </span>
              <span className="ml-2 font-mono font-bold text-cyan-300">{s.score}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
