import GamePage from "@/components/GamePage";

// This route reads `params` at request time (dynamic), so allow it to block prerendering.
export const instant = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GamePage id={id} />;
}
