import { NextRequest } from "next/server";
import { generateGame } from "@/lib/ai";
import { saveGame } from "@/lib/store";
import type { GenVideo } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { videos?: unknown[]; userId?: string };
    const videos: GenVideo[] = (body.videos ?? [])
      .slice(0, 3)
      .map((v) => {
        const o = (v ?? {}) as Record<string, unknown>;
        return {
          id: String(o.id ?? o.youtubeId ?? ""),
          title: String(o.title ?? ""),
          topic: String(o.topic ?? ""),
          transcript: String(o.transcript ?? o.description ?? ""),
          facts: Array.isArray(o.facts) ? (o.facts as GenVideo["facts"]) : undefined,
        };
      })
      .filter((v) => v.id && v.title);

    if (videos.length === 0) {
      return Response.json({ error: "No videos provided" }, { status: 400 });
    }

    const game = await generateGame(videos, body.userId);
    await saveGame(game);
    return Response.json({ game });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 },
    );
  }
}
