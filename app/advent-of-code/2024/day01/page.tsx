import { GetServerSideProps } from "next";
import Layout from "../../components/aoc2024_page_layout";
import { Inline } from "../../components/block";
import { getAOCInput } from "../../lib/aoc/getAOCInput";
import Day1Solution from "../../lib/aoc/2024/Day1Solution";

const DAY = 1;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents, } = await getAOCInput(DAY, "2024");

  return {
    props: {
      input: fileContents,
    }
  }
}

interface AOC2024Day1Props {
  input: string
}

const AOC2024Day1 = ({ input }: AOC2024Day1Props): JSX.Element => {
  const solution = new Day1Solution(input);

  solution.test();

  return (
    <Layout day={DAY}>
      <section>
        <h3>Solution: Part 1</h3>
        <ul>
          <li>
            Easy. Parse the string into individual lines via <Inline>input.split("\n")</Inline>.
            Split the line into a two element array via <Inline>line.split("   ")</Inline>.
            Shove each number into a separate array <Inline>arr1, arr2</Inline>.
            Sort <Inline>arr1, arr2</Inline> in ascending order.
            Iterate through <Inline>arr1</Inline>, sum the absolute value of the difference between <Inline>arr1[i]</Inline> and <Inline>arr2[i]</Inline>.
            That sum is the total distance, {solution.totalDistance}.
          </li>
        </ul>
        <h3>Solution: Part 2</h3>
        <ul>
          <li>
            Easy again. Iterate through list one: for each <Inline>x</Inline> in list one, find the length of the intersection between <Inline>x</Inline> and list two.
            Multiply <Inline>x</Inline> by that length. Sum all lengths. The sum is the total similarity, {solution.totalSimilarity}.
          </li>
        </ul>
      </section>
    </Layout>
  )
}

export default AOC2024Day1