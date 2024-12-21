"use client";

import React from "react";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

export function RunSolution({
  handleRunSolution,
}: {
  handleRunSolution: () => Promise<void>;
}): JSX.Element {
  const [loading, setLoading]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = React.useState(false);
  const letsGetSolution = async (): Promise<void> => {
    setLoading(true);
    handleRunSolution().finally(() => {
      setLoading(false);
    });
  };

  return (
    <Card className={clsx("p-6 h-full")}>
      <Button
        variant="outline"
        onClick={() => {
          letsGetSolution();
        }}
      >
        Run Solution Here. . .
        {loading && (
          <Loader2 className="animate-spin ml-2" size={16} strokeWidth={2} />
        )}
      </Button>
    </Card>
  );
}

export default RunSolution;
