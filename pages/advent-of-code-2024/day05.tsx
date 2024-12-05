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

  const markdown = `
  ### Solution (part 1)

  - To solve this, we can model our problem as a directed acyclic graph. Let $G = (V, E)$ be a directed acyclic graph, where $V$ 
    our vertex set is the set of all pages, and $E = \\{(u, v) \\in V \\times V \\mid u \\rightarrow v\\}$ our edge set 
    represents a rule stating that one page must appear before another.
  - For example, let our rules be the same as given in the example. Then $V = \\{47, 53, 97, 13, 61, 75, 29 \\}$, and each 
    rule gives us an edge, $E = \\{(47, 53), (97, 13), (97, 61), ...\\}$.
  - Building our graph: 
    - First instantiate \`graph = new DirectedGraph()\`.
    - Build node and edge sets: given our input, we match the pattern \`\\d+\\|\\d+\`. For each match, split the string on the pipe 
    to get a two element array of the form \`[u, v]\`. Call \`graph.addEdge(u, v)\`.
  - Next, parse the input to build our set of updates. Filter the update to remove all matches of \`\\d+\\|\\d+\` (and remove
    the empty line separating rules and updates). Split on \`\\n\` to get an array of strings, and split each string on
    the comma. The result is a set of updates, each update consisting of an ordered set of pages (a subset of our vertex set above).
  - Determine update validity: An update is considered valid if it does not contain a pair of pages \`u, v\` such that
    \`u\` appears before \`v\` in the update but there is a rule that states \`v\` must appear before \`u\` (in other words, there is
    no line \`v|u\` in our input). In our graph model, this is equivalent to saying that an update is valid if and only if
    for any two pages \`u, v\` in the update, if \`u\` appears before \`v\`, then $(v, u) \\notin E$.
    - Let \`U = [u_1, u_2, ..., u_n]\` be an update and let our graph $G$ be as above. Check validity:
    - Let \`i = 0, 1, ..., n-1\`, let \`j = i + 1, i + 2, ..., n\`. If $(u_j, u_i) \\in E$, return false. Else continue. If iterate
      through all of \`U\`, return true.
  - Taking all updates, we sum the middle entries of all valid updates:
    - Let \`sum <- 0\`.
    - Let \`U_i = [u_1, u_2, ..., u_n]\` be an update. If \`U_i\` is invalid, continue. Else, add the $\\lfloor \\frac{n}{2} \\rfloor$
    th entry to \`sum\`.
    - Return \`sum\`.
  - Given our input, our sum of middle entries of all valid updates is ${solution.sumOfValidUpdatesPages}.

  ### Solution (part 2)

  - Again, let $G = (V, E)$ be our directed acyclic graph model constructed as before. To get our sum of the middle entries of corrected updates,
    we need to find all invalid updates, correct them, and sum their middle entries.
    - Let \`sum <- 0\`.
    - Let \`U_i = [u_1, u_2, ..., u_n]\` $ \\subseteq V$ be an update. If \`U_i\` is valid, continue. Else, we must correct \`U_i\` such that we
      obtain a valid update \`V_i\`.
      - Let \`V_i := [u_1, u_2, ..., u_n]\` be a copy of update \`U_i\`.
      - We iterate through all pairs of pages in \`V_i\`. Let \`j = 0, 1, ..., n-2\`, let \`k = j + 1, j + 2, ..., n-1\`. If
        $(u_k, u_j) \\in E$:
        - Swap the elements: \`V_i[j] := u_k\` and \`V_i[k] := u_j\`.
        - Break and start again with the new \`V_i\`: If \`V_i\` is valid, return \`V_i\`. Else, iterate through all pairs as above
          to find an pair of pages that make \`V_i\` invalid, and swap them. Repeat until \`V_i\` is valid and return \`V_i\`.
    - Let \`sum <- sum + V_i[\`$\\lfloor \\frac{n}{2} \\rfloor$\`]\`.
    - Return \`sum\`.
  - Given our input, our sum of the middle entries of corrected invalid updates is ${solution.sumOfCorrectedUpdatesPages}.
        
  `

  return (
    <Layout day={DAY}>
      <section>
        <FormattedSolution markdown={markdown} />
      </section>
    </Layout>
  )
}

export default AOC2024Day5;