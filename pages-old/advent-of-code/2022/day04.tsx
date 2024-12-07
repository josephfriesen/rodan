import { useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetServerSideProps } from "next";
import Layout, { SITE_TITLE } from "../../components/aoc2022_page_layout";
import Block, { Inline } from "../../components/block";
import styles from "../../styles/aoc.module.scss";
import utilStyles from "../../styles/utils.module.sass";
import Day4Solution from "../../lib/aoc/2022/day4";
import { getAOCInput } from "../../lib/aoc/getAOCInput";

const DAY = 4;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents, publicPath } = await getAOCInput(DAY);

  return {
    props: {
      input: fileContents,
      pathToInput: publicPath,
    },
  };
};

interface AOC2022Day4Props {
  pathToInput: string;
  input: string;
}

const AOC2022Day4 = ({ input, pathToInput }: AOC2022Day4Props) => {
  const solution = new Day4Solution(input);

  return (
    <Layout day={DAY}>
      <section>
        <h3 className={utilStyles.headingSm}>Part 1 Solution</h3>
        <ul>
          <li>
            <Link href={pathToInput}>Input</Link>
          </li>
          <li>
            <p>
              First, we parse our input string into an array of Elf pairs. Each
              line consists of two elves' section coverages, separated by a
              comma. For line of format <Inline>(x1)-(y1),(x2)-(y2)</Inline>, we
              say integers <Inline>x1, x2</Inline> are the first section that
              elves 1 and 2 will cover, and integers <Inline>y1, y2</Inline> are
              the last sections elves 1 and 2 will cover.
            </p>
            <p>
              We define a function
              <Inline>inputToElfPairs</Inline> that will take string{" "}
              <Inline>input</Inline> to an array we will call{" "}
              <Inline>ElfPairs</Inline>. To do this, we split{" "}
              <Inline>input</Inline> into an array by new lines, and then for
              each line, output an <Inline>ElfPair</Inline>, which is an array
              of two Maps, each consisting of two key-value pairs,{" "}
              <Inline>start</Inline> and <Inline>end</Inline>.
            </p>
            <Block>
              {`
"(x1),(y1)-(x2),(y2)" => 
    [ Map("start" -> x1, "end" -> y1), Map("start" -> x2, "end" -> y2) ]
                `}
            </Block>
            <p>
              Given our input, the first entries of <Inline>ElfPairs</Inline>{" "}
              will look like
            </p>
            <Block>{`
${solution.elfPairsDemo(solution.firstThreeElfPairs)}...
`}</Block>
          </li>
          <li>
            <p>
              Next, for each pair in our list, we need to sort the individual
              elves in the pair to ensure we have a well-ordering of the pair,
              which will make comparisons between the two easier. Let{" "}
              <Inline>pair</Inline> be a pair of elves in our list of{" "}
              <Inline>ElfPairs</Inline>, and let <Inline>a, b</Inline> be two
              distinct elves in the pair. We map <Inline>a, b</Inline> to the
              ordered pair <Inline>(x, y)</Inline>in the following way:
            </p>
            <ul>
              <li>
                <Inline>a["start"] &lt; b["start"] =&gt; a := x, b := y</Inline>
              </li>
              <li>
                <Inline>
                  a["start"] = b["start"] &amp; a["end"] &ge; b["end"] =&gt; a
                  := x, b := y
                </Inline>
              </li>
            </ul>
            <p>
              In other words, we first sort by start in ascending order. If two
              elves have the same start, we place the elf with the larger end
              first.
            </p>
            <p>
              Then, we sort the entire list of <Inline>ElfPairs</Inline> by the
              start value of the first elf in the pair, then by the first elf's
              end. This gives us a partially-ordered list (two pairs' first elf
              could have equal start and end values, we indifferent about
              sorting two such pairs further) of well-ordered pairs of elves. We
              call such an ordered list our <Inline>sortedElfPairs</Inline>.
              Give our input, after sorting, the first few pairs look like
            </p>
            <Block>{`
sortedElfPairs = ${solution.elfPairsDemo(solution.firstThreeSortedElfPairs)}...
            `}</Block>
          </li>
          <li>
            <p>
              Now, for each pair in our sorted list, we determine if one elf's
              coverage interval completely contains the other's, which we call a
              redundant pair. Because we ordered the individual pairs in the way
              we did, it suffices to check if the first elf's coverage contains
              the second's. Let <Inline>(a, b)</Inline> be the ordered pair of
              elves, with <Inline>a</Inline> having endpoints{" "}
              <Inline>(x1, y1)</Inline> and
              <Inline>b</Inline> having endpoints <Inline>(x2, y2)</Inline>. We
              have two cases to consider:
            </p>
            <ul>
              <li>
                <Inline>x1 = x2</Inline>. Then, by our ordering, we know{" "}
                <Inline>y1 &ge; y2</Inline>, and thus <Inline>b</Inline>
                is completely contained within <Inline>a</Inline>.
              </li>
              <li>
                <Inline>x1 &le; x2</Inline>. Then, by our ordering,{" "}
                <Inline>a</Inline>
                completely contains <Inline>b</Inline> if and only if{" "}
                <Inline>y1 &ge; y2</Inline>.
              </li>
            </ul>
          </li>
          <li>
            We iterate through our list of <Inline>sortedElfPairs</Inline>, and
            count the pairs for which the above applies, in which{" "}
            <Inline>a</Inline> and <Inline>b</Inline>
            have equal start values, or in which the end of <Inline>
              a
            </Inline>{" "}
            is greater than the end of <Inline>b</Inline>. For our input, this
            count is {solution.redundancyCount}.
          </li>
        </ul>
        <h3 className={utilStyles.headingSm}>Part 2 Solution</h3>
        <ul>
          <li>
            <p>
              Now, with our sorted list, we need to consider how many of these
              pairs overlap in at least one section. Let <Inline>(a, b)</Inline>{" "}
              be an ordered pair of elves, with endponts{" "}
              <Inline>a := (x1, y1)</Inline> and <Inline>b := (x2, y2)</Inline>.
              Again, we consider two cases:
            </p>
            <ul>
              <li>
                <Inline>x1 = x2</Inline>. Then these elves overlap at least at
                the section <Inline>x1</Inline>, thus this is an overlapping
                pair.
              </li>
              <li>
                <Inline>x1 &le; x2.</Inline> By our ordering, we know that{" "}
                <Inline>y1 &ge; y2</Inline>, thus this pair will overlap if and
                only if the start of <Inline>b</Inline> is less than or equal to
                the end of <Inline>a</Inline>, or if <Inline>x2 &le; y1</Inline>
                .
              </li>
            </ul>
          </li>
          <li>
            If we iterate through our sorted list and count pairs satisfying the
            above, we get a total of {solution.overlapCount} overlapping pairs.
          </li>
        </ul>
      </section>
    </Layout>
  );
};

export default AOC2022Day4;
