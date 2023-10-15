import { useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import Layout, { SITE_TITLE } from "../../components/aoc_page_layout";
import styles from "../../styles/aoc.module.scss";
import utilStyles from "../../styles/utils.module.sass";
import { getAOCInput } from "../../lib/advent-of-code-2022/getAOCInput";
import Block, { Inline } from "../../components/block";

/* translate X, Y, Z into indices for use in PAYOFF_MATRIX and SHAPE_SCORE */

interface ThrowDict {
  [key: string]: number;
}

interface PayoffMatrix {
  // rows: expected payoff for our selection rock/paper/scissor for i = 0,1,2
  // columns: expected payoff for opponent selection of rock/paper/scissor for j=0,1,2
  [key: number]: Array<number>;
}

interface OutcomeToThrowMatrix {
  // rows: what integer (0,1,2)=>(rock,paper,scissor) should we throw in order to i=0,1,2=>i=lose,draw,win
  // columns: our outcome is frozen at lose/draw/win; column is opponent throw selection
  [key: number]: Array<number>;
}

const OURS_DICT: ThrowDict = {
  X: 0, // rock
  Y: 1, // paper
  Z: 2, // scissors
};

const THEIRS_DICT: ThrowDict = {
  A: 0, // rock
  B: 1, // paper
  C: 2, // scissors
};

const PAYOFF_MATRIX: PayoffMatrix = {
  0: [3, 0, 6],
  1: [6, 3, 0],
  2: [0, 6, 3],
};

const MAP_OUTCOME_TO_THROW: OutcomeToThrowMatrix = [
  /*
  given OUTCOME = OUTCOME_DICT[input[1]]
  and OPP_THROW = THEIRS_DICT[input[0]]
  get OUR_THROW_MATRIX[OUTCOME][OPP_THROW] = throw integer (0,1,2) corresponding to rock/paper/scissor
  can then compose this value as an index to feed to PAYOFF_MATRIX as if it were received from OURS_DICT
*/
  [2, 0, 1], // opponent threw rock; pick 0th entry to lose, 1st entry to draw, 2nd entry to win
  [0, 1, 2], // opponent threw paper; pick 0th entry to lose, 1st entry to draw, 2nd entry to win
  [1, 2, 0], // opponent threw scissors; pick 0th entry to lose, 1st entry to draw, 2nd entry to win
];

const SHAPE_SCORE: Array<number> = [1, 2, 3];

export const getStaticProps: GetStaticProps = async () => {
  const { fileContents, publicPath } = await getAOCInput(2);

  return {
    props: {
      input: fileContents,
      pathToInput: publicPath,
    },
  };
};

interface AOC2022Day2Props {
  input: string;
  pathToInput: string;
}

const DAY = 2;

const AOC2022Day2 = ({ input, pathToInput }: AOC2022Day2Props) => {
  interface Trial {
    ours: string;
    theirs: string;
  }

  interface TrialIndices {
    ours: number;
    theirs: number;
  }

  const trials = useMemo<Array<Trial> | null>(() => {
    if (!input) return null;

    const entries = input.split("\n").map((string) => string.trim().split(" "));
    const categorized = entries.map(([a, b]) => ({
      ours: b,
      theirs: a,
    }));
    return categorized;
  }, [input]);

  const trialsIndices = useMemo<Array<TrialIndices> | null>(() => {
    if (!trials) return null;

    return trials.map((t: Trial) => {
      return {
        ours: OURS_DICT[t.ours],
        theirs: THEIRS_DICT[t.theirs],
      };
    });
  }, [trials]);

  const trialsFromOutcomes = useMemo<Array<TrialIndices> | null>(() => {
    if (!trials) return null;

    return trials.map((t: Trial) => {
      const theirs = THEIRS_DICT[t.theirs];
      const ours = MAP_OUTCOME_TO_THROW[OURS_DICT[t.ours]][theirs];
      return {
        ours,
        theirs,
      };
    });
  }, [trials]);

  const trialExpectedScore = ({ ours, theirs }: TrialIndices): number => {
    const outcomeScore = PAYOFF_MATRIX[ours][theirs];
    const shapeScore = SHAPE_SCORE[ours];
    return outcomeScore + shapeScore;
  };

  const sumExpectedScores = useCallback<(() => number) | null>(() => {
    if (!trialsIndices) return null;

    return trialsIndices.reduce((sum: number, trial: TrialIndices) => {
      return sum + trialExpectedScore(trial);
    }, 0);
  }, [trialsIndices]);

  const sumOutcomeExpectedScores = useCallback<(() => number) | null>(() => {
    if (!trialsFromOutcomes) return null;

    return trialsFromOutcomes.reduce((sum: number, trial: TrialIndices) => {
      return sum + trialExpectedScore(trial);
    }, 0);
  }, [trialsFromOutcomes]);

  return (
    <Layout day={DAY}>
      <Head>
        <title>
          {SITE_TITLE} | Day {DAY}
        </title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        {SITE_TITLE} | Day {DAY}
      </section>
      <section>
        <h2 className={utilStyles.headingSm}>Part 1 Solution</h2>
        <ul>
          {input && (
            <li>
              <p>
                The input is the strategy guide given to us by the elf, it is a
                string that looks like:
              </p>
              <Block>
                {`
A Y
A X
B Y
...
                `}
              </Block>
              <p>
                <Link href={pathToInput}>Input</Link>
              </p>
              <p>
                This gives us what our opponent will throw, encrypted with
                values corresponding to:
              </p>
              <Block>
                {`
A: Rock
B: Paper
C: Scissors
                `}
              </Block>
              <p>As well as how we should respond, encrypted with values:</p>
              <Block>
                {`
X: Rock
Y: Paper
Z: Scissors
                `}
              </Block>
            </li>
          )}
          {trials && (
            <li>
              <p>
                We can parse this input string into a series of two-element
                hashes with keys "theirs" and "ours", and value corresponding to
                the first and second characters on each line.
              </p>
              <p>
                This gives us the inputs for each trial of rock paper scissor,
                still encrypted, as a series of hashes that look like:
              </p>
              <Block>{JSON.stringify(trials[0])}</Block>
            </li>
          )}
          {trialsIndices && (
            <>
              <li>
                <p>
                  Next, we can define a <Inline>PAYOFF_MATRIX</Inline> with
                  indices <Inline>i, j</Inline>, where the <Inline>i</Inline>th
                  row and corresponds to our throwing one of rock, paper or
                  scissors, and the <Inline>j</Inline>th column corresponds to
                  our opponent throwing one of rock, paper or scissors. If we
                  fix indices 0 to 2 to correspond to rock, paper and scissors,
                  then we can define the matrix as:
                </p>
                <Block>
                  {`
PAYOFF_MATRIX := [ ${JSON.stringify(PAYOFF_MATRIX[0])}, 
                   ${JSON.stringify(PAYOFF_MATRIX[1])}, 
                   ${JSON.stringify(PAYOFF_MATRIX[2])} ]
                  `}
                </Block>
                <p>
                  To translate <Inline>(X, Y, Z), (A, B, C)</Inline> encrypted
                  values into indices to feed to <Inline>PAYOFF_MATRIX</Inline>,
                  we can define <Inline>OURS_DICT</Inline> and{" "}
                  <Inline>THEIRS_DICT</Inline>
                  hash maps.
                </p>
                <Block>
                  {`
OURS_DICT   := ${JSON.stringify(OURS_DICT)}
THEIRS_DICT := ${JSON.stringify(THEIRS_DICT)}
                  `}
                </Block>
                <p>
                  We can also define a <Inline>SHAPE_SCORE</Inline> array,
                  where, with indices 0 to 2 still fixed as above, we get the
                  corresponding payoff for throwing each of the three values,
                  as:
                </p>
                <Block>
                  {`
SHAPE_SCORE := ${JSON.stringify(SHAPE_SCORE)}
                  `}
                </Block>
              </li>
              <li>
                <p>
                  Then, we defined a function{" "}
                  <Inline>trialExpectedScore</Inline> that takes in a hash as
                  built above with keys <Inline>ours</Inline> and{" "}
                  <Inline>theirs</Inline>, finds the points we should expect to
                  score for a win/draw/loss, and the bonus points we would score
                  for the shape we threw, and sums them together for our
                  expected score for that individual trial.
                </p>
                <p>
                  Example: Suppose we get input <Inline>B Z</Inline>, suggesting
                  our opponent will throw paper (B), and that we should throw
                  scissors (Z). This would decrypt to a hash{" "}
                  <Inline>{`trial := ${JSON.stringify({
                    ours: "Z",
                    theirs: "B",
                  })}`}</Inline>
                  . With our index map{" "}
                  <Inline>(rock, paper, scissors) |-&gt; (0, 1, 2)</Inline> as
                  defined above, we get
                </p>
                <Block>
                  {`
PAYOFF_MATRIX[OURS_MAP[trial["ours"]]][THEIRS_MAP[trial["theirs"]]] 
    = PAYOFF_MATRIX[[OURS_MAP["Z"]][THEIRS_MAP["B"]] 
    = PAYOFF_MATRIX[2][1] 
    = [0, 6, 3][1] 
    = 6
                  `}
                </Block>
                <p>and</p>
                <Block>
                  {`
SHAPE_SCORE[OURS_MAP[trial["ours"]]] 
    = SHAPE_SCORE[OURS_MAP["Z"]] 
    = SHAPE_SCORE[2] 
    = 3
                  `}
                </Block>
                <p>for an expected value of 9.</p>
              </li>
              <li>
                <p>
                  Then, if we sum our expected score over all trials, we get{" "}
                  {sumExpectedScores()}
                </p>
              </li>
            </>
          )}
        </ul>
      </section>
      <section>
        <h2 className={utilStyles.headingSm}>Part 2 Solution</h2>
        <ul>
          {trialsIndices && (
            <>
              <li>
                <p>
                  To translate <Inline>(X, Y, Z)=(lose, draw, win)</Inline> and
                  opponent throw{" "}
                  <Inline>(A, B, C)=(rock, paper, scissors)</Inline>, we can
                  define a 3x3 matrix <Inline>MAP_OUTCOME_TO_THROW</Inline> such
                  the entry
                  <Inline>(i,j)</Inline> gives the throw{" "}
                  <Inline>(A, B, C)=(rock, paper, scissors)</Inline> that we
                  should select, where{" "}
                  <Inline>i = 0,1,2 = (lose, draw, win)</Inline> and{" "}
                  <Inline>j=0,1,2=(rock, paper, scissors)</Inline>. Let{" "}
                  <Inline>trial</Inline> be an ordered pair as above,
                </p>
                <Block>
                  {`
MAP_OUTCOME_TO_THROW := [ ${JSON.stringify(MAP_OUTCOME_TO_THROW[0])},
                          ${JSON.stringify(MAP_OUTCOME_TO_THROW[1])},
                          ${JSON.stringify(MAP_OUTCOME_TO_THROW[2])} ]
                  `}
                </Block>
                <p>Then the throw we want should be given by</p>
                <Block>
                  {`
MAP_OUTCOME_TO_THROW[OURS_DICT[trial[1]]][THEIRS_DICT[trial[0]]]
                  `}
                </Block>
              </li>
              <li>
                <p>
                  Example: suppose we have <Inline>trial = ["A", "Y"]</Inline>.
                  This tells us that our opponent will throw rock ("A"), and we
                  want to draw ("Y"). Then we want to throw rock as well, and
                  expect to earn 3 points for the draw and 1 point for throwing
                  rock, for an expected value on this trial of 4. Check:
                </p>
                <Block>
                  {`
ours := MAP_OUTCOME_TO_THROW[OURS_DICT[trial[1]]][THEIRS_DICT[trial[0]]]
      = MAP_OUTCOME_TO_THROW[OURS_DICT["Y"]][THEIRS_DICT["A"]]
      = MAP_OUTCOME_TO_THROW[1][0]
      = [0, 1, 2][0]
      = 0
                  `}
                </Block>
                <p>
                  This gives us a suggested throw of rock (0). Plugging this
                  back into <Inline>PAYOFF_MATRIX + SHAPE_SCORE</Inline> and we
                  get
                </p>
                <Block>
                  {`
payoff := PAYOFF_MATRIX[ours][THEIRS_DICT[trial[0]]]
        = PAYOFF_MATRIX[0][0]
        = [3, 0, 6][0]
        = 3
shape_score := SHAPE_SCORE[ours]
            = SHAPE_SCORE[0]
            = 1
payoff + shape_score = 3 + 1 = 4
                  `}
                </Block>
                <p>as expected.</p>
              </li>
              <li>
                <p>
                  Then, we sum the trials' expected values from the throws
                  prescribed by this method, and get the total{" "}
                  {sumOutcomeExpectedScores()}
                </p>
              </li>
            </>
          )}
        </ul>
      </section>
    </Layout>
  );
};

export default AOC2022Day2;
