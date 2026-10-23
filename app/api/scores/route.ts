import { NextRequest } from "next/server";
import { getScores, saveScore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get("gameId") ?? "";
  return Response.json({ scores: await getScores(gameId) });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    gameId?: string;
    playerName?: string;
    score?: number;
    maxScore?: number;
    accuracy?: number;
  };

  if (!body.gameId) return Response.json({ error: "gameId is required" }, { status: 400 });

  const score = await saveScore({
    gameId: body.gameId,
    playerName: (body.playerName || "Anonymous").slice(0, 30),
    score: Math.max(0, Math.round(body.score ?? 0)),
    maxScore: Math.max(1, Math.round(body.maxScore ?? 1)),
    accuracy: Math.min(1, Math.max(0, body.accuracy ?? 0)),
  });

  return Response.json({ score, scores: await getScores(body.gameId) });
}
