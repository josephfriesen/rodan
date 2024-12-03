import { GetServerSideProps } from "next";
import Layout from "../../components/aoc2024_page_layout";
import { getAOCInput } from "../../lib/aoc/getAOCInput";
import Day2Solution from "../../lib/aoc/2024/Day2Solution";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex"

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

  const markdown = `
  ### Solution (Part 1)
  
  - We set out to count the total number of "safe" reports in our input.
  - A given report $r$ of non-negative integers $x_1, x_2, ... , x_n, n \\ge 2$ is considered "safe" if and only if:
    - All elements are either increasing or decreasing: 
      - for all $i = 1, ..., n-1$, $x_1 > x_2 => x_i > x_{i+1}$ (decreasing), or
      - $x_1 < x_2 => x_i < x_{i+1}$ (increasing) 
    - and the difference between any two consecutive numbers is at least one and at most three: $1 \\le |x_i - x_{i+1}| \\ge 3$ for all $i = 1, ..., n-1$.
  - To determine if a report is safe, create function \`determineIfSafe\`, which takes in a report \`r = [x1, x2, ... , xn]\` as parameter, and returns a boolean value indicating whether the report is safe or not.
    - First, consider elements \`r[0]\` and \`r[1]\`. If \`r[0] == r[1]\`, then the report is unsafe (non-increasing or non-decreasing), return false. Declare a variable \`isIncreasing := x1 < x2\`.
    - We then iterate through all pairs of consecutive numbers \`r[i], r[i+1]\`. Set the difference between these to be \`diff := r[i+1] - r[i]\`. If \`isIncreasing == false\`, set \`diff = diff * -1\`.
    - Then, if \`diff > 3\` or \`diff < 1\`, the report is unsafe, return false. Else, continue.
    - If all pairs have been checked, return true.
  - Checking all of the reports in this fashion gives us a total of ${solution.totalSafe} safe reports.
  
  ### Solution (Part 2)

  - We set out to count the total number of reports that can be considered "safe" with a single fault tolerance.
  - A report $r$ is safe with fault tolerance if:
    - The report itself is safe, or
    - There exists an element $x \\in r$ such that the report $r \\setminus \\{x\\}$ is safe.
  - To determine if a report is safe, consider the report as an array of integers \`r = [x1, x2, ... , xn]\`. Return a boolean value indicating whether the report is safe with fault tolerance.
    - If the report is safe by \`determineIfSafe(r)\`, return true.
    - Else, iterate through all elements \`x\` of \`r\`. Define report $r_x := r \\setminus \\{x\\}$. If \`determineIfSafe(\`$r_x$\`)\` is true, we have found the element $x$ such that its removal gives a safe report, return true.
    - Else, continue to the next element. If all elements have been checked and no element $x$ satisfies \`determineIfSafe(\`$r_x$\`)\`, return false.
  - Checking all of the reports in this fashion gives us a total of ${solution.totalSafeWithFaultTolerance} safe reports with fault tolerance.
  `

  return (
    <Layout day={DAY}>
      <section>
        <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          children={markdown}
        />
      </section>
    </Layout>
  )
}

export default AOC2024Day2