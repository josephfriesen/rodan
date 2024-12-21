import { PrismaClient } from "@prisma/client";
import { SolutionType, SELECT_SOLUTIONS } from "./types";

/**
 * Finds a solution for a given day and year, but only if the solution has been
 * submitted to the Advent of Code website and has AOC input.
 *
 * @param day the day of the puzzle
 * @param year the year of the puzzle
 * @returns a solution object with the id, puzzle id, year id, solved at, input,
 *   solution data, and explanation, or an object with an error
 */
export async function getAocDataSolutionByDay(
  day: number,
  year: number
): Promise<{ solution: SolutionType } | { error: Error }> {
  try {
    const prisma = new PrismaClient();

    const puzzle = await prisma.aocPuzzle
      .findFirst({
        where: {
          day,
          year: { year },
        },
        select: {
          solutions: {
            where: {
              isAocData: true,
            },
            select: SELECT_SOLUTIONS,
          },
        },
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!puzzle) {
      throw new Error(`no puzzle found for day ${day} and year ${year}`);
    }

    if (puzzle.solutions.length === 0) {
      throw new Error(
        `no solution with AOC input found for day ${day} and year ${year}`
      );
    }

    return { solution: puzzle?.solutions[0] };
  } catch (err) {
    return { error: err };
  }
}
