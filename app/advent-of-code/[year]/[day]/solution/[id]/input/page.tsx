import React from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
// import { headers } from "next/headers";
import { getSolution } from "@lib/actions/solutions";
import { updateSolution } from "@lib/actions/solutions";
import { SolutionType } from "@lib/actions/solutions/types";
import EditSolutionInput from "@components/edit_solution_input";

export default async function AOCSolutionInputPage({
  params,
}: {
  params: { year: string; day: string; id: string };
}): Promise<JSX.Element> {
  // const headerList = headers();
  // const pathname = (await headerList).get("x-current-path");
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
    <div>
      <h2>
        Day {day} Solution | id: {solution.id} | Input
      </h2>
      <EditSolutionInput
        inputValue={solution.input}
        handleSubmit={handleUpdateInput}
      />
    </div>
  );
}
