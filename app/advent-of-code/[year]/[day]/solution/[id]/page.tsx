import Link from "next/link";
import { redirect } from "next/navigation";
import clsx from "clsx";
import utilStyles from "@styles/utils.module.sass";
import LinkButton from "@components/link_button";
import { revalidatePath } from "next/cache";
import { getPuzzleByDay } from "@lib/actions/puzzles";
import { PuzzleType } from "@lib/actions/puzzles/types";
import { SolutionType } from "@lib/actions/solutions/types";
import { getSolution } from "@lib/actions/solutions";

export default async function AOCSolutionPage({ children, params }: { children: React.ReactNode, params: { year: string, day: string, id: string } }) {
  const { year, day, id } = await params;

  const puzzleResponse: { puzzle: PuzzleType } | { error: Error } = await getPuzzleByDay(Number(day), Number(year));

  if ("error" in puzzleResponse) {
    console.error(puzzleResponse.error);
    redirect(`/advent-of-code/${year}/${day}`);
  }

  const { puzzle } = puzzleResponse;

  const solutionResponse: { solution: SolutionType } | { error: Error } = await getSolution(Number(id));

  if ("error" in solutionResponse) {
    console.error(solutionResponse.error);
    redirect(puzzle.url);
  }

  const solution = solutionResponse.solution;
  console.log(solution);

  return (
    <section>
      <h3 className={utilStyles.headingSm}>Day {day} Solution</h3>
    </section>
  )
}