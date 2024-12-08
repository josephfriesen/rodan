import React from "react";
import Head from "next/head";
import Link from "next/link";
import utilStyles from "@styles/utils.module.sass";
import styles from "@styles/aoc.module.scss";
import 'katex/dist/katex.min.css';
import "@styles/aoc.module.scss";
import * as navigation from "next/navigation";

export const DAYS = Array.from({ length: 7 }, (_, i) => i + 1);

export default async function AOCPageLayout(props) {
  const { children } = props;
  const params = await props.params;
  const year = (await params).year;
  console.log(navigation);
  const SITE_TITLE = `Advent of Code ${year}`;
  const BASE_PATH = `/advent-of-code/${year}/`;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={utilStyles.heading2Xl}>{SITE_TITLE}</h1>
      </header>
      <main>{children}</main>
      <footer className={styles.linksFooter}>
        <section className={styles.links}>
          {DAYS.map((d) => {
            return (
              <React.Fragment key={`solution-links-day-${d}`}>
                {d !== DAYS[0] && (
                  <span className={styles.separator}>|</span>
                )}
                <Link
                  className={styles.link}
                  href={BASE_PATH + d}
                >
                  Day {d}
                </Link>
              </React.Fragment>
            );
          })}
        </section>
        <section className={styles.links}>
          <Link className={styles.link} href={BASE_PATH}>
            Back to Index
          </Link>
        </section>
      </footer>
    </div>
  );
}
