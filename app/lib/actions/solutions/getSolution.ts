import { PrismaClient } from "@prisma/client";
import { SolutionType, SELECT_SOLUTIONS } from "./types";

/**
 * Finds a solution by id.
 *
 * @param id the id of the solution
 * @returns a solution object with the id, puzzle id, year id, solved at, input,
 *   solution data, and explanation, or an object with an error
 */
export async function getSolution(
  id: number,
): Promise<{ solution: SolutionType } | { error: Error }> {
  try {
    const prisma = new PrismaClient();

    const solution = await prisma.aocSolution
      .findUnique({
        where: {
          id,
        },
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
    return { error: err };
  }
}
