import { GetServerSideProps } from "next";
import Layout from "../../components/aoc2024_page_layout";
import { getAOCInput } from "../../lib/aoc/getAOCInput";
import Day2Solution from "../../lib/aoc/2024/Day2Solution";

const DAY = 2;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents, } = await getAOCInput(DAY, "2024");

  return {
    props: {
      input: fileContents,
    }
  }
}

interface AOC2024Day2Props {
  input: string
}

const AOC2024Day2 = ({ input }: AOC2024Day2Props) => {
  const solution = new Day2Solution(input);

  return (
    <Layout day={DAY}>
      <section>
        <h3>Solution</h3>
        <ul>
          <li>

          </li>
        </ul>
      </section>
    </Layout>
  )
}

export default AOC2024Day2