import React from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import SolutionDetails from "@ui/solution_details";
import EditSolutionInput from "@ui/edit_solution_input";
import EditSolutionData from "@ui/edit_solution_data";
import { updateSolution, getSolution } from "@lib/actions/solutions";
import { SolutionType } from "@lib/actions/solutions/types";
import clsx from "clsx";
import styles from "@styles/aoc.module.scss";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

export default async function AOCSolutionInputPage({
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

  const handleUpdateInput = async (newInput: string): Promise<void> => {
    "use server";

    const response = await updateSolution(Number(id), {
      input: newInput,
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
      <Card className={clsx("mb-16")}>
        <CardContent className={clsx("w-fit-content p-4 pl-8 pr-8")}>
          <SolutionDetails solution={solution} />
          <Card className={clsx("p-4")}>
            <CardHeader>
              <CardTitle className={clsx("text-2xl text-center")}>
                Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditSolutionInput
                inputValue={solution.input}
                handleSubmit={handleUpdateInput}
              />
            </CardContent>
          </Card>
          <EditSolutionData solution={solution} />
        </CardContent>
      </Card>
    </main>
  );
}
