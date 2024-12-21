import { PrismaClient } from "@prisma/client";
import { NewSolutionDataType } from "./types";

/**
 * Creates a new solution for a given puzzle day and year.
 *
 * This function interacts with the database to find the puzzle for the specified
 * day and year. It then creates a new solution linked to that puzzle and updates
 * the solution URL. If successful, it returns the newly created solution data.
 *
 * @param day - The day of the puzzle.
 * @param year - The year of the puzzle.
 * @returns A promise that resolves to an object containing stubbed solution data
 *          or an error if the operation fails. If successful, the client
 *          should redirect to the solution URL.
 */
export async function createNewSolution(
  day: number,
  year: number
): Promise<{ solution: NewSolutionDataType } | { error: Error }> {
  try {
    const prisma = new PrismaClient();

    const puzzle = await prisma.aocPuzzle
      .findFirst({
        where: {
          day,
          year: { year },
        },
        select: {
          id: true,
          year: { select: { id: true } },
        },
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!puzzle) {
      throw new Error(`no puzzle found for day ${day} and year ${year}`);
    }

    const solution: {
      id: number;
      puzzle: { day: number; year: { year: number } };
    } = await prisma.aocSolution
      .create({
        data: {
          puzzle: { connect: puzzle },
          year: { connect: { id: puzzle.year.id } },
          input: "",
          explanation: "",
          solutionData: "{}",
          isSolutionValid: false,
        },
        select: {
          id: true,
          puzzle: { select: { day: true, year: { select: { year: true } } } },
        },
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!solution) {
      throw new Error(`no solution created for day ${day} and year ${year}`);
    }

    const solutionUpdated: NewSolutionDataType = await prisma.aocSolution
      .update({
        where: {
          id: solution.id,
        },
        data: {
          url: `/advent-of-code/${year}/${day}/solution/${solution.id}`,
        },
        select: {
          id: true,
          puzzle: { select: { day: true, year: { select: { year: true } } } },
          url: true,
        },
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!solutionUpdated) {
      throw new Error(`no solution updated for day ${day} and year ${year}`);
    }

    return { solution: solutionUpdated };
  } catch (err) {
    return { error: err };
  }
}
