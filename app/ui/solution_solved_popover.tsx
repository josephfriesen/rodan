"use client";

import React from "react";
import { SolutionType } from "@lib/actions/solutions/types";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import styles from "@styles/aoc.module.scss";
import ClickablePopover from "./clickable_popover";

export default function SolutionSolvedPopover({
  solution,
}: {
  solution: SolutionType;
}) {
  const router = useRouter();

  const handleMarkAsSolved = async (): Promise<void> => {
    const response = await fetch(`/advent-of-code/api/solution`, {
      method: "PATCH",
      body: JSON.stringify({
        id: solution.id,
        payload: {
          isSolutionValid: !solution.isSolutionValid,
        },
      }),
    });

    if (!response.ok) {
      console.error(response);
    } else {
      router.refresh();
    }
  };

  return (
    <React.Fragment>
      <ClickablePopover
        anchorClassName={clsx(
          "italic inline-block cursor-pointer",
          styles.solutionSolvedAnchor
        )}
        popoverClassName={clsx(
          "flex flex-col items-center",
          styles.solutionSolvedPopover
        )}
      >
        <div>
          Solved:{" "}
          <span className="not-italic">
            {solution.isSolutionValid ? "✅" : "❌"}
          </span>
        </div>
        <React.Fragment>
          <div
            className={clsx(
              "flex items-center flex-col space-y-2 italic text-xs text-gray-500 mb-2"
            )}
          >
            {solution.isSolutionValid && solution.solvedAt && (
              <span> Solved at {solution.solvedAt.toLocaleString()}</span>
            )}
          </div>
          <button
            type="button"
            className={clsx("btn", styles.actionButton)}
            onClick={handleMarkAsSolved}
          >
            {solution.isSolutionValid ? "Mark as unsolved" : "Mark as solved"}
          </button>
        </React.Fragment>
      </ClickablePopover>
    </React.Fragment>
  );
}
