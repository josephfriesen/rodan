const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();

async function deleteAllSolutions() {
  try {
    await prisma.aocSolution.deleteMany();
  } catch (err) {
    console.error(err);
  }
}

deleteAllSolutions();
