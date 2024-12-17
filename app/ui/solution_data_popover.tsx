"use client";

import React from "react";
import { SolutionType } from "@lib/actions/solutions/types";
import clsx from "clsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Checkbox } from "@components/ui/checkbox";

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
    <Popover>
      <PopoverTrigger>
        <div
          className={clsx(
            "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground p-2",
            "flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
            "transition-colors cursor-pointer text-primary"
          )}
        >
          {isAocChecked && !isTestChecked && "Uses live data"}
          {isTestChecked && !isAocChecked && "Uses test data"}
          {!isAocChecked && !isTestChecked && "No data"}
          {isAocChecked && isTestChecked && "Uses BOTH?!"}
        </div>
        <PopoverContent className={clsx("w-auto")}>
          <button
            className={clsx("mb-4 gap-2 flex flex-row")}
            onClick={() =>
              handleMarkData({
                isAocData: !isAocChecked,
                isTestData: isTestChecked,
              })
            }
          >
            <Checkbox id="isAocData" checked={isAocChecked} />
            <label
              htmlFor="isAocData"
              className={clsx("text-sm font-medium leading-none")}
            >
              Uses live data
            </label>
          </button>
          <button
            type="button"
            className={clsx("flex flex-row gap-2")}
            onClick={() =>
              handleMarkData({
                isAocData: isAocChecked,
                isTestData: !isTestChecked,
              })
            }
          >
            <Checkbox id="isTestData" checked={isTestChecked} />
            <label
              htmlFor="isTestData"
              className={clsx("text-sm font-medium leading-none")}
            >
              Uses test data
            </label>
          </button>
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  );
}
