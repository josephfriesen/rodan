import { GetServerSideProps } from "next";
import Layout from "@components/aoc2024_page_layout";
import FormattedSolution from "@components/formatted_solution";
import { getAOCInput } from "@lib/aoc/getAOCInput";
import Day4Solution from "@lib/aoc/2024/Day4Solution";

const DAY = 4;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents } = await getAOCInput(DAY, "2024");

  return {
    props: {
      input: fileContents,
    }
  }
}

interface AOC2024Day4Props {
  input: string
}

const AOC2024Day4 = ({ input }: AOC2024Day4Props) => {
  const solution = new Day4Solution(input);

  const markdown = ``

  return (
    <Layout day={DAY}>
      <section>
        <FormattedSolution markdown={markdown} />
      </section>
    </Layout>
  )
}

export default AOC2024Day4