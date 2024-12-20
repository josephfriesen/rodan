import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import EditSolutionDetails from "@ui/edit_solution_details";
import RunSolution from "@ui/run_solution";
import clsx from "clsx";
import { SolutionType } from "@lib/actions/solutions/types";
import { updateSolutionData } from "@lib/actions/solutions";
import { runSolution } from "@lib/actions/solutions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const EditSolutionData = ({
  solution,
}: {
  solution: SolutionType;
}): JSX.Element => {
  const handleUpdateSolutionData = async (payload: {
    [key: string]: string | number;
  }): Promise<void> => {
    "use server";

    const response = await updateSolutionData(solution.id, payload);

    if ("solution" in response) {
      const updatedSolution = response.solution;
      revalidatePath(updatedSolution.url);
      redirect(updatedSolution.url);
    } else {
      console.error(response.error);
    }
  };

  const handleRunSolution = async (): Promise<any> => {
    "use server";

    const response = await runSolution(solution.id);
    return response;
  };

  return (
    <Card className={clsx("p-4 mt-4")}>
      <CardHeader>
        <CardTitle className={clsx("text-2xl text-center")}>
          Solution Details
        </CardTitle>
      </CardHeader>
      <CardContent className={clsx("flex gap-4")}>
        <div className={clsx("basis-1/2")}>
          <EditSolutionDetails
            solutionData={solution.solutionData}
            handleSubmit={handleUpdateSolutionData}
          />
        </div>
        <div className={clsx("basis-1/2")}>
          <RunSolution handleRunSolution={handleRunSolution} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EditSolutionData;
