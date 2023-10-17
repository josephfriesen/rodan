import { useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetServerSideProps } from "next";
import Layout, { SITE_TITLE } from "../../components/aoc_page_layout";
import Block, { Inline } from "../../components/block";
import styles from "../../styles/aoc.module.scss";
import utilStyles from "../../styles/utils.module.sass";
import Day5Solution from "../../lib/aoc2022/solutions/day5";
import { getAOCInput } from "../../lib/aoc2022/getAOCInput";

const DAY = 5;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents, publicPath } = await getAOCInput(DAY);

  return {
    props: {
      input: fileContents,
      pathToInput: publicPath,
    },
  };
};

interface AOC2022Day5Props {
  pathToInput: string;
  input: string;
}

const AOC2022Day5 = ({ input, pathToInput }: AOC2022Day5Props) => {
  const solution = new Day5Solution(input);
  // console.log(solution);
  solution.test();

  return (
    <Layout day={DAY}>
      <section>
        <h3 className={utilStyles.headingSm}>Part 1 Solution</h3>
        <ul>
          <li></li>
        </ul>
        <h3 className={utilStyles.headingSm}>Part 2 Solution</h3>
      </section>
    </Layout>
  );
};

export default AOC2022Day5;
