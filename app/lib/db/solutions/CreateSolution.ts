const { PrismaClient } = require('@prisma/client');

const prisma: typeof PrismaClient = new PrismaClient();

async function createSolution(
  puzzleId: number,
  explanation: string = '',
  input: string = '',
): Promise<void | null> {
  try {
    const puzzle = await getPuzzle(puzzleId);
    if (!puzzle) {
      console.error('no puzzle found');
      return null;
    }

    const solution = await prisma.aocSolution.create({
      data: {
        puzzle: { connect: puzzle },
        year: { connect: { id: puzzle.aocYearId } },
        explanation: explanation,
        input: input,
      },
      select: {
        id: true,
        createdAt: true,
        puzzle: {
          select: {
            id: true,
            day: true,
            externalUrl: true,
            url: true,
          },
        },
        year: {
          select: {
            id: true,
            year: true,
            externalUrl: true,
            url: true,
          },
        },
        explanation: true,
        solutionData: true,
        isSolutionValid: true,
        isTestData: true,
        isAocData: true,
        solvedAt: true,
      },
    });

    console.log('///////// prisma create record success ////////');
    console.log(solution);
  } catch (err) {
    console.error(err);
  }
}

function getPuzzle(id: number) {
  try {
    return prisma.aocPuzzle
      .findFirst({
        where: {
          id,
        },
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });
  } catch (err) {
    console.error(err);
    return null;
  }
}

const explanation: string = `
### Solution (part 1)
- Easy. Parse the string into individual lines via \`input.split("\\n")\`.
Split the line into a two element array via \`line.split("   ")\`.
Shove each number into separate arrays \`arr1, arr2\`.
Sort each of \`arr1, arr2\` in ascending order.
Iterate through \`arr1\`, sum the absolute value of the difference between \`arr1[i]\` and \`arr2[i]\`.
That sum is the total distance: {solution.totalDistance}.

### Solution (part 2)
- Easy again. Iterate through list one: for each \`x\` in list one, find the length of the intersection between \`x\` and list two.
Multiply \`x\` by that length. Sum all lengths. The sum is the total similarity, {solution.totalSimilarity}.
`;

createSolution(51, explanation);
