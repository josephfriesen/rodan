import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import EditSolutionDetails from "@ui/edit_solution_details";
import RunSolution from "@ui/run_solution";
import clsx from "clsx";
import styles from "@styles/aoc.module.scss";
import { SolutionType } from "@lib/actions/solutions/types";
import { updateSolutionData } from "@lib/actions/solutions";
import handleRefresh from "@lib/handleRefresh";

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
      handleRefresh();
    } else {
      console.error(response.error);
    }
  };

  return (
    <Card className={clsx("p-4 mt-4", styles.cardInnerBg)}>
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
          <RunSolution handleRefresh={handleRefresh} solution={solution} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EditSolutionData;
