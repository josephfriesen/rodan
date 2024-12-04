import { GetServerSideProps } from "next";
import Layout from "../../components/aoc2024_page_layout";
import { getAOCInput } from "../../lib/aoc/getAOCInput";
import Day3Solution from "../../lib/aoc/2024/Day3Solution";
import FormattedSolution from "../../components/formatted_solution";

const DAY = 3;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents } = await getAOCInput(DAY, "2024");

  return {
    props: {
      input: fileContents,
    }
  }
}

interface AOC2024Day3Props {
  input: string
}

const AOC2024Day3 = ({ input }: AOC2024Day3Props) => {
  const solution = new Day3Solution(input);
  console.log(solution);

  const markdown = `
  ### Solution (Part 1)

  - This is a simple regex problem. We want to find all instances in our input matching \`mul\(\d+,\d+\)\`,
  which is to say each instance in which we have exactly the characters \`mul(\`, a number of any number of digits,
  a comma, another number of any number of digits, and \`).
  - Once we have constructed an array of all of the instances matching our regex pattern, we map that array to
  an array of arrays consisting of the two numbers: in each string replace \`mul(\` and \`)\` with an empty string,
  split the resulting string \`.split(",")\`, and parse the two strings to numbers.
  - Then, we have our array of arrays, we reduce taking the sum of the products of the inner arrays, giving us our
  final answer ${solution.sumOfProducts}.
 
  ### Solution (Part 2)
  
  - This time, we expand our regex matching pattern to also match the strings "do()" and "don't()". We then alter
  how we sum our products according to the instructions. Given list of $n$ instructions \`i := [x_1, x_2, ..., x_n]\`, where
  each string \`x_i\` is a string of the form "do()", "don't()", or "mul(m, n)", where \`m\` and \`n\` are integers, do the
  following:

  - Init: let \`sum <- 0\`, \`go <- true\`.
  - For each string \`x\` in \`i\`:
    - If \`x\` is "do()", set \`go <- true\`, continue.
    - If \`x\` is "don't()", set \`go <- false\`, continue.
    - If \`go\` is false, continue.
    - \`x\` must be of the form "mul(m, n)". Set \`sum <- sum + (m * n)\`.
  - Return \`sum\`.

  - Calculating our sum of products in this way, we get our final answer ${solution.sumOfInstructedProducts}.
  `

  return (
    <Layout day={DAY}>
      <section>
        <FormattedSolution markdown={markdown} />
      </section>
    </Layout>
  )
}

export default AOC2024Day3