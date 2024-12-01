import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import Layout from "../../components/aoc2024_page_layout";
import utilStyles from "../../styles/utils.module.sass";
import { Inline } from "../../components/block";
import { getAOCInput } from "../../lib/aoc/getAOCInput";
import Day1Solution from "../../lib/aoc/2024/day1";

const DAY = 1;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents, publicPath } = await getAOCInput(1, "2024");

  return {
    props: {
      input: fileContents,
      pathToInput: publicPath
    }
  }
}

interface AOC2024Day1Props {
  input: string
  pathToInput: string,
}

const AOC2024Day1 = ({ input, pathToInput }: AOC2024Day1Props) => {
  const solution = new Day1Solution(input);

  console.log(solution);
  console.log(`=== SOLUTION ===: ${solution.totalDistance}`)

  return (
    <Layout day={DAY}>
      <section>
        <h3>Solution</h3>
        <ul>
          <li>
            <Link href={pathToInput}>Input</Link>
          </li>
          <li>
            Easy. Parse the string into individual lines via <Inline>input.split("\n")</Inline>.
            Split the line into a two element array via <Inline>line.split("   ")</Inline>.
            Shove each number into a separate array <Inline>arr1, arr2</Inline>.
            Sort <Inline>arr1, arr2</Inline> in ascending order.
            Iterate through <Inline>arr1</Inline>, sum the absolute value of the difference between <Inline>arr1[i]</Inline> and <Inline>arr2[i]</Inline>.
            That sum is the total distance, {solution.totalDistance}.
          </li>
        </ul>
      </section>
    </Layout>
  )
}

export default AOC2024Day1