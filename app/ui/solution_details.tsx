import { SolutionType } from "@lib/actions/solutions/types";
import styles from "@styles/aoc.module.scss";
import utilStyles from "@styles/utils.module.sass";
import clsx from "clsx";
import Link from "next/link";
import SolutionSolvedPopover from "@components/solution_solved_popover";
import SolutionDataPopover from "@components/solution_data_popover";

export default function SolutionDetails({
  solution,
}: {
  solution: SolutionType;
}) {
  const { puzzle } = solution;

  return (
    <div className={styles.solutionDetails}>
      <h2 className={clsx(utilStyles.headingMd, utilStyles.centered)}>
        <a target="_blank" href={puzzle.externalUrl} rel="noopener noreferrer">
          Day {puzzle.day} Solution
        </a>
      </h2>
      <ul>
        <li>ID: {solution.id}</li>
        <li>Created: {solution.createdAt.toLocaleString()}</li>
      </ul>
      <ul>
        <li>
          <SolutionSolvedPopover solution={solution} />
        </li>
        <li>
          <SolutionDataPopover solution={solution} />
        </li>
        <li>
          <Link href={`${solution.url}/input`}>Input</Link>
        </li>
      </ul>
    </div>
  );
}
