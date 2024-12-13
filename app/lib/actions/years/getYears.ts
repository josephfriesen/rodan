import { PrismaClient } from '@prisma/client';
import { YearType, SELECT_YEARS } from './types';

export async function getYears(): Promise<
  { years: YearType[] } | { error: Error }
> {
  try {
    const prisma = new PrismaClient();

    const years: YearType[] = await prisma.aocYear
      .findMany({
        select: SELECT_YEARS,
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
