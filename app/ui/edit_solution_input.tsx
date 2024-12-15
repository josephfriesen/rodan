"use client";

import React from "react";
import LinkButton from "app/ui/link_button";
import styles from "@styles/aoc.module.scss";
import Editor from "@monaco-editor/react";

/**
 * TODO: replace textarea with codemirror editor with line numbers
 */
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

  return (
    <div className={styles.solutionInputForm}>
      <div className={styles.editorContainer}>
        <Editor
          height="50vh"
          defaultLanguage="plaintext"
          defaultValue={inputValue}
          className={styles.editor}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily:
              "Inconsolata Nerd Font, SF Mono, Segoe UI Mono, Roboto Mono, Menlo, Courier, monospace",
          }}
          onChange={(value, _) => {
            setSolutionInputFormValue(value || "");
          }}
        />
      </div>
      <div className={styles.formActions}>
        <LinkButton clickCallback={() => handleSubmit(solutionInputFormValue)}>
          Update Input
        </LinkButton>
      </div>
    </div>
  );
}
