'use client';

import styles from '@styles/aoc.module.scss';

export default function LinkButton({
  children,
  clickCallback,
}: {
  children: React.ReactNode;
  clickCallback: () => void;
}): JSX.Element {
  return (
    <button className={styles.linkButton} onClick={clickCallback}>
      {children}
    </button>
  );
}
