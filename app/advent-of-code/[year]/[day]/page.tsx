import FormattedSolution from "@components/formatted_solution";
import utilStyles from "@styles/utils.module.sass";
import clsx from "clsx";

const AOCPage = async (props) => {
  const params = await props.params;
  const { year, day } = params;

  const markdown = `
  markdown
  `

  return (
    <div>
      <h2 className={clsx(utilStyles.headingMd, utilStyles.centered)}>
        <a
          target="_blank"
          href={`https://adventofcode.com/2024/day/${day}`}
          rel="noopener noreferrer"
          className={clsx("text-pink-500")}
        >
          Day {day}
        </a>
      </h2>
      <FormattedSolution markdown={markdown} />
    </div >
  );
};

export default AOCPage;
