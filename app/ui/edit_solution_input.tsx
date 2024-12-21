"use client";

import React from "react";
import styles from "@styles/aoc.module.scss";
import Editor from "@monaco-editor/react";
import { Button } from "@components/ui/button";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

export default function EditSolutionInput({
  inputValue,
  handleSubmit,
}: {
  inputValue: string;
  handleSubmit: (newInput: string) => void;
}) {
  const [solutionInputFormValue, setSolutionInputFormValue]: [
    string,
    React.Dispatch<React.SetStateAction<string>>,
  ] = React.useState(inputValue);
  const [loading, setLoading]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = React.useState(false);

  const submitNewInput = async (): Promise<void> => {
    setLoading(true);

    await handleSubmit(solutionInputFormValue);
    setLoading(false);
  };

  const { theme } = useTheme();

  const editorTheme = React.useMemo(() => {
    if (theme === "dark") {
      return "vs-dark";
    }
    return "light";
  }, [theme]);

  return (
    <section className={styles.solutionInput}>
      <div className={styles.solutionInputForm}>
        <div className={styles.editorContainer}>
          <div className={styles.wrapper}>
            <Editor
              height="50vh"
              width="60vw"
              defaultLanguage="plaintext"
              defaultValue={inputValue}
              value={solutionInputFormValue}
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
                setSolutionInputFormValue(value || "");
              }}
            />
          </div>
        </div>
        <div className={styles.formActions}>
          <Button variant="outline" onClick={submitNewInput}>
            Update Input
            {loading && (
              <Loader2
                className="animate-spin ml-2"
                size={16}
                strokeWidth={2}
              />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
