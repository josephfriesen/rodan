import { GetServerSideProps } from "next";
import Layout from "@components/aoc2024_page_layout";
import FormattedSolution from "@components/formatted_solution";
import { getAOCInput } from "@lib/aoc/getAOCInput";
import Day5Solution from "@lib/aoc/2024/Day5Solution";

const DAY = 5;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents } = await getAOCInput(DAY, "2024");

  return {
    props: {
      input: fileContents,
    }
  }
}

interface AOC2024Day5Props {
  input: string
}

const AOC2024Day5 = ({ input }: AOC2024Day5Props): JSX.Element => {

  const solution = new Day5Solution(input);

  const markdown = ``

  return (
    <Layout day={DAY}>
      <section>
        <FormattedSolution markdown={input} />
      </section>
    </Layout>
  )
}

export default AOC2024Day5;