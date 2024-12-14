import { PrismaClient } from "@prisma/client";
import {
  SolutionType,
  UpdateSolutionPayloadType,
  SELECT_SOLUTIONS,
} from "@lib/actions/solutions/types";

export async function updateSolution(
  id: number,
  payload: UpdateSolutionPayloadType,
): Promise<{ solution: SolutionType } | { error: Error }> {
  try {
    const prisma = new PrismaClient();

    const solution: SolutionType = await prisma.aocSolution
      .update({
        where: {
          id,
        },
        data: payload,
        select: SELECT_SOLUTIONS,
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!solution) {
      throw new Error(`no solution found for id ${id}`);
    }

    return { solution };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}
