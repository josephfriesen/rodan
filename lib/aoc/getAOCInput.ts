import fs from "fs";
import path from "path";

interface AOCInput {
  fileContents: string;
  publicPath: string;
}

export const getAOCInput = async (day: number, year: string = "2022"): Promise<AOCInput> => {
  const inputDirectory = path.join(process.cwd(), `public/aoc${year}/inputs`);
  const inputFileName = `day${day.toString().padStart(2, "0")}.txt`;
  const fullPath = path.join(inputDirectory, inputFileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const publicPath = `/aoc${year}/inputs/${inputFileName}`;

  return {
    fileContents,
    publicPath,
  };
};
