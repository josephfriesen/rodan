import Head from "next/head";
import Layout, { SITE_TITLE } from "../components/layout";
import Link from "next/link";
import utilStyles from "../styles/utils.module.sass";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <ul>
          <li><Link href="/advent-of-code-2022">Advent of Code 2022</Link></li>
          <li><Link href="/advent-of-code-2024">Advent of Code 2024</Link></li>
        </ul>
      </section>
    </Layout>
  );
}
