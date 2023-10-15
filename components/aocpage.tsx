import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import utilStyles from "../styles/utils.module.sass";
import styles from "./aoc.module.scss";

export const SITE_TITLE = "Advent of Code 2022";

export default function AdventOfCode2022PageLayout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="RODAN" />
        <meta name="og:title" content={SITE_TITLE} />
      </Head>
      <header className={styles.header}>
        <h1 className={utilStyles.heading2Xl}>{SITE_TITLE}</h1>
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/advent-of-code-2022">Back to Advent of Code 2022</Link>
        </div>
      )}
    </div>
  );
}
