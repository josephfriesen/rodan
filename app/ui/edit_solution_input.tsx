import React from 'react';
import styles from '@styles/aoc.module.scss';

export default function EditSolutionInput({
  inputValue,
  handleSubmit,
}: {
  inputValue: string;
  handleSubmit: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  const [solutionInputFormValue, setSolutionInputFormValue]: [
    string,
    React.Dispatch<React.SetStateAction<string>>,
  ] = React.useState(inputValue);

  return (
    <textarea
      className={styles.solutionInput}
      value={inputValue}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setSolutionInputFormValue(e.target.value)
      }
    />
  );
}
