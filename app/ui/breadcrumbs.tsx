"use client";

import Link from "next/link";
import styles from "@styles/aoc.module.scss";
import { YearType } from "@lib/actions/years/types";
import { PuzzleType } from "@lib/actions/puzzles/types";
import { SolutionType } from "@lib/actions/solutions/types";

export default function Breadcrumbs({
  year,
  day,
  solution,
  page,
}: {
  year: YearType | null;
  day: PuzzleType | null;
  solution: SolutionType | null;
  page: string | null;
}): JSX.Element {
  return (
    <div className={styles.breadcrumbs}>
      {year && (
        <div className={styles.breadcrumb}>
          <Link href={year.url}>{year.year}</Link>
        </div>
      )}
      {day && (
        <div className={styles.breadcrumb}>
          <Link href={day.url}>Day {day.day}</Link>
        </div>
      )}
      {solution && (
        <div className={styles.breadcrumb}>
          <Link href={solution.url}>Solution</Link>
        </div>
      )}
      {page && <div className={styles.breadcrumb}>{page}</div>}
    </div>
  );
}
