import { useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetServerSideProps } from "next";
import Layout, { SITE_TITLE } from "../../components/aoc_page_layout";
import Block, { Inline } from "../../components/block";
import styles from "../../styles/aoc.module.scss";
import utilStyles from "../../styles/utils.module.sass";
import Day4Solution from "../../lib/aoc2022/solutions/day4";
import { getAOCInput } from "../../lib/aoc2022/getAOCInput";

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
  console.log(solution);

  return (
    <Layout day={DAY}>
      <section>
        <h3 className={utilStyles.headingSm}>Part 1 Solution</h3>
        <ul>
          <li>{/* <Link href={solution.pathToInput}>Input</Link> */}</li>
        </ul>
      </section>
    </Layout>
  );
};

export default AOC2022Day4;
