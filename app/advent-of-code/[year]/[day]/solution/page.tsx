import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { PuzzleType } from '@lib/actions/puzzles/types';
import { getPuzzleByDay } from '@lib/actions/puzzles';
import { createNewSolution } from '@lib/actions/solutions';
import { NewSolutionDataType } from '@lib/actions/solutions/types';
import clsx from 'clsx';
import LinkButton from 'app/ui/link_button';
import utilStyles from '@styles/utils.module.sass';

export default async function AOCSolutionsListPage({
  params,
}: {
  children: React.ReactNode;
  params: { year: string; day: string };
}) {
  const { year, day } = await params;

  const puzzleResponse: { puzzle: PuzzleType } | { error: Error } =
    await getPuzzleByDay(Number(day), Number(year));

  if ('error' in puzzleResponse) {
    console.error(puzzleResponse.error);
    redirect(`/advent-of-code/${year}/${day}`);
  }
  const { puzzle } = puzzleResponse;
  console.log(puzzle);

  const handleNewSolutionClick = async (): Promise<void> => {
    'use server';

    const response = await createNewSolution(Number(day), Number(year));

    if ('solution' in response) {
      const newSolutionData = response.solution;
      revalidatePath(newSolutionData.url);
      redirect(newSolutionData.url);
    } else {
      console.error(response.error);
    }
  };

  return (
    <section>
      <h3 className={utilStyles.headingSm}>Day {day} Solutions</h3>
      {puzzle.solutions.length > 0 && (
        <ul className={clsx(utilStyles.list)}>
          {puzzle.solutions.map((solution) => {
            return (
              <li key={solution.id}>
                ID: <Link href={solution.url}>{solution.id}</Link> Created{' '}
                {solution.createdAt.toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </li>
            );
          })}
        </ul>
      )}
      <LinkButton clickCallback={handleNewSolutionClick}>
        Create new solution for day {day}
      </LinkButton>
    </section>
  );
}
