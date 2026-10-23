import { NextRequest } from "next/server";
import { getVideosByTopic, listTopics } from "@/lib/data";
import type { VideoCardData } from "@/lib/types";

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic") ?? "";
  const videos = getVideosByTopic(topic);
  const cards: VideoCardData[] = videos.map((v) => ({
    id: v.id,
    topic: v.topic,
    title: v.title,
    creator: v.creator,
    durationSec: v.durationSec,
    youtubeId: v.youtubeId,
    videoUrl: v.videoUrl,
    transcript: v.transcript,
    tags: v.tags,
    gradient: v.gradient,
    emoji: v.emoji,
  }));
  return Response.json({ topics: listTopics(), videos: cards });
}
