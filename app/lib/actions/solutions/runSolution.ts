import { PrismaClient } from "@prisma/client";
import { SolutionType } from "./types";
import { getSolution } from "./getSolution";
import { updateSolutionDataTemplate } from "./updateSolutionDataTemplate";

export async function runSolution(id: number) {
  try {
    const prisma = new PrismaClient();

    const solutionResponse: { solution: SolutionType } | { error: Error } =
      await getSolution(id);

    if ("error" in solutionResponse) {
      throw new Error(solutionResponse.error.message);
    }
    const { solution } = solutionResponse;
    const {
      day,
      year: { year },
    } = solution.puzzle;

    const DaySolution = await import(`@lib/aoc/${year}/Day${day}Solution`);
    const sln = new DaySolution.default(solution.input);

    await prisma.aocSolution.update({
      where: { id },
      data: {
        solutionData: JSON.stringify(sln.solutions),
      },
    });

    const updateResponse = await updateSolutionDataTemplate(id);

    if ("error" in updateResponse) {
      throw new Error(updateResponse.error.message);
    }

    return {
      solution: updateResponse.solution,
      pathToClass: `@lib/aoc/${year}/Day${day}Solution`,
    };
  } catch (e) {
    console.error(e);
    return { error: e };
  }
}
