import FormattedSolution from "@components/formatted_solution";
import utilStyles from "@styles/utils.module.sass";
import clsx from "clsx";
import { getPuzzleByDay } from "@lib/actions/puzzles";
import { getTestDataSolutionByDay } from "@lib/actions/solutions";

const AOCPage = async (props) => {
  const params = await props.params;
  const { year, day } = params;

  const { puzzle, error: puzzleError } = await getPuzzleByDay(Number(day), Number(year));
  console.log(puzzle);
  console.log(puzzleError);

  if (puzzleError || !puzzle) {
    return null;
  }

  const { solution, error: solutionError } = await getTestDataSolutionByDay(Number(day), Number(year));
  console.log(solution);
  console.log(solutionError);

  if (solutionError) {
    return null;
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

export default AOCPage;
