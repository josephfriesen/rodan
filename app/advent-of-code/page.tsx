import Link from "next/link";
import React from "react";
import { getYears } from "@actions/years";

export default async function AdventOfCodePage({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { year: string };
}) {
  const { years, error } = await getYears();

  if (error || !years) {
    console.error(error);
    return null;
  }

  console.log("here");

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 ">
      <ul className="flex flex-col items-center justify-center space-y-4 text-2xl">
        {years.map((year) => {
          return (
            <li key={year.id}>
              <Link href={year.url}>Advent of Code {year.year}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
