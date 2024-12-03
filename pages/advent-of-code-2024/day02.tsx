import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import Layout from "../../components/aoc2024_page_layout";
import utilStyles from "../../styles/utils.module.sass";
import { Inline } from "../../components/block";
import { getAOCInput } from "../../lib/aoc/getAOCInput";
import Day2Solution from "../../lib/aoc/2024/day2";

const DAY = 2;

export const getServerSideProps: GetServerSideProps = async () => {
  const { fileContents, publicPath } = await getAOCInput(DAY, "2024");

  return {
    props: {
      input: fileContents,
      pathToInput: publicPath
    }
  }
}

interface AOC2024Day2Props {
  input: string
  pathToInput: string,
}

const AOC2024Day2 = ({ input, pathToInput }: AOC2024Day2Props) => {
  const solution = new Day2Solution(input);

  return (
    <Layout day={DAY}>
      <section>
        <h3>Solution</h3>
        <ul>
          <li>
            <Link href={pathToInput}>Input</Link>
          </li>
          <li>

          </li>
        </ul>
      </section>
    </Layout>
  )
}

export default AOC2024Day2