import { redirect } from "next/navigation";
import clsx from "clsx";
import { getPuzzleByDay } from "@lib/actions/puzzles";
import { PuzzleType } from "@lib/actions/puzzles/types";
import { SolutionType } from "@lib/actions/solutions/types";
import { getSolution } from "@lib/actions/solutions";
import FormattedSolution from "@ui/formatted_solution";
import SolutionDetails from "@ui/solution_details";
import styles from "@styles/aoc.module.scss";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

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
      <Card className={clsx("p-4", styles.readableWidth)}>
        <CardContent>
          <SolutionDetails solution={solution} />
          <Card className={clsx("p-4")}>
            <CardHeader className={clsx("mb-4")}>
              <CardTitle className={clsx("text-xl text-center")}>
                Solution Explanation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.solution}>
                {solution.explanation && (
                  <FormattedSolution markdown={solution.explanation} />
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </main>
  );
}
