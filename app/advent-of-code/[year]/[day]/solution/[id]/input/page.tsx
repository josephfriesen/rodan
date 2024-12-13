import React from 'react';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSolution } from '@lib/actions/solutions';
import { updateSolution } from '@lib/actions/solutions';
import { SolutionType } from '@lib/actions/solutions/types';
import LinkButton from 'app/ui/link_button';
import EditSolutionInput from '@components/edit_solution_input';
import styles from '@styles/aoc.module.scss';

export default async function AOCSolutionInputPage({
  params,
}: {
  params: { year: string; day: string; id: string };
}): Promise<JSX.Element> {
  const [solutionInputFormValue, setSolutionInputFormValue] =
    React.useState('');

  const { id, year, day } = await params;

  const solutionResponse: { solution: SolutionType } | { error: Error } =
    await getSolution(Number(id));

  if ('error' in solutionResponse) {
    console.error(solutionResponse.error);
    redirect(`/advent-of-code/${year}/${day}`);
  }

  const { solution } = solutionResponse;

  const handleUpdateInputButton = React.useCallback(async () => {
    'use server';

    const response = await updateSolution(Number(id), {
      input: solutionInputFormValue,
    });

    if ('solution' in response) {
      const updatedSolution = response.solution;
      revalidatePath(updatedSolution.url);
      redirect(updatedSolution.url);
    } else {
      console.error(response.error);
    }
  }, [solutionInputFormValue]);

  React.useEffect(() => {
    setSolutionInputFormValue(solution.input);
  }, [solution]);

  return (
    <div>
      <h2>
        Day {day} Solution | id: {solution.id} | Input
      </h2>
      <div className={styles.solutionInputForm}>
        <EditSolutionInput
          value={solutionInputFormValue}
          handleChange={(event) =>
            setSolutionInputFormValue(event.target.value)
          }
        />
        <div className={styles.formActions}>
          <LinkButton clickCallback={handleUpdateInputButton}>
            Update Input
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
