import { NextRequest } from "next/server";
import { getVideosByTopic, toCards } from "@/lib/data";
import type { VideoCardData } from "@/lib/types";

const GRADIENTS = [
  "linear-gradient(135deg, #7f00ff, #e100ff)",
  "linear-gradient(135deg, #00c6ff, #0072ff)",
  "linear-gradient(135deg, #f953c6, #b91d73)",
  "linear-gradient(135deg, #134e5e, #71b280)",
  "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  "linear-gradient(135deg, #c31432, #240b36)",
  "linear-gradient(135deg, #41295a, #2f0743)",
  "linear-gradient(135deg, #16222a, #3a6073)",
];
const EMOJIS = ["🎓", "📚", "🧠", "🔬", "💡", "⚙️", "📐", "🌍"];

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

async function searchYouTube(q: string, key: string): Promise<VideoCardData[]> {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", `${q} explained`);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "12");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("safeSearch", "moderate");
  url.searchParams.set("relevanceLanguage", "en");
  url.searchParams.set("key", key);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API ${res.status}`);
  const data = (await res.json()) as { items?: any[] };
  const items = data.items ?? [];
  const topic = titleCase(q);

  return items
    .map((it, i) => ({
      id: it?.id?.videoId ?? "",
      youtubeId: it?.id?.videoId ?? "",
      topic,
      title: it?.snippet?.title ?? "Untitled",
      creator: it?.snippet?.channelTitle ?? "YouTube",
      durationSec: 8,
      transcript: it?.snippet?.description ?? "",
      tags: [],
      gradient: GRADIENTS[i % GRADIENTS.length],
      emoji: EMOJIS[i % EMOJIS.length],
    }))
    .filter((v) => v.youtubeId);
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const key = process.env.YOUTUBE_API_KEY;

  if (key && q) {
    try {
      const videos = await searchYouTube(q, key);
      if (videos.length > 0) {
        return Response.json({ videos, source: "youtube" });
      }
    } catch {
      // fall through to the curated library
    }
  }

  return Response.json({ videos: toCards(getVideosByTopic(q)), source: "library" });
}
