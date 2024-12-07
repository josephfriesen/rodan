import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const YEARS = [2022, 2024];
const DAYS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25,
];

async function seed(): Promise<void> {
  for (const year of YEARS) {
    await prisma.aocYear
      .create({
        data: {
          year,
          externalUrl: `https://adventofcode.com/${year}`,
          url: `/advent-of-code/${year}`,
        },
        select: { id: true },
      })
      .then((res) => {
        console.log("///////// prisma create record success ////////");
        console.log(res);
      })
      .catch((e) => {
        console.log("/////// prisma create record error ////////");
        console.error(e);
      });

    const yearRecord = await prisma.aocYear
      .findFirst({
        where: {
          year,
        },
      })
      .then((res) => {
        console.log("///////// prisma find record success ////////");
        console.log(res);
        return res;
      })
      .catch((e) => {
        console.log("/////// prisma find record error ////////");
        console.error(e);
      });

    if (!yearRecord) {
      throw new Error(`no year found with id ${year}`);
    }

    for (const day of DAYS) {
      await prisma.aocPuzzle
        .create({
          data: {
            day,
            externalUrl: `https://adventofcode.com/2024/day/${day}`,
            url: `/advent-of-code/${year}/${day}`,
            year: { connect: { id: yearRecord.id } },
          },
          select: { id: true },
        })
        .then((res) => {
          console.log("///////// prisma create record success ////////");
          console.log(res);
        })
        .catch((e) => {
          console.log("/////// prisma create record error ////////");
          console.error(e);
        });
    }
  }
}

export async function GET(): Promise<Response> {
  return Response.json({
    message:
      "this is where you seed the database if it hasn't been seeded yet. well, not *here*, but you get the idea.",
    status: 200,
  });
}

export async function POST(req: Request): Promise<Response> {
  try {
    console.log("POST /seed");
    console.log("req: ", req);
    // const isSeeded = await prisma.aocYear.count();
    const isSeeded = await prisma.aocPuzzle.count();
    if (isSeeded > 0) {
      return Response.json({
        message: "database is already seeded, get lost.",
        status: 400,
      });
    }

    await seed();

    return Response.json({
      message: "database has been seeded.",
      status: 201,
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      message: "something went wrong",
      status: 500,
    });
  }
}
