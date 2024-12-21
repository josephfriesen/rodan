import { NextRequest, NextResponse } from "next/server";
import { SolutionType } from "@lib/actions/solutions/types";
import { runSolution } from "@lib/actions/solutions";

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    console.log(`PATCH ${req.url}`); // eslint-disable-line no-console

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({
        message: "no id provided",
        status: 400,
      });
    }

    const actionResponse:
      | { solution: SolutionType; pathToClass: string }
      | { error: Error } = await runSolution(Number(id));

    if ("error" in actionResponse) {
      console.error(actionResponse.error);
      throw new Error(actionResponse.error.message);
    }

    return NextResponse.json({
      message: "success",
      status: 200,
      json: actionResponse,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      message: err.message,
      status: 500,
    });
  }
}
