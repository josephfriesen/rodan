import { PrismaClient } from "@prisma/client";
import { NewPuzzleDataType } from "./types";

/**
 * adds a new puzzle to a year
 * returns stubbed puzzle data, just for acknowledgement of puzzle creation success
 * should redirect to puzzle url
 * @param id the id of the year to add the puzzle to
 * @returns a stubbed puzzle data, with the id, day, url, and year, or an error
 */
export async function addNewPuzzleToYear(
  id: number
): Promise<{ puzzle: NewPuzzleDataType } | { error: Error }> {
  try {
    if (!id) {
      throw new Error(`no id provided`);
    }

    const prisma = new PrismaClient();

    const year = await prisma.aocYear
      .findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          year: true,
          puzzles: {
            select: {
              id: true,
              day: true,
            },
          },
        },
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!year) {
      throw new Error(`no year found for id ${id}`);
    }

    const puzzleDay = year.puzzles.sort((a, b) => b.day - a.day)[0].day + 1;
    const puzzle: NewPuzzleDataType = await prisma.aocPuzzle
      .create({
        data: {
          day: puzzleDay,
          year: { connect: { id } },
          externalUrl: `https://www.adventofcode.com/${year.year}/day/${puzzleDay}`,
          url: `/advent-of-code/${year.year}/${puzzleDay}`,
        },
        select: {
          id: true,
          day: true,
          url: true,
          year: { select: { year: true } },
        },
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });

    if (!puzzle) {
      throw new Error(`no puzzle created for year ${year.year}`);
    }

    return { puzzle };
  } catch (err) {
    return { error: err };
  }
}
