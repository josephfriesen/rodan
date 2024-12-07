import Head from "next/head";
import Link from "next/link";
import Layout, { SITE_TITLE } from "../../components/aoc2022_page_layout";
import utilStyles from "../../styles/utils.module.sass";

const AdventOfCode2022Index = () => {
  return (
    <Layout home>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        Advent of Code solutions
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}>
            <Link href="/advent-of-code-2022/day01">Day 1</Link>
          </li>
        </ul>
      </section>
    </Layout>
  );
};

export default AdventOfCode2022Index;
