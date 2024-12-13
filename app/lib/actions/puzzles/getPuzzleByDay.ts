import { PrismaClient } from '@prisma/client';
import { PuzzleType, SELECT_PUZZLES } from './types';

/**
 * Finds a puzzle by day and year
 * @param day the day of the puzzle
 * @param year the year of the puzzle
 * @returns a puzzle object with the id, day, externalUrl, and url, or an error
 */
export async function getPuzzleByDay(
  day: number,
  year: number,
): Promise<{ puzzle: PuzzleType } | { error: Error }> {
  try {
    const prisma = new PrismaClient();

    const puzzle: PuzzleType | null = await prisma.aocPuzzle
      .findFirst({
        where: {
          day,
          year: { year },
        },
        select: SELECT_PUZZLES,
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!puzzle) {
      throw new Error(`no puzzle found for day ${day} in year ${year}`);
    }

    return { puzzle };
  } catch (err) {
    return { error: err };
  }
}
