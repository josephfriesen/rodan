import React from "react";
import Link from "next/link";
import utilStyles from "@styles/utils.module.sass";
import styles from "@styles/aoc.module.scss";
import 'katex/dist/katex.min.css';
import "@styles/aoc.module.scss";
import { getPuzzlesByYear } from "@actions/puzzles";
import { AOCPuzzle } from "@interfaces/AOCPuzzle";

export default async function AOCPageLayout(props) {
  const { children } = props;
  const params = await props.params;
  const year = (await params).year;
  const SITE_TITLE = `Advent of Code ${year}`;
  const BASE_PATH = `/advent-of-code/${year}/`;

  const { puzzles, error } = await getPuzzlesByYear(Number(year)) as { puzzles: AOCPuzzle[], error: any };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={utilStyles.heading2Xl}>{SITE_TITLE}</h1>
      </header>
      <main>{children}</main>
      <footer className={styles.linksFooter}>
        <section className={styles.links}>

          {!error && puzzles?.map((p, idx) => {
            return (
              <React.Fragment key={`solution-links-day-${p.id}`}>
                {idx !== 0 && (
                  <span className={styles.separator}>|</span>
                )}
                <Link
                  className={styles.link}
                  href={p.url}
                >
                  Day {p.day}
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
