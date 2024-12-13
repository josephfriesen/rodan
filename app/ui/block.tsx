import styles from '../styles/aoc.module.scss';

interface BlockProps {
  children: string;
}

export const Block = ({ children }: BlockProps) => {
  return <pre className={styles.block}>{children.trim()}</pre>;
};

export const Inline = ({ children }: BlockProps) => {
  return <code className={styles.code}>{children.trim()}</code>;
};

export default Block;
