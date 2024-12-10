import { PrismaClient } from "@prisma/client";

const SELECT_SOLUTIONS = {
  id: true,
  createdAt: true,
  explanation: true,
  input: true,
  solutionData: true,
  isSolutionValid: true,
  isTestData: true,
  isAocData: true,
  solvedAt: true,
  puzzle: {
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
  },
};

export async function getSolution(id: number) {
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

    return { solution };
  } catch (err) {
    return { error: err };
  }
}

export async function getSolutionsByDay(day: number, year: number) {
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

    return puzzle?.solutions;
  } catch (err) {
    return { error: err };
  }
}

export async function getTestDataSolutionByDay(day: number, year: number) {
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
              isTestData: true,
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
      throw new Error(`no test data found for day ${day} and year ${year}`);
    }

    return { solution: puzzle.solutions[0] };
  } catch (err) {
    return { error: err };
  }
}

export async function getAocDataSolutionByDay(day: number, year: number) {
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
