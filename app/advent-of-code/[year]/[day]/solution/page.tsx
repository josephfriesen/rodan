import { getPuzzleByDay } from "@lib/actions/puzzles";
import { PuzzleType } from "@lib/actions/puzzles/types";
import { redirect } from "next/navigation";

export default async function AOCSolutionsListPage({
  params: { year, day },
}): Promise<null> {
  const puzzleResponse: { puzzle: PuzzleType } | { error: Error } =
    await getPuzzleByDay(Number(day), Number(year));

  if ("error" in puzzleResponse) {
    console.error(puzzleResponse.error);
    redirect(`/advent-of-code/`);
  }

  if ("puzzle" in puzzleResponse) {
    redirect(puzzleResponse.puzzle.url);
  }

  return null;
}
