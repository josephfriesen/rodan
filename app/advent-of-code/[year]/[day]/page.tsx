import FormattedSolution from 'app/ui/formatted_solution';
import utilStyles from '@styles/utils.module.sass';
import clsx from 'clsx';
import { getPuzzleByDay } from '@lib/actions/puzzles';
import { PuzzleType } from '@lib/actions/puzzles/types';
import { getTestDataSolutionByDay } from '@lib/actions/solutions';
import { SolutionType } from '@lib/actions/solutions/types';

export default async function AOCPage(props: {
  params: { year: string; day: string };
}): Promise<JSX.Element | null> {
  const params = await props.params;
  const { year, day } = params;

  const puzzleResponse: { puzzle: PuzzleType } | { error: Error } =
    await getPuzzleByDay(Number(day), Number(year));
  if ('error' in puzzleResponse) {
    console.error(puzzleResponse.error);
    return null;
  }
  const { puzzle } = puzzleResponse;

  const solutionResponse: { solution: SolutionType } | { error: Error } =
    await getTestDataSolutionByDay(Number(day), Number(year));

  if ('error' in solutionResponse) {
    console.error(solutionResponse.error);
    return null;
  }
  const { solution } = solutionResponse;

  const markdown = solution?.explanation ?? '';

  return (
    <div>
      <h2 className={clsx(utilStyles.headingMd, utilStyles.centered)}>
        <a target="_blank" href={puzzle.externalUrl} rel="noopener noreferrer">
          Day {day}
        </a>
      </h2>
      <FormattedSolution markdown={markdown} />
    </div>
  );
}
