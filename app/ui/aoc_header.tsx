import { getPuzzleByDay } from "@actions/puzzles";
import { PuzzleType } from "@actions/puzzles/types";
import { getSolution } from "@actions/solutions";
import { SolutionType } from "@actions/solutions/types";
import { getYear } from "@actions/years";
import { YearType } from "@actions/years/types";
import styles from "@styles/aoc.module.scss";
import clsx from "clsx";
import { headers } from "next/headers";
import Link from "next/link";
import Breadcrumbs from "./breadcrumbs";

/**
 * TODO: because this is a server component, we get stale values for year/day/solution,
 * and the info provided to the breadcrumbs may be incorrect for the current path.
 */
export default async function AOCHeader(props: {
  children?: React.ReactNode;
}): Promise<JSX.Element | null> {
  const { children } = props;
  const headersList = await headers();
  const pathname = headersList.get("x-current-path");
  const yearString = pathname?.split("/")[2];
  const dayString = pathname?.split("/")[3];
  const solutionId = pathname?.split("/")[4];
  const page = pathname?.split("/")[5] || null;

  let year: YearType | null = null;
  const yearResponse: { year: YearType } | { error: Error } | null = yearString
    ? await getYear(Number(yearString))
    : null;

  if (yearResponse !== null && "error" in yearResponse) {
    console.error(yearResponse.error);
  } else if (yearResponse !== null && "year" in yearResponse) {
    year = yearResponse.year;
  }

  let day: PuzzleType | null = null;
  const dayResponse =
    dayString && year
      ? await getPuzzleByDay(Number(dayString), year.year)
      : null;
  if (dayResponse !== null && "error" in dayResponse) {
    console.error(dayResponse.error);
  } else if (dayResponse !== null && "puzzle" in dayResponse) {
    day = dayResponse.puzzle;
  }

  let solution: SolutionType | null = null;
  const solutionResponse = solutionId
    ? await getSolution(Number(solutionId))
    : null;
  if (solutionResponse !== null && "error" in solutionResponse) {
    console.error(solutionResponse.error);
  } else if (solutionResponse !== null && "solution" in solutionResponse) {
    solution = solutionResponse.solution;
  }

  return (
    <header className={clsx(styles.header, "bg-gray-600")}>
      <Link href="/advent-of-code" className={clsx(styles.headerTitle)}>
        Advent of Code
      </Link>
      <Breadcrumbs year={year} day={day} solution={solution} page={page} />
      {children}
    </header>
  );
}