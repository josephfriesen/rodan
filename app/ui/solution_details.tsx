import { SolutionType } from "@lib/actions/solutions/types";
import styles from "@styles/aoc.module.scss";
import utilStyles from "@styles/utils.module.sass";
import clsx from "clsx";
import Link from "next/link";
import SolutionSolvedPopover from "@ui/solution_solved_popover";
import SolutionDataPopover from "@ui/solution_data_popover";
import { Card, CardHeader, CardContent } from "@components/ui/card";

export default function SolutionDetails({
  solution,
}: {
  solution: SolutionType;
}) {
  const { puzzle } = solution;

  const buttonStyles = [
    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground p-2",
    "flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
    "transition-colors cursor-pointer",
    "text-primary text-sm not-italic font-medium hover:no-underline",
  ];

  return (
    <Card
      className={clsx(styles.solutionDetails, "w-full", "mb-16", "border-none")}
    >
      <CardHeader className={clsx(utilStyles.headingMd, utilStyles.centered)}>
        <a target="_blank" href={puzzle.externalUrl} rel="noopener noreferrer">
          Day {puzzle.day} Solution
        </a>
      </CardHeader>
      <CardContent>
        <ul className={clsx("flex items-center")}>
          <li>ID: {solution.id}</li>
          <li>Created: {solution.createdAt.toLocaleString()}</li>
          <li className={clsx("flex")}>
            <SolutionSolvedPopover solution={solution} />
            <SolutionDataPopover solution={solution} />
            <Link
              className={clsx(...buttonStyles)}
              href={`${solution.url}/input`}
            >
              Input
            </Link>
            <Link
              className={clsx(...buttonStyles, "rounded-r-md")}
              href={`${solution.url}/explanation`}
            >
              Explanation
            </Link>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
