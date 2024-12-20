import { PrismaClient } from "@prisma/client";
import { SolutionType, SELECT_SOLUTIONS } from "./types";
import { getSolution } from "./getSolution";

export async function updateSolutionDataTemplate(
  id: number
): Promise<{ solution: SolutionType } | { error: Error }> {
  try {
    const prisma: PrismaClient = new PrismaClient();
    const solutionResponse: { solution: SolutionType } | { error: Error } =
      await getSolution(id);

    if ("error" in solutionResponse) {
      throw new Error(solutionResponse.error.message);
    }

    const { solution } = solutionResponse;
    const solutionData: { [key: string]: number } = JSON.parse(
      solution.solutionData
    );
    let newExplanation: string = solution.explanation;

    for (const [key, value] of Object.entries(solutionData)) {
      newExplanation = newExplanation.replace(
        new RegExp(`{{{${key}}}}`, "g"),
        String(value)
      );
    }

    const updatedSolution: SolutionType = await prisma.aocSolution
      .update({
        where: { id },
        data: {
          explanation: newExplanation,
        },
        select: SELECT_SOLUTIONS,
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    return { solution: updatedSolution };
  } catch (err) {
    return { error: err };
  }
}
