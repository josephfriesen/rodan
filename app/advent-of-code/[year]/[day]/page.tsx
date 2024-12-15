import React from "react";
import styles from "@styles/aoc.module.scss";
import utilStyles from "@styles/utils.module.sass";
import clsx from "clsx";
import { getPuzzleByDay } from "@lib/actions/puzzles";
import { PuzzleType } from "@lib/actions/puzzles/types";
import { createNewSolution } from "@lib/actions/solutions";
import { NewSolutionDataType } from "@lib/actions/solutions/types";
import { redirect } from "next/navigation";
import LinkButton from "app/ui/link_button";
import Link from "next/link";

export default async function AOCPage(props: {
  params: { year: string; day: string };
}): Promise<JSX.Element | null> {
  const params = await props.params;
  const { year, day } = params;

  const puzzleResponse: { puzzle: PuzzleType } | { error: Error } =
    await getPuzzleByDay(Number(day), Number(year));
  if ("error" in puzzleResponse) {
    console.error(`page error: ${puzzleResponse.error}`);
    console.error(puzzleResponse.error);
    return null;
  }
  const { puzzle } = puzzleResponse;

  const handleNewSolutionClick = async (): Promise<void> => {
    "use server";

    const response = await createNewSolution(Number(day), Number(year));

    if ("solution" in response) {
      const newSolutionData: NewSolutionDataType = response.solution;
      redirect(newSolutionData.url);
    } else {
      console.error(response.error);
    }
  };

  return (
    <main className={clsx(styles.page)}>
      <section className={clsx(styles.pageBody, styles.dayBody, "bg-white")}>
        <h2 className={clsx(utilStyles.headingMd, utilStyles.centered)}>
          <a
            target="_blank"
            href={puzzle.externalUrl}
            rel="noopener noreferrer"
          >
            Day {day}
          </a>
        </h2>
        <h3>Solutions</h3>
        {puzzle.solutions?.length > 0 && (
          <React.Fragment>
            <ul className={utilStyles.list}>
              {puzzle.solutions.map((solution) => (
                <li key={solution.id}>
                  <Link href={solution.url}>
                    ({solution.id}) {solution.createdAt?.toLocaleString()}{" "}
                    {solution.isAocData && "🎄"}{" "}
                    {solution.isTestData && "(test)"}{" "}
                    {solution.isSolutionValid ? "✅" : "❌"}
                  </Link>
                </li>
              ))}
            </ul>
          </React.Fragment>
        )}
        <LinkButton clickCallback={handleNewSolutionClick}>
          Create new solution for day {day}
        </LinkButton>
      </section>
    </main>
  );
}
