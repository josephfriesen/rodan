import Link from "next/link";
import React from "react";
import { getYears } from "@actions/years";
import clsx from "clsx";
import { YearType } from "@actions/years/types";
import styles from "@styles/aoc.module.scss";

export default async function AdventOfCodePage(): Promise<JSX.Element | null> {
  const yearsResponse: { years: YearType[] } | { error: Error } =
    await getYears();

  if ("error" in yearsResponse) {
    console.error(yearsResponse.error);
    return null;
  }

  const { years } = yearsResponse;

  return (
    <main
      className={clsx(
        "flex flex-col items-center justify-center min-h-screen py-2 bg-gray-300",
        "advent-of-code-page",
        styles.page,
        styles.adventOfCodePage
      )}
    >
      <ul className="flex flex-col items-center justify-center space-y-4 text-2xl">
        {years.map((year) => {
          return (
            <li key={year.id}>
              <Link href={year.url}>Advent of Code {year.year}</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
