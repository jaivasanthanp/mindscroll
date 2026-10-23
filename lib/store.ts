import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Game, Score } from "./types";

/**
 * File-backed store — works instantly with $0 and zero setup for local demos.
 *
 * NOTE: files are written under `.data/` (gitignored). This is fine for
 * `next dev` and a single-server demo. For the deployed version (Vercel
 * serverless has an ephemeral filesystem), swap this module for Supabase —
 * the schema is in `supabase/schema.sql`.
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const GAMES_FILE = path.join(DATA_DIR, "games.json");
const SCORES_FILE = path.join(DATA_DIR, "scores.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function saveGame(game: Game): Promise<Game> {
  const games = await readJson<Game[]>(GAMES_FILE, []);
  await writeJson(GAMES_FILE, [game, ...games.filter((g) => g.id !== game.id)].slice(0, 500));
  return game;
}

export async function getGame(id: string): Promise<Game | null> {
  const games = await readJson<Game[]>(GAMES_FILE, []);
  return games.find((g) => g.id === id) ?? null;
}

export async function saveScore(input: Omit<Score, "id" | "createdAt">): Promise<Score> {
  const score: Score = { ...input, id: randomUUID(), createdAt: Date.now() };
  const scores = await readJson<Score[]>(SCORES_FILE, []);
  await writeJson(SCORES_FILE, [score, ...scores].slice(0, 5000));
  return score;
}

export async function getScores(gameId: string): Promise<Score[]> {
  const scores = await readJson<Score[]>(SCORES_FILE, []);
  return scores
    .filter((s) => s.gameId === gameId)
    .sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)
    .slice(0, 50);
}
