"use client";

import React from "react";
import { SolutionType } from "@lib/actions/solutions/types";
import clsx from "clsx";
import styles from "@styles/aoc.module.scss";
import ClickablePopover from "./clickable_popover";

export default function SolutionDataPopover({
  solution,
}: {
  solution: SolutionType;
}) {
  const [isAocChecked, setIsAocChecked] = React.useState(solution.isAocData);
  const [isTestChecked, setIsTestChecked] = React.useState(solution.isTestData);

  const handleMarkData = async ({
    isAocData = isAocChecked,
    isTestData = isTestChecked,
  }: {
    isAocData: boolean;
    isTestData: boolean;
  }): Promise<void> => {
    await fetch(`/advent-of-code/api/solution`, {
      method: "PATCH",
      body: JSON.stringify({
        id: solution.id,
        payload: {
          isAocData,
          isTestData,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const updatedSolution: SolutionType = res.json;
        setIsAocChecked(updatedSolution.isAocData);
        setIsTestChecked(updatedSolution.isTestData);
      })
      .catch((e) => console.error(e));
  };

  return (
    <React.Fragment>
      <ClickablePopover
        anchorClassName={clsx(
          "italic inline-block cursor-pointer",
          styles.solutionDataAnchor
        )}
        popoverClassName={styles.solutionDataPopover}
      >
        <div>
          {isAocChecked && !isTestChecked && "Uses live data"}
          {isTestChecked && !isAocChecked && "Uses test data"}
          {!isAocChecked && !isTestChecked && "No data"}
          {isAocChecked && isTestChecked && "Uses BOTH?!"}
        </div>
        <div>
          <button
            type="button"
            className={clsx("mb-4", styles.checkboxContainer)}
            onClick={() =>
              handleMarkData({
                isAocData: !isAocChecked,
                isTestData: isTestChecked,
              })
            }
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isAocChecked}
              readOnly
            />
            <span className={styles.betterCheckbox} />
            <label className={clsx("")}>Uses live data</label>
          </button>
          <button
            type="button"
            className={styles.checkboxContainer}
            onClick={() =>
              handleMarkData({
                isAocData: isAocChecked,
                isTestData: !isTestChecked,
              })
            }
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isTestChecked}
              readOnly
            />
            <span className={styles.betterCheckbox} />
            <label className={clsx("")}>Uses test data</label>
          </button>
        </div>
      </ClickablePopover>
    </React.Fragment>
  );
}
