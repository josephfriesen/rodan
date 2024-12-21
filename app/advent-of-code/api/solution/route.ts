import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { SolutionType } from "@lib/actions/solutions/types";
import { getSolution } from "@lib/actions/solutions";
import { updateSolution } from "@lib/actions/solutions";

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log(`GET ${req.url}`); // eslint-disable-line no-console

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        message: "no id provided",
        status: 400,
      });
    }

    const actionResponse: { solution: SolutionType } | { error: Error } =
      await getSolution(Number(id));

    if ("error" in actionResponse) {
      throw new Error(actionResponse.error.message);
    }

    return NextResponse.json({
      message: "success",
      status: 200,
      json: actionResponse.solution,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      message: err.message,
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    console.log(`PATCH ${req.url}`); // eslint-disable-line no-console

    const { id, payload } = await req.json();

    const actionResponse: { solution: SolutionType } | { error: Error } =
      await updateSolution(Number(id), payload);

    if ("error" in actionResponse) {
      console.error(actionResponse.error);
      throw new Error(actionResponse.error.message);
    }

    return NextResponse.json({
      message: "success",
      status: 200,
      json: actionResponse.solution,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      message: err.message,
      status: 500,
    });
  }
}

/**
 * TODO: redo this to use the createSolution action
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log(`POST ${req.url}`); // eslint-disable-line no-console

    const { puzzleId, data } = await req.json();

    const {
      input,
      explanation,
      solutionData,
      isSolutionValid,
      isTestData,
      isAocData,
    } = data;

    const puzzleRecord = await prisma.aocPuzzle.findUnique({
      where: {
        id: Number(puzzleId),
      },
    });

    if (!puzzleRecord) {
      return NextResponse.json({
        message: "puzzle not found",
        status: 404,
      });
    }

    // REQUIRED FIELDS: day, year
    // OPTIONAL FIELDS, can be patched later: input, explanation, solutionData, isSolutionValid, isTestData, isAocData
    const solutionPayload = {
      puzzle: { connect: { id: puzzleRecord.id } },
      year: { connect: { id: puzzleRecord.aocYearId } },
      explanation: String(explanation),
      input: String(input),
      solutionData: solutionData ? JSON.stringify(solutionData) : "{}",
      isSolutionValid: isSolutionValid ? Boolean(isSolutionValid) : false,
      isTestData: isTestData ? Boolean(isTestData) : false,
      isAocData: isAocData ? Boolean(isAocData) : false,
    };

    const solution = await prisma.aocSolution
      .create({
        data: solutionPayload,
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
        },
      })
      .then((res) => {
        console.log("///////// prisma create record success ////////"); // eslint-disable-line no-console
        console.log(res); // eslint-disable-line no-console
        return res;
      })
      .catch((err) => {
        console.error(err);
        return NextResponse.json({
          message: `something went wrong creating new solution: ${err}`,
          status: 500,
        });
      });

    return NextResponse.json({
      message: "success",
      status: 200,
      json: {
        solution,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      message: `something went wrong: ${err}`,
      status: 500,
    });
  }
}
