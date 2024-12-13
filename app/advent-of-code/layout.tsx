import styles from '@styles/layout.module.sass';
import '@styles/global.css';

export default function AdventOfCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}
