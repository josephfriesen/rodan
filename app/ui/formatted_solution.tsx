import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface FormattedSolutionProps {
  markdown: string;
  markdownProps?: object;
}

export default function FormattedSolution({
  markdown,
  ...rest
}: FormattedSolutionProps) {
  return (
    <Markdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      {...rest}
    >
      {markdown}
    </Markdown>
  );
}
