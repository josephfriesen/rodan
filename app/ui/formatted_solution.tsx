import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";
import "@styles/markdown.css";

interface FormattedSolutionProps {
  markdown: string;
  markdownProps?: object;
}

export default function FormattedSolution({
  markdown,
  ...rest
}: FormattedSolutionProps) {
  return (
    <div className="explanationPreview">
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        {...rest}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
