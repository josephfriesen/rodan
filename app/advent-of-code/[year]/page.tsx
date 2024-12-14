import { addNewPuzzleToYear } from "@actions/puzzles";
import { NewPuzzleDataType } from "@actions/puzzles/types";
import { getYear } from "@actions/years";
import { YearType } from "@actions/years/types";
import styles from "@styles/aoc.module.scss";
import LinkButton from "app/ui/link_button";
import clsx from "clsx";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function AOCYearPage({
  params,
}: {
  params: { year: string };
}): Promise<JSX.Element | null> {
  const { year } = await params;
  const yearResponse: { year: YearType } | { error: Error } = await getYear(
    Number(year)
  );

  if ("error" in yearResponse) {
    console.error(yearResponse.error);
    return null;
  }

  const { year: yearData } = yearResponse;

  const createNewDay = async (): Promise<void> => {
    "use server";

    const res: { puzzle: NewPuzzleDataType } | { error: Error } =
      await addNewPuzzleToYear(yearData.id);

    if ("error" in res) {
      console.error(res.error);
    } else {
      revalidatePath(res.puzzle.url);
      redirect(res.puzzle.url);
    }
  };

  return (
    <main className={clsx(styles.page)}>
      <section className={clsx(styles.linksBody)}>
        <div className={styles.links}>
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
        </div>
        <div className={styles.links}>
          <Link className={styles.link} href={yearData.url}>
            Back to Index
          </Link>
          <span className={styles.separator}>|</span>
          <LinkButton clickCallback={createNewDay}>Add Day</LinkButton>
        </div>
      </section>
    </main>
  );
}
