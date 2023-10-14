import Head from "next/head";
// import Link from "next/link";
import Layout, { SITE_TITLE } from "../../components/layout";
import utilStyles from "../../styles/utils.module.sass";

const AdventOfCode2022Index = () => {
  return (
    <Layout>
      <Head>
        <title>{SITE_TITLE} | Advent of Code Solutions</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>hi.</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        Advent of Code solutions
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}>
            <a href="/advent-of-code-2022/day1">Day 1</a>
          </li>
        </ul>
      </section>
    </Layout>
  )
}

export default AdventOfCode2022Index;