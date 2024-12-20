"use client";

import React from "react";
import styles from "@styles/aoc.module.scss";
import Editor from "@monaco-editor/react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import FormattedSolution from "./formatted_solution";
import { useTheme } from "next-themes";
import clsx from "clsx";

export default function EditSolutionExplanation({
  explanation,
  handleSubmit,
}: {
  explanation: string;
  handleSubmit: (newExplanation: string) => void;
}) {
  const [solutionExplanationFormValue, setSolutionExplanationFormValue]: [
    string,
    React.Dispatch<React.SetStateAction<string>>,
  ] = React.useState(explanation);

  const { theme } = useTheme();

  const editorTheme = React.useMemo(() => {
    if (theme === "dark") {
      return "vs-dark";
    }
    return "light";
  }, [theme]);

  const submitNewExplanation = async (): Promise<void> => {
    handleSubmit(solutionExplanationFormValue);
  };

  return (
    <section className={styles.solutionEditExplanation}>
      <div className={styles.solutionExplanationForm}>
        <div className={styles.editorContainer}>
          <div className={styles.wrapper}>
            <h3 className={styles.explanationTitle}>
              Explanation Markdown Editor
            </h3>
            <Editor
              height="60vh"
              width="768px"
              defaultLanguage="markdown"
              defaultValue={explanation}
              value={solutionExplanationFormValue}
              className={styles.editor}
              theme={editorTheme}
              options={{
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                folding: false,
                fontSize: 14,
                fontFamily:
                  "Inconsolata Nerd Font, SF Mono, Segoe UI Mono, Roboto Mono, Menlo, Courier, monospace",
              }}
              onChange={(value, _) => {
                setSolutionExplanationFormValue(value || "");
              }}
            />
          </div>
          <div className={styles.preview}>
            <h3 className={styles.explanationTitle}>Preview</h3>
            {solutionExplanationFormValue && (
              <Card className={clsx("p-4", styles.explanation)}>
                <FormattedSolution markdown={solutionExplanationFormValue} />
              </Card>
            )}
          </div>
        </div>
      </div>
      <div className={styles.formActions}>
        <Button variant="outline" onClick={submitNewExplanation}>
          Update Explanation
        </Button>
      </div>
    </section>
  );
}
