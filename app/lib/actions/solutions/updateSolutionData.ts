import { PrismaClient } from "@prisma/client";
import { getSolution } from "@lib/actions/solutions";
import { SolutionType, SELECT_SOLUTIONS } from "@lib/actions/solutions/types";

export async function updateSolutionData(
  id: number,
  payload: { [key: string]: string | number }
): Promise<{ solution: SolutionType } | { error: Error }> {
  try {
    const prisma: PrismaClient = new PrismaClient();
    const solutionResponse: { solution: SolutionType } | { error: Error } =
      await getSolution(id);

    if ("error" in solutionResponse) {
      throw new Error(`no solution found for id ${id}`);
    }

    const stringifiedPayload: string = JSON.stringify(payload);

    // also update solution explanation, create a new action for this.
    const updatedSolution: SolutionType = await prisma.aocSolution
      .update({
        where: { id },
        data: {
          solutionData: stringifiedPayload,
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
