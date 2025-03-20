import React from "react";
import MarkdownIt from "markdown-it"; // Import MarkdownIt for parsing markdown

interface MarkdownRendererProps {
  markdownContent: string;
  content : string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownContent }) => {
  // Initialize MarkdownIt to parse the markdown content
  const mdParser = new MarkdownIt();
  const parsedContent = mdParser.render(markdownContent); // Parse the markdown to HTML

  return (
    <div
      className="text-gray-800 max-h-64 overflow-auto whitespace-pre-line break-words"
      dangerouslySetInnerHTML={{ __html: parsedContent }}
    />
  );
};

export default MarkdownRenderer;
