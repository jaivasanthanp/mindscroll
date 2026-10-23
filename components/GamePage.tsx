"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Game } from "@/lib/types";
import BossGame from "./BossGame";

export default function GamePage({ id }: { id: string }) {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/game/${encodeURIComponent(id)}`)
      .then(async (r) => {
        const d = await r.json();
        if (r.ok) setGame(d.game);
        else setError(d.error ?? "Challenge not found");
      })
      .catch(() => setError("Failed to load challenge"));
  }, [id]);

  if (error) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-2 text-white">
        <p>{error}</p>
        <Link href="/" className="text-sm text-cyan-300 underline">
          Create your own →
        </Link>
      </div>
    );
  }

  if (!game) {
    return <div className="flex h-dvh items-center justify-center text-white/60">Loading challenge…</div>;
  }

  return <BossGame game={game} onExit={() => window.location.assign("/")} />;
}
