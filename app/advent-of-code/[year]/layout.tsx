import React from "react";
import Link from "next/link";
import utilStyles from "@styles/utils.module.sass";
import styles from "@styles/aoc.module.scss";
import 'katex/dist/katex.min.css';
import "@styles/aoc.module.scss";
import { getYear } from "@actions/years";
import { addNewPuzzleToYear } from "@actions/puzzles";
import { revalidatePath, } from "next/cache";
import { redirect } from "next/navigation";
import LinkButton from "@components/link_button";

export default async function AOCPageLayout(props: { children: React.ReactNode, params: { year: string } }) {
  const { children } = props;
  const params = await props.params;
  const { year } = await params;
  const SITE_TITLE = `Advent of Code ${year}`;

  const { year: yearData, error } = await getYear(Number(year));

  if (error || !yearData) {
    console.error(error);
    return null;
  }

  const createNewDay = async (): Promise<void> => {
    "use server";

    const res = await addNewPuzzleToYear(yearData.id);

    if (res.error) {
      console.error(res.error);
    }

    if (res.puzzle) {
      revalidatePath(res.puzzle.year.url);
      redirect(res.puzzle.url);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={utilStyles.heading2Xl}>{SITE_TITLE}</h1>
      </header>
      <main>{children}

        <footer className={styles.linksFooter}>
          <section className={styles.links}>
            {!error && yearData.puzzles.map((p, idx) => {
              return (
                <React.Fragment key={`solution - links - day - ${p.id}`}>
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
            <Link className={styles.link} href={yearData.url}>
              Back to Index
            </Link>
            <span className={styles.separator}>|</span>
            <LinkButton clickCallback={createNewDay}>Add Day</LinkButton>
          </section>
        </footer>
      </main>
    </div>
  );
}
