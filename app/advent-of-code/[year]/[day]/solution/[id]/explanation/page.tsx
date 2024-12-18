import React from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import SolutionDetails from "@ui/solution_details";
import EditSolutionExplanation from "@ui/edit_solution_explanation";
import { getSolution } from "@lib/actions/solutions";
import { updateSolution } from "@lib/actions/solutions";
import { SolutionType } from "@lib/actions/solutions/types";
import clsx from "clsx";
import styles from "@styles/aoc.module.scss";
import { Card, CardContent } from "@components/ui/card";

export default async function AOCSolutionExplanationPage({
  params,
}: {
  params: { year: string; day: string; id: string };
}): Promise<JSX.Element> {
  const { id, year, day } = await params;

  const solutionResponse: { solution: SolutionType } | { error: Error } =
    await getSolution(Number(id));

  if ("error" in solutionResponse) {
    console.error(solutionResponse.error);
    redirect(`/advent-of-code/${year}/${day}`);
  }

  const { solution } = solutionResponse;

  const handleUpdateExplanation = async (
    newExplanation: string
  ): Promise<void> => {
    "use server";

    const response = await updateSolution(Number(id), {
      explanation: newExplanation,
    });

    if ("solution" in response) {
      const updatedSolution = response.solution;
      revalidatePath(updatedSolution.url);
      redirect(updatedSolution.url);
    } else {
      console.error(response.error);
    }
  };

  return (
    <main className={clsx(styles.page)}>
      <Card>
        <CardContent className={clsx("w-fit-content p-2 pl-8 pr-8")}>
          <SolutionDetails solution={solution} />
          <EditSolutionExplanation
            explanation={solution.explanation}
            handleSubmit={handleUpdateExplanation}
          />
        </CardContent>
      </Card>
    </main>
  );
}
