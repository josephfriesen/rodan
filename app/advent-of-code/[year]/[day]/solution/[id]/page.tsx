import { redirect } from "next/navigation";
import clsx from "clsx";
import { getPuzzleByDay } from "@lib/actions/puzzles";
import { PuzzleType } from "@lib/actions/puzzles/types";
import { SolutionType } from "@lib/actions/solutions/types";
import { getSolution } from "@lib/actions/solutions";
import FormattedSolution from "@components/formatted_solution";
import SolutionDetails from "@components/solution_details";
import styles from "@styles/aoc.module.scss";

export default async function AOCSolutionPage({
  params,
}: {
  children: React.ReactNode;
  params: { year: string; day: string; id: string };
}) {
  const { year, day, id } = await params;

  const puzzleResponse: { puzzle: PuzzleType } | { error: Error } =
    await getPuzzleByDay(Number(day), Number(year));

  if ("error" in puzzleResponse) {
    console.error(puzzleResponse.error);
    redirect(`/advent-of-code/${year}/${day}`);
  }

  const { puzzle } = puzzleResponse;

  const solutionResponse: { solution: SolutionType } | { error: Error } =
    await getSolution(Number(id));

  if ("error" in solutionResponse) {
    console.error(solutionResponse.error);
    redirect(puzzle.url);
  }

  const solution = solutionResponse.solution;

  return (
    <main className={clsx(styles.page)}>
      <section
        className={clsx(
          styles.pageBody,
          styles.solutionBody,
          styles.readableWidth,
          "bg-white"
        )}
      >
        <SolutionDetails solution={solution} />
        <div className={styles.solution}>
          {solution.explanation && (
            <FormattedSolution markdown={solution.explanation} />
          )}
        </div>
      </section>
    </main>
  );
}
