import { PrismaClient } from "@prisma/client";
import {
  SolutionType,
  UpdateSolutionPayloadType,
  SELECT_SOLUTIONS,
} from "@lib/actions/solutions/types";
import _ from "lodash";

export async function updateSolution(
  id: number,
  payload: UpdateSolutionPayloadType
): Promise<{ solution: SolutionType } | { error: Error }> {
  try {
    const prisma = new PrismaClient();

    if (!payload) {
      throw new Error("no payload");
    }

    const clonedPayload = _.pick(payload, [
      "input",
      "explanation",
      "solutionData",
      "isSolutionValid",
      "isTestData",
      "isAocData",
      "url",
      "solvedAt",
    ]);

    if (clonedPayload.isSolutionValid === true) {
      clonedPayload.solvedAt = new Date();
    } else {
      clonedPayload.solvedAt = null;
    }

    const solution: SolutionType = await prisma.aocSolution
      .update({
        where: {
          id,
        },
        data: clonedPayload,
        select: SELECT_SOLUTIONS,
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });

    if (!solution) {
      throw new Error(`no solution found for id ${id}`);
    }

    return { solution };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}
