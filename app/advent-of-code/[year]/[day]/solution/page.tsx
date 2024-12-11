import Link from "next/link";
import { getPuzzleByDay } from "@lib/actions/puzzles";
import { redirect } from "next/navigation";
import clsx from "clsx";
import utilStyles from "@styles/utils.module.sass";

export default async function AOCSolutionPage({ children, params }: { children: React.ReactNode, params: { year: string, day: string } }) {
  const { year, day } = await params;

  const { puzzle, error: puzzleError } = await getPuzzleByDay(Number(day), Number(year));

  if (puzzleError || !puzzle) {
    console.error(puzzleError);
    redirect("/advent-of-code/year/day");
  }

  console.log(puzzle);

  return (
    <section>
      <h3 className={utilStyles.headingSm}>Day {day} Solutions</h3>
      {puzzle.solutions.length > 0 && (
        <ul className={clsx(utilStyles.list)}>
          {puzzle.solutions.map((solution) => {
            return (
              <li key={solution.id}>
                ID: <Link href={solution.url}>{solution.id}</Link>: Created {solution.createdAt.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}