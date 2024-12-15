import { SolutionType } from "@lib/actions/solutions/types";
import styles from "@styles/aoc.module.scss";
import Link from "next/link";

export default function SolutionDetails({
  solution,
}: {
  solution: SolutionType;
}) {
  return (
    <div className={styles.solutionDetails}>
      <ul>
        <li>ID: {solution.id}</li>
        <li>Created: {solution.createdAt.toLocaleString()}</li>
        <li>Solved: {solution.isSolutionValid ? "✅" : "❌"} </li>
        {solution.isTestData && <li>Uses test data</li>}
        {solution.isAocData && <li>Uses live data</li>}
        <li>
          <Link href={`${solution.url}/input`}>Input</Link>
        </li>
      </ul>
    </div>
  );
}
