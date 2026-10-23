import { createHash } from "crypto";
import type { Game, GameQuestion, GenVideo } from "./types";

/** Deterministic PRNG (mulberry32) so the same seed always yields the same game. */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The magic: your exact sequence of videos becomes a stable, shareable fingerprint. */
export function seedFrom(videoIds: string[], userId?: string): string {
  return createHash("sha256")
    .update([...videoIds, userId ?? "anon"].join("|"))
    .digest("hex")
    .slice(0, 16);
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BOSSES: Record<string, string[]> = {
  linear: ["The Eigenvector Lich", "Matrix Overlord", "The Determinant Wraith", "Basis Breaker"],
  machine: ["The Overfitting Ogre", "Gradient Golem", "Neural Hydra", "Loss Lich"],
  quantum: ["The Superposition Specter", "Entangled Twin", "Wavefunction Wraith", "Collapse Colossus"],
  calculus: ["The Derivative Dragon", "Integral Ijiraq", "Limit Leviathan", "The Chain Rule Chimera"],
  computer: ["The Binary Basilisk", "Logic Gate Golem", "The Turing Terror", "Transistor Troll"],
};
const DEFAULT_BOSSES = ["The Knowledge Colossus", "Concept Crusher", "The Curse of Cramming"];

function pickBoss(topic: string, rand: () => number): string {
  const key = Object.keys(BOSSES).find((k) => topic.toLowerCase().includes(k));
  const list = key ? BOSSES[key] : DEFAULT_BOSSES;
  return list[Math.floor(rand() * list.length)];
}

function clampDifficulty(d: number): 1 | 2 | 3 {
  if (d >= 3) return 3;
  if (d <= 1) return 1;
  return 2;
}

function normalizeQuestions(raw: unknown[]): GameQuestion[] {
  return raw
    .map((item) => {
      const q = (item ?? {}) as Record<string, unknown>;
      const wrong = Array.isArray(q.wrong) ? q.wrong.map(String).slice(0, 3) : [];
      while (wrong.length < 3) wrong.push("None of the above");
      return {
        q: String(q.q ?? "What concept was covered?"),
        correct: String(q.correct ?? ""),
        wrong,
        difficulty: clampDifficulty(Number(q.difficulty) || 1),
        explain: q.explain ? String(q.explain) : undefined,
      } satisfies GameQuestion;
    })
    .filter((q) => q.q && q.correct)
    .slice(0, 12);
}

// ---- Question synthesis for videos without curated facts (e.g. search results) ----
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with", "without",
  "by", "at", "from", "is", "are", "was", "were", "be", "been", "being", "this", "that",
  "these", "those", "it", "its", "as", "how", "what", "why", "when", "which", "who", "you",
  "we", "they", "he", "she", "can", "could", "will", "would", "should", "into", "about",
  "than", "then", "their", "there", "your", "our", "more", "most", "some", "any", "all",
  "also", "just", "like", "not", "no", "so", "if", "each", "other", "such", "between",
  "during", "before", "after", "over", "under", "again", "further", "once", "here", "only",
  "own", "same", "too", "very", "through", "where", "while", "because", "until", "both",
  "few", "many", "has", "have", "had", "do", "does", "did", "get", "gets", "out", "up",
  "down", "off", "one", "two", "three", "learn", "learning", "video", "videos", "watch",
]);

function significantWords(sentence: string): string[] {
  return sentence
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Za-z0-9'-]/g, ""))
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w.toLowerCase()));
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function synthesizeQuestions(videos: GenVideo[], rand: () => number): GameQuestion[] {
  const qs: GameQuestion[] = [];
  const pool = new Set<string>();
  for (const v of videos) {
    for (const w of significantWords(v.transcript)) pool.add(w);
  }

  videos.forEach((v, idx) => {
    const difficulty = clampDifficulty(idx + 1);
    const sentences = v.transcript
      .split(/[.?!]\s+/)
      .map((s) => s.trim())
      .filter((s) => s.split(/\s+/).length >= 6);
    for (const s of sentences.slice(0, 2)) {
      let candidates = significantWords(s).filter((w) => /^[A-Z]/.test(w));
      if (candidates.length === 0) candidates = significantWords(s);
      if (candidates.length === 0) continue;
      const key = candidates[0];
      const masked = s.replace(new RegExp(`\\b${escapeRegExp(key)}\\b`), "_____");
      const distractors = shuffle(
        [...pool].filter((w) => w.toLowerCase() !== key.toLowerCase()),
        rand,
      ).slice(0, 3);
      if (distractors.length < 3) continue;
      qs.push({
        q: `Complete the idea: “${masked}”`,
        correct: key,
        wrong: distractors,
        difficulty,
        explain: `From “${v.title}”`,
      });
    }
  });

  return qs;
}

