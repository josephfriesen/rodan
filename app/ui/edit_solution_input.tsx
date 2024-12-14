"use client";

import React from "react";
import LinkButton from "app/ui/link_button";
import clsx from "clsx";
import styles from "@styles/aoc.module.scss";

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
      <textarea
        className={clsx(
          "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          styles.solutionInput,
        )}
        rows={18}
        value={solutionInputFormValue}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setSolutionInputFormValue(e.target.value)
        }
      />
      <div className={styles.formActions}>
        <LinkButton clickCallback={() => handleSubmit(solutionInputFormValue)}>
          Update Input
        </LinkButton>
      </div>
    </div>
  );
}
