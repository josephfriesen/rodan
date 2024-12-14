import { PrismaClient } from "@prisma/client";
import { PuzzleType, SELECT_PUZZLES } from "./types";

/**
 * Gets an array of puzzles for the given year.
 *
 * @param year The year for which puzzles should be retrieved.
 * @returns An object containing an array of puzzles, or an object with an error.
 */
export async function getPuzzlesByYear(
  year: number,
): Promise<{ puzzles: PuzzleType[] } | { error: Error }> {
  try {
    const prisma = new PrismaClient();

    const puzzles: PuzzleType[] = await prisma.aocPuzzle
      .findMany({
        where: {
          year: { year },
        },
        select: SELECT_PUZZLES,
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!puzzles) {
      throw new Error(`no puzzles found for year ${year}`);
    }

    return { puzzles };
  } catch (err) {
    return { error: err };
  }
}
