import { PrismaClient } from "@prisma/client";

export async function getYears() {
  try {
    const prisma = new PrismaClient();

    const years = await prisma.aocYear
      .findMany({
        select: {
          id: true,
          year: true,
          externalUrl: true,
          url: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!years) {
      throw new Error(`no years found`);
    }

    return { years };
  } catch (err) {
    return { error: err };
  }
}

export async function getYear(year: number) {
  try {
    const prisma = new PrismaClient();

    const yearData = await prisma.aocYear
      .findUnique({
        where: {
          year,
        },
        select: {
          id: true,
          year: true,
          externalUrl: true,
          url: true,
          puzzles: {
            select: {
              id: true,
              day: true,
              externalUrl: true,
              url: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!yearData) {
      throw new Error(`no year found for year ${year}`);
    }

    return { year: yearData };
  } catch (err) {
    return { error: err };
  }
}
