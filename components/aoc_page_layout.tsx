import React, { useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import utilStyles from "../styles/utils.module.sass";
import styles from "./aoc.module.scss";

export const SITE_TITLE = "Advent of Code 2022";
export const BASE_PATH = "/advent-of-code-2022/";
export const DAYS = Array.from({ length: 3 }, (_, i) => i + 1);

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
      </Head>
      <header className={styles.header}>
        <h1 className={utilStyles.heading2Xl}>{SITE_TITLE}</h1>
      </header>
      <main>{children}</main>
      <footer className={styles.linksFooter}>
        <section className={styles.links}>
          {DAYS_FILTERED.map((d) => {
            if (d === day) {
              return null;
            }
            return (
              <React.Fragment key={`solution-links-day-${day}`}>
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
