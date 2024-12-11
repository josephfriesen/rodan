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
              url: true,
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

export async function addNewPuzzleToYear(id: number) {
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
    const puzzle = await prisma.aocPuzzle
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
