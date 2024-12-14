import clsx from "clsx";
import styles from "@styles/layout.module.sass";
import AOCHeader from "app/ui/aoc_header";

export default function AOCDayLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div className={clsx("advent-of-code-layout", styles.container)}>
      <AOCHeader />
      {children}
    </div>
  );
}
