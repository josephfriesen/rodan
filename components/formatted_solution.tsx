import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface FormattedSolutionProps {
  markdown: string;
}

export default function FormattedSolution({ markdown }: FormattedSolutionProps) {
  return (
    <Markdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      children={markdown}
    />
  );
}