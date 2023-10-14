import fs from "fs";
import path from "path";

interface AOCInput {
  fileContents: string;
  publicPath: string;
}

export const getAOCInput = async (day: number): Promise<AOCInput> => {
  const inputDirectory = path.join(process.cwd(), "public/aoc2022/inputs");
  const inputFileName = `day${day.toString().padStart(2, "0")}.txt`;
  const fullPath = path.join(inputDirectory, inputFileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const publicPath = `/aoc2022/inputs/${inputFileName}`;

  return {
    fileContents,
    publicPath,
  };
};
