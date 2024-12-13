import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getYear } from '@actions/years';
import { YearType } from '@actions/years/types';
import { NewPuzzleDataType } from '@actions/puzzles/types';
import { addNewPuzzleToYear } from '@actions/puzzles';
import LinkButton from 'app/ui/link_button';
import styles from '@styles/aoc.module.scss';
import utilStyles from '@styles/utils.module.sass';
import '@styles/aoc.module.scss';
import 'katex/dist/katex.min.css';

export default async function AOCPageLayout(props: {
  children: React.ReactNode;
  params: { year: string };
}) {
  const { children } = props;
  const params = await props.params;
  const { year } = await params;
  const SITE_TITLE = `Advent of Code ${year}`;

  const yearResponse: { year: YearType } | { error: Error } = await getYear(
    Number(year),
  );

  if ('error' in yearResponse) {
    console.error(yearResponse.error);
    return null;
  }

  const { year: yearData } = yearResponse;

  const createNewDay = async (): Promise<void> => {
    'use server';

    const res: { puzzle: NewPuzzleDataType } | { error: Error } =
      await addNewPuzzleToYear(yearData.id);

    if ('error' in res) {
      console.error(res.error);
    } else {
      revalidatePath(res.puzzle.url);
      redirect(res.puzzle.url);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={utilStyles.heading2Xl}>{SITE_TITLE}</h1>
      </header>
      <main>
        {children}

        <footer className={styles.linksFooter}>
          <section className={styles.links}>
            {yearData.puzzles.map((p, idx) => {
              return (
                <React.Fragment key={`solution - links - day - ${p.id}`}>
                  {idx !== 0 && <span className={styles.separator}>|</span>}
                  <Link className={styles.link} href={p.url}>
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
