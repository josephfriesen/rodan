import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  route: Promise<{ params: { year: string; day: string } }>
): Promise<NextResponse> {
  try {
    console.log(`POST ${req.url}`);

    const { year, day } = await route.params;

    const body = await req.formData();
    const input = body.get("input");
    const explanation = body.get("explanation");
    const solutionData = body.get("solutionData");
    const isSolutionValid = body.get("isSolutionValid");
    const isTestData = body.get("isTestData");
    const isAocData = body.get("isAocData");

    const puzzleRecord = await prisma.aocPuzzle.findFirst({
      where: {
        id: Number(day),
      },
    });

    if (!puzzleRecord) {
      return NextResponse.json({
        message: "puzzle not found",
        status: 404,
      });
    }

    const yearRecord = await prisma.aocYear.findFirst({
      where: {
        year: Number(year),
      },
    });

    if (!yearRecord) {
      return NextResponse.json({
        message: "year not found",
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
        console.log("///////// prisma create record success ////////");
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.log("wtf...");
        console.error(err);
        debugger;
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
