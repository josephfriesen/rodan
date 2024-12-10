import { PrismaClient } from "@prisma/client";

export async function getPuzzleByDay(day: number, year: number) {
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
          day: true,
          externalUrl: true,
          url: true,
          createdAt: true,
          updatedAt: true,
          year: {
            select: {
              id: true,
              year: true,
              externalUrl: true,
              url: true,
            },
          },
          solutions: {
            select: {
              id: true,
              createdAt: true,
              explanation: true,
              input: true,
              solutionData: true,
              isSolutionValid: true,
              isTestData: true,
              isAocData: true,
              solvedAt: true,
            },
          },
        },
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

export async function getPuzzlesByYear(year: number) {
  try {
    const prisma = new PrismaClient();

    const puzzles = await prisma.aocPuzzle
      .findMany({
        where: {
          year: { year },
        },
        select: {
          id: true,
          day: true,
          externalUrl: true,
          url: true,
          createdAt: true,
          updatedAt: true,
          year: {
            select: { year: true, id: true },
          },
          solutions: {
            select: {
              id: true,
              createdAt: true,
            },
          },
        },
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
