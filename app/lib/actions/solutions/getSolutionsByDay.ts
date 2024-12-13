import { PrismaClient } from '@prisma/client';
import { SolutionType, SELECT_SOLUTIONS } from './types';

/**
 * Finds an array of solutions for the given day and year
 * @param day the day of the puzzle
 * @param year the year of the puzzle
 * @returns an object containing an array of solutions, or an object with an error
 */
export async function getSolutionsByDay(
  day: number,
  year: number,
): Promise<{ solutions: SolutionType[] } | { error: Error }> {
  try {
    const prisma = new PrismaClient();

    const puzzle = await prisma.aocPuzzle
      .findFirst({
        where: {
          day,
          year: { year },
        },
        select: {
          solutions: { select: SELECT_SOLUTIONS },
        },
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!puzzle) {
      throw new Error(`no puzzle found for day ${day} and year ${year}`);
    }

    return { solutions: puzzle.solutions };
  } catch (err) {
    return { error: err };
  }
}
