import { PrismaClient } from "@prisma/client";
import { YearType, SELECT_YEARS } from "../app/lib/actions/years/types";
import { PuzzleType, SELECT_PUZZLES } from "../app/lib/actions/puzzles/types";

const prisma = new PrismaClient();

const seed = async () => {
  const year: YearType = await prisma.aocYear.create({
    data: {
      year: 2024,
      externalUrl: "https://www.adventofcode.com/2024",
      url: "/advent-of-code/2024",
    },
    select: SELECT_YEARS,
  });

  const puzzle: PuzzleType = await prisma.aocPuzzle.create({
    data: {
      year: { connect: { id: year.id } },
      day: 1,
      externalUrl: "https://www.adventofcode.com/2024/day/1",
      url: "/advent-of-code/2024/1",
    },
    select: SELECT_PUZZLES,
  });

  await prisma.aocSolution.create({
    data: {
      puzzle: { connect: { id: puzzle.id } },
      year: { connect: { id: year.id } },
      url: "/advent-of-code/2024/1/solution/1",
    },
    select: {},
  });
};

async function main() {
  await prisma.$connect();
  await seed();
}

main();
