import * as React from "react";
import { GetServerSideProps } from "next";
import FormattedSolution from "@components/formatted_solution";
import { getAOCInput } from "@lib/aoc/getAOCInput";
import Day8Solution from "@lib/aoc/2024/Day8Solution";

const DAY = 8;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents } = await getAOCInput(DAY, "2024");

  return {
    props: {
      input: fileContents,
    }
  }
}

interface AOC2024Day8Props {
  input: string
}

const AOC2024Day8 = ({ input }: AOC2024Day8Props): JSX.Element => {

  const solution: Day8Solution = new Day8Solution(input);

  const markdown = `solution part 1: ${solution.numUniqueAntinodes} part 2: ${solution.numExtendedUniqueAntinodes}`;

  return (
      <section>
        <FormattedSolution markdown={markdown} />
      </section>
  )
}

export default AOC2024Day8;
