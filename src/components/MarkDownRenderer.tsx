import React from "react";
import MarkdownIt from "markdown-it"; 
interface MarkdownRendererProps {
  markdownContent: string;
  content : string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownContent }) => {

  const mdParser = new MarkdownIt();
  const parsedContent = mdParser.render(markdownContent); 

  return (
    <div
      className="text-gray-800 max-h-64 overflow-auto whitespace-pre-line break-words"
      dangerouslySetInnerHTML={{ __html: parsedContent }}
    />
  );
};

export default MarkdownRenderer;
