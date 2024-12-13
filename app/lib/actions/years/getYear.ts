import { PrismaClient } from "@prisma/client";
import { YearType, SELECT_YEARS } from "./types";

export async function getYear(
  year: number
): Promise<{ year: YearType } | { error: Error }> {
  try {
    const prisma = new PrismaClient();

    const yearData = await prisma.aocYear
      .findUnique({
        where: {
          year,
        },
        select: SELECT_YEARS,
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
