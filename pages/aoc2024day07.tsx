import * as React from "react";
import { GetServerSideProps } from "next";
import FormattedSolution from "@components/formatted_solution";
import { getAOCInput } from "@lib/aoc/getAOCInput";
import Day7Solution from "@lib/aoc/2024/Day7Solution";

const DAY = 7;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents } = await getAOCInput(DAY, "2024");

  return {
    props: {
      input: fileContents,
    }
  }
}

interface AOC2024Day6Props {
  input: string
}

const AOC2024Day7 = ({ input }: AOC2024Day7Props): JSX.Element => {

  const solution: Day7Solution = new Day7Solution(input);

  const markdown = `solution part 1: ${solution.validCalibrationsSum} part 2: ${solution.validCalibrationsWithConcatSum}`; // 975671981569

  return (
      <section>
        <FormattedSolution markdown={markdown} />
      </section>
  )
}

export default AOC2024Day7;
