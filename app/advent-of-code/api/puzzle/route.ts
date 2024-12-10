import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

// TODO: move this to /app/api/advent-of-code/puzzle/index.ts
export async function GET(
  request: NextRequest,
  route: Promise<{ params: { year: string; day: string } }>
): Promise<NextResponse> {
  console.log(`GET ${request.url}`);

  const { params } = await route;
  const { day } = await params;

  const puzzle = await prisma.aocPuzzle.findFirst({
    where: {
      day: Number(day),
    },
  });

  if (!puzzle) {
    return NextResponse.json({
      status: 404,
      message: "Puzzle not found",
    });
  }

  return NextResponse.json({
    status: 200,
    message: "Day found",
    json: {
      day: puzzle,
    },
  });
}

export async function POST(req: Request) {
  console.log(`POST ${req.url}`);
  const body = await req.json();

  // REQUIRED FIELDS: day, year
  if (!body.day || !body.year) {
    return NextResponse.json({
      status: 400,
      message: "Missing required fields",
    });
  }

  const yearRecord = await prisma.aocYear.findFirst({
    where: {
      year: Number(body.year),
    },
  });

  // is this necessary? next.js should do 404 response if there is no year found, correct? maybe not...
  if (!yearRecord) {
    return NextResponse.json({
      status: 404,
      message: "Year not found",
    });
  }

  const puzzle = await prisma.aocPuzzle.create({
    data: {
      day: body.day,
      year: { connect: { id: yearRecord.id } },
      externalUrl: `https://www.adventofcode.com/${body.year}/${body.day}`,
      url: `/advent-of-code/${body.year}/${body.day}`,
    },
  });

  return NextResponse.json({
    status: 200,
    message: "New day created",
    json: {
      body,
      day: puzzle,
    },
  });
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  console.log(`DELETE ${req.url}`);

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const day = url.searchParams.get("day");
  const year = url.searchParams.get("year");

  console.log(`[id]: ${id}, [day]: ${day}, [year]: ${year}`);
  if ((!day || !year) && !id) {
    return NextResponse.json({
      status: 400,
      message: "Missing required fields",
    });
  }

  if (id) {
    const res: NextResponse = await prisma.aocPuzzle
      .delete({
        where: { id: Number(id) },
      })
      .then((res) => {
        console.log(res);
        return NextResponse.json({
          status: 200,
          message: "Puzzle deleted",
        });
      })
      .catch((e) => {
        console.error(e);
        return NextResponse.json({
          status: 500,
          message: "Something went wrong",
        });
      });
    return res;
  } else {
    const res: NextResponse = await prisma.aocPuzzle
      .deleteMany({
        where: {
          day: Number(day),
          year: { year: Number(year) },
        },
      })
      .then((res) => {
        console.log(res);
        return NextResponse.json({
          status: 200,
          message: `Deleted ${res.count} puzzles`,
        });
      })
      .catch((e) => {
        console.error(e);
        return NextResponse.json({
          status: 500,
          message: "Something went wrong",
        });
      });

    return res;
  }
}
