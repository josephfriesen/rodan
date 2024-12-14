import React from "react";
import LinkButton from "app/ui/link_button";
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
        className={styles.solutionInput}
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
