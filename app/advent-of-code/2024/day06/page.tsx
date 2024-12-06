import * as React from "react";
import { GetServerSideProps } from "next";
import Layout from "@components/aoc2024_page_layout";
import FormattedSolution from "@components/formatted_solution";
import { getAOCInput } from "@lib/aoc/getAOCInput";
import Day6Solution from "@lib/aoc/2024/Day6Solution";

const DAY = 6;

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

const AOC2024Day6 = ({ input }: AOC2024Day6Props): JSX.Element => {

  const [solutionText, setSolutionText] = React.useState<{ visitedCount, countGuardLoops } | null>(null);
  const solution: Day6Solution = new Day6Solution(input);

  const markdown: string = `
  ### Solution (part 1):
  - From our input we initialize an $m x n$ matrix $M$, where entries are the strings \`"."\` representing an empty space, \`"#"\` representing
    an obstruction, and the strings \`D := ["<", "^", ">", "v"]\` representing a guard at that position moving in the given direction. Initially 
    there will be no visited spaces, but those will be represented by the string \`"X"\` as the guard moves. We then find the guard's
    traversal path, updating entries of $M$ as we go.
    - At guard position \`(i, j)\`, direction \`d\`, define the guard's next position as \`(i', j')\` where
      - $d = $\`"<"\` $\\Rightarrow$ \`(i', j') = (i, j - 1)\`,
      - $d = $\`"^"\` $\\Rightarrow$ \`(i', j') = (i - 1, j)\`,
      - $d = $\`">"\` $\\Rightarrow$ \`(i', j') = (i, j + 1)\`,
      - $d = $\`"v"\` $\\Rightarrow$ \`(i', j') = (i + 1, j)\`,
    - There are three cases:
      - If $M(i', j')$ is an obstruction, the guard does not move, instead update \`M(i, j)\` to the next direction in \`D\`: 
      \`M(i, j) = D[(D.indexOf(M(i, j)) + 1) % 4]\`.
      - If $M(i', j')$ is \`"."\` or \`"X"\`, set \`M(i', j') = M(i, j)\` (progress the guard one space in their current direction), and update
      previous location as visited, \`M(i, j) = "X"\`.
      - If $i' > m$, $i' = 0$, or $j' > n$, $j' = 0$, the guard escapes, return.
  - Assuming we have be given a valid input which is guaranteed to terminate (the guard will eventually escape given the starting position
    and obstruction layout), the above will eventually return. Once it does, iterate over the matrix counting the entries visited by the guard
    and return the count.
  - Given our input, we end up with a count of ${solutionText?.visitedCount ?? "..."}.

  ### Solution (part 2):
  - In part 1, we assumed that our input would eventually terminate and the guard would eventually escape. In part 2, we have the same input,
    but if we add a new obstruction, it will now be possible for our process above to enter an infinite loop. We want to look at each position
    in $M$ that is empty (not an obstruction or the guard's starting position), and see if adding a single obstruction at that position
    would induce such an infinite guard loop.
  - A guard will loop infinitely through the same path if, when reaching an obstruction, the guard has previously visited that obstruction
    in their traversal path, and from the same direction: the guard will make the same 90 degree turn they had the previous time, and proceed
    along the same path previously traversed until eventually reaching the same obstruction from the same direction, repeat ad infinitum.
  - To check for this, we will alter our approach from part 1. Given our input matrix $M$ as before, and an additional obstruction
    at position \`(a, b)\`:
    - Let $M'$ be a new matrix identical to $M$, but set \`M'[a, b] := "#"\`. We will return true if the guard's traversal path results in
      an infinite loop, and false if the guard is able to escape the bounds of the matrix and terminate their traversal.
    - Let \`visited\` be a hash map, with keys being the positions of all obstructions in $M'$, and values being an array of the directions
      previous visited in the guard's traversal (initiall all empty).
    - Begin traversal as before, with position \`(i, j)\`, direction \`d\`. The guard's next position is given as \`(i', j')\` depending on
      direction \`d\` as before.
      - If \`(i', j')\` is empty (\`"."\`) or visited (\`"X"\`), proceed as in part 1.
      - If the next position is undefined, the guard escapes, terminate and return false.
      - If \`(i', j')\` is an obstruction, check \`visited[(i', j')]\`:
        - If \`visited[(i', j')]\` contains the current direction \`d\`, the guard has previously moved in this direction from this
          obstruction, and is in a loop, return true.
        - Else, add \`d\` to \`visited[(i', j')]\` and update \`d\` as before. 
  - We count all the empty positions in $M$ that would result in an infinite guard loop and return that count. Give our input, we find
    a total of ${solutionText?.countGuardLoops ?? "..."} such positions.
  `

  React.useEffect(() => {
    const solution = new Day6Solution(input);

    if (!solution.isCached) {
      solution.initCache();
    }

    setSolutionText({
      visitedCount: solution.visitedCount,
      countGuardLoops: solution.countGuardLoops
    })
  }, []);

  return (
    <Layout day={DAY}>
      <section>
        <FormattedSolution markdown={markdown} />
      </section>
    </Layout>
  )
}

export default AOC2024Day6;