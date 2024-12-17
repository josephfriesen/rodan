"use client";

import React from "react";
import { SolutionType } from "@lib/actions/solutions/types";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Button } from "@components/ui/button";

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
    <Popover>
      <PopoverTrigger>
        <div
          className={clsx(
            "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground p-2",
            "flex items-center justify-center gap-2 whitespace-nowrap rounded-l-md text-sm font-medium",
            "transition-colors text-primary"
          )}
        >
          Solved{" "}
          <span className={clsx("text-xs")}>
            {solution.isSolutionValid ? "✅" : "❌"}
          </span>
        </div>
        <PopoverContent className={clsx("w-auto")}>
          <div className="grid gap-2 py-2 px-2">
            {solution.isSolutionValid && solution.solvedAt && (
              <div
                className={clsx(
                  "flex items-center flex-col space-y-2 italic text-xs text-gray-500 mb-2"
                )}
              >
                <span> Solved at {solution.solvedAt.toLocaleString()}</span>
              </div>
            )}
            <Button
              variant={solution.isSolutionValid ? "destructive" : "default"}
              onClick={handleMarkAsSolved}
              className={clsx(
                "flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors"
              )}
            >
              {solution.isSolutionValid ? "Mark as unsolved" : "Mark as solved"}
            </Button>
          </div>
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  );
}
