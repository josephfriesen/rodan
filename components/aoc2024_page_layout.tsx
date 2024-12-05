import React, { useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import utilStyles from "../styles/utils.module.sass";
import styles from "../styles/aoc.module.scss";
import 'katex/dist/katex.min.css';
import "@styles/aoc.module.scss";

export const SITE_TITLE = "Advent of Code 2024";
export const BASE_PATH = "/advent-of-code-2024/";
export const DAYS = Array.from({ length: 5 }, (_, i) => i + 1);

export default function AdventOfCode2022PageLayout({
  children,
  home,
  day,
}: {
  children: React.ReactNode;
  home?: boolean;
  day?: number;
}) {
  const DAYS_FILTERED = useMemo(() => {
    if (!day) return DAYS;
    return DAYS.filter((d) => d !== day);
  }, [day]);

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="RODAN" />
        <meta name="og:title" content={SITE_TITLE} />
        <title>{`${SITE_TITLE} | ${home ? "Advent of Code 2024 Solutions" : ""
          }${day ? `Day ${day}` : ""}`}</title>
      </Head>
      <header className={styles.header}>
        <h1 className={utilStyles.heading2Xl}>{SITE_TITLE}</h1>
        {!home && !!day && (
          <h2 className={utilStyles.headingMd}>
            <a
              target="_blank"
              href={`https://adventofcode.com/2024/day/${day}`}
              rel="noopener noreferrer"
            >
              Day {day}
            </a>
          </h2>
        )}
      </header>
      <main>{children}</main>
      <footer className={styles.linksFooter}>
        <section className={styles.links}>
          {DAYS_FILTERED.map((d) => {
            if (d === day) {
              return null;
            }
            return (
              <React.Fragment key={`solution-links-day-${d}`}>
                {d !== DAYS_FILTERED[0] && (
                  <span className={styles.separator}>|</span>
                )}
                <Link
                  className={styles.link}
                  href={`${BASE_PATH}day${d.toString().padStart(2, "0")}`}
                >
                  Day {d}
                </Link>
              </React.Fragment>
            );
          })}
        </section>
        {!home && (
          <section className={styles.links}>
            <Link className={styles.link} href={BASE_PATH}>
              Back to Index
            </Link>
          </section>
        )}
      </footer>
    </div>
  );
}
