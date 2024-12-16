"use client";

import React from "react";
import styles from "@styles/aoc.module.scss";
import Editor from "@monaco-editor/react";
import clsx from "clsx";

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

  const submitNewInput = async (): Promise<void> => {
    handleSubmit(solutionInputFormValue);
  };

  return (
    <section className={styles.solutionInput}>
      <div className={styles.solutionInputForm}>
        <div className={styles.editorContainer}>
          <div className={styles.wrapper}>
            <Editor
              height="50vh"
              defaultLanguage="plaintext"
              defaultValue={inputValue}
              value={solutionInputFormValue}
              className={styles.editor}
              theme="vs-dark"
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
          <button
            className={clsx("btn-primary", styles.actionButton)}
            type="button"
            onClick={submitNewInput}
          >
            Update Input
          </button>
        </div>
      </div>
    </section>
  );
}
