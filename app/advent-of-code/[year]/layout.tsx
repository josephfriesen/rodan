import clsx from "clsx";
import styles from "@styles/aoc.module.scss";
import AOCHeader from "app/ui/aoc_header";
// import "katex/dist/katex.min.css"; // don't import this globally, import in pages where
// we render solution explanations

export default async function AOCYearLayout(props: {
  children: React.ReactNode;
  params: { year: string };
}) {
  const { children } = props;

  return (
    <div className={clsx("advent-of-code-year-layout", styles.container)}>
      <AOCHeader />
      {children}
    </div>
  );
}
