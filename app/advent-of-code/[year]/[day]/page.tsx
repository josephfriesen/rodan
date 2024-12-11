import FormattedSolution from "@components/formatted_solution";
import utilStyles from "@styles/utils.module.sass";
import clsx from "clsx";
import { getPuzzleByDay } from "@lib/actions/puzzles";
import { getTestDataSolutionByDay } from "@lib/actions/solutions";

export default async function AOCPage(props: { params: { year: string, day: string } }): Promise<JSX.Element | null> {
  const params = await props.params;
  const { year, day } = params;
  console.log("here");

  const { puzzle, error: puzzleError } = await getPuzzleByDay(Number(day), Number(year));
  console.log(puzzle);
  console.log(puzzleError);

  if (puzzleError || !puzzle) {
    console.error(puzzleError);
    console.log(puzzle);
    return null;
  }

  const { solution, error: solutionError } = await getTestDataSolutionByDay(Number(day), Number(year));

  if (solutionError) {
    console.log(solutionError);
  }

  const markdown = `
  markdown
      `

  return (
    <div>
      <h2 className={clsx(utilStyles.headingMd, utilStyles.centered)}>
        <a
          target="_blank"
          href={puzzle.externalUrl}
          rel="noopener noreferrer"
        >
          Day {day}
        </a>
      </h2>
      <FormattedSolution markdown={markdown} />
    </div >
  );
};