// ---- Mock generator (zero keys, zero cost, deterministic) ----
function mockGame(videos: GenVideo[], userId?: string): Game {
  const id = seedFrom(videos.map((v) => v.id), userId);
  const rand = mulberry32(parseInt(id.slice(0, 8), 16) || 1);
  const topic = videos[0]?.topic ?? "General";
  const bossName = pickBoss(topic, rand);

  const questions: GameQuestion[] = [];
  videos.forEach((v, idx) => {
    const difficulty = clampDifficulty(idx + 1);
    for (const f of v.facts ?? []) {
      questions.push({
        q: f.q,
        correct: f.correct,
        wrong: f.wrong.slice(0, 3),
        difficulty,
        explain: f.explain,
      });
    }
  });

  // Searched videos have no curated facts → synthesize recall questions.
  if (questions.length < 3) {
    questions.push(...synthesizeQuestions(videos, rand));
  }

  return {
    id,
    title: `${topic} Boss Battle`,
    bossName,
    theme: `Forged from your ${videos.length} videos on ${topic.toLowerCase()}`,
    topic,
    videoIds: videos.map((v) => v.id),
    videoTitles: videos.map((v) => v.title),
    questions: shuffle(questions, rand).slice(0, 9),
    createdAt: Date.now(),
  };
}

function buildPrompt(videos: GenVideo[]): string {
  const lines = videos
    .map((v, i) => `VIDEO ${i + 1} "${v.title}" (difficulty ${i + 1}):\n${v.transcript}`)
    .join("\n\n");
  return [
    "You are a game designer for a learning app. A learner just watched these videos, in order.",
    lines,
    "",
    'Create a short boss-battle quiz that tests the concepts actually covered. Output STRICT JSON with exactly this shape:',
    '{"title":"...","bossName":"...","theme":"...","questions":[{"q":"...","correct":"...","wrong":["...","...","..."],"difficulty":1,"explain":"one short sentence"}]}',
    "Rules: 6-9 questions. Each question has exactly 3 wrong distractors that are plausible but false. difficulty is 1, 2 or 3 and ramps with video order. Cover all three videos. Do not invent facts beyond the content given.",
  ].join("\n");
}

function extractJson(text: string): unknown {
  const cleaned = text.replace(/```(?:json)?/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in LLM output");
  return JSON.parse(cleaned.slice(start, end + 1));
}

type LLMResult = { title: string; bossName: string; theme: string; questions: unknown[] };

async function callProvider(videos: GenVideo[]): Promise<LLMResult> {
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  const prompt = buildPrompt(videos);

  if (provider === "gemini") {
    const key = process.env.GEMINI_API_KEY;
    const model = process.env.AI_MODEL ?? "gemini-2.0-flash";
    if (!key) throw new Error("GEMINI_API_KEY is not set");
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
        }),
      },
    );
    if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return extractJson(text) as LLMResult;
  }

  if (provider === "groq" || provider === "openai") {
    const key = provider === "groq" ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    const model =
      process.env.AI_MODEL ?? (provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini");
    const url =
      provider === "groq"
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
    if (!key) throw new Error(`${provider.toUpperCase()}_API_KEY is not set`);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });
    if (!res.ok) throw new Error(`${provider} error ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content ?? "";
    return extractJson(text) as LLMResult;
  }

  throw new Error(`Unknown AI_PROVIDER: ${provider}`);
}

export async function generateGame(videos: GenVideo[], userId?: string): Promise<Game> {
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  const hasKey =
    Boolean(process.env.GEMINI_API_KEY) ||
    Boolean(process.env.GROQ_API_KEY) ||
    Boolean(process.env.OPENAI_API_KEY);

  // Fail soft: if no key is configured, fall back to the deterministic mock so the demo never dies.
  if (provider === "mock" || !hasKey) return mockGame(videos, userId);

  const id = seedFrom(videos.map((v) => v.id), userId);
  const topic = videos[0]?.topic ?? "General";
  const result = await callProvider(videos);
  return {
    id,
    title: result.title || `${topic} Boss Battle`,
    bossName: result.bossName || pickBoss(topic, () => Math.random()),
    theme: result.theme || `Forged from your ${videos.length} videos on ${topic.toLowerCase()}`,
    topic,
    videoIds: videos.map((v) => v.id),
    videoTitles: videos.map((v) => v.title),
    questions: normalizeQuestions(result.questions),
    createdAt: Date.now(),
  };
}
