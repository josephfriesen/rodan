const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const YEARS = [2022, 2024];
const DAYS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25,
];

async function seed() {
  for (const year of YEARS) {
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
      const dayRecord = await prisma.aocPuzzle
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

      console.log(dayRecord);
    }
  }
}

async function deleteRecords() {
  for (const year of YEARS) {
    await prisma.aocPuzzle
      .deleteMany({
        where: {
          year: {
            year,
          },
        },
      })
      .then((res) => {
        console.log("deleted records: ", res);
      });

    await prisma.aocYear
      .deleteMany({
        where: {
          year,
        },
      })
      .then((res) => {
        console.log("deleted records: ", res);
      });
  }
}

// seed();
deleteRecords();
