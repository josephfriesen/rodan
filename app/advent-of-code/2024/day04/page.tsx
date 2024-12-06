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

  const markdown = `
  ### Solution (part 1)

  - We brute force this problem. We set up a \`Matrix M\` data structure, where entries are strings, and \`+\` is the string 
  concatenation operation. Instatiate it by splitting the input string into an array of strings, each of which will be a row of the matrix, 
  and split that string into single characters.
  - Then, we traverse each entry of the matrix. Let \`count <- 0\`. For each entry \`m(i, j)\` of \`M\`:
    - If \`m(i, j) != "X"\`, continue.
    - For each of the 8 possible directions, we check if the entry \`m(i, j)\` is the first letter of 4-letter string \`"XMAS"\`,
    and if so, increment \`count\`.
    - Directions: N, NE, E, SE, S, SW, W, NW.
      - For each direction, build the 4-letter string starting from \`m(i, j)\` and going in that direction.
      - Example: if direction is E, we build the string \ 
        \`
          m(i, j) + m(i, j+1) + m(i, j+2) + m(i, j+3)
        \`.
      - If the direction would go beyond the edge of the matrix, break. For example, for \`m(0, 0)\`, if direction is N, the second
      character in the string would be \`m(-1, 0)\`, which is undefined, break.
  - Return \`count\`. Given our input, we end up with a count of ${solution.countXmases}.
   
  ### Solution (part 2)
  - Again we can brute force the problem by examining each entry of the matrix.
  - Let \`count <- 0\`. For each entry \`m(i, j)\` of matrix \`M\`:
    - Build two 3-character strings, one starting NE of \`m(i, j)\` to SW, and the other starting NW of \`m(i, j)\` to SE:
      - NE to SW: \`m(i-1, j+1) + m(i, j) + m(i+1, j-1)\`
      - NW to SE: \`m(i-1, j-1) + m(i, j) + m(i+1, j+1)\`
    - If both strings are equal to "MAS" or "SAM", increment \`count\`.
  - Return \`count\`. Given our input, we end up with a count of ${solution.countXmasExes}.
  `

  return (
    <Layout day={DAY}>
      <section>
        <FormattedSolution markdown={markdown} />
      </section>
    </Layout>
  )
}

export default AOC2024Day4