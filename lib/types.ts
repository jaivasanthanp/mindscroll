export type Fact = {
  q: string;
  correct: string;
  wrong: string[];
  explain?: string;
};

export type Video = {
  id: string;
  topic: string; // topic label, e.g. "Linear Algebra"
  title: string;
  creator: string;
  durationSec: number;
  /** Optional: a YouTube video id (streams an embed). Takes priority over videoUrl. */
  youtubeId?: string;
  /** Optional: an .mp4 URL. If neither youtubeId nor videoUrl is set, the card uses an animated caption mode. */
  videoUrl?: string;
  transcript: string;
  tags: string[];
  gradient: string; // CSS background for the card
  emoji: string;
  facts: Fact[];
};

export type GameQuestion = {
  q: string;
  correct: string;
  wrong: string[]; // 3 distractors
  difficulty: 1 | 2 | 3;
  explain?: string;
};

export type Game = {
  id: string; // deterministic seed: sha256(videoIds + userId)
  title: string;
  bossName: string;
  theme: string;
  topic: string;
  videoIds: string[];
  videoTitles: string[];
  questions: GameQuestion[];
  createdAt: number;
};

export type Score = {
  id: string;
  gameId: string;
  playerName: string;
  score: number;
  maxScore: number;
  accuracy: number;
  createdAt: number;
};

export type TopicMeta = {
  slug: string;
  label: string;
  emoji: string;
  description: string;
};

/** What the client receives: the full video minus the curated answer facts. */
export type VideoCardData = Omit<Video, "facts">;

/** Minimal video shape needed to generate a game (works for curated *and* searched videos). */
export type GenVideo = {
  id: string;
  title: string;
  topic: string;
  transcript: string;
  facts?: Fact[];
};
