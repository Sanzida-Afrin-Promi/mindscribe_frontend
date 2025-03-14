import React from "react";
import ReactMarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css"; // Import the styles for the editor
import MarkdownIt from "markdown-it"; // Import markdown-it for parsing

interface WriteTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const WriteTextEditor: React.FC<WriteTextEditorProps> = ({ value, onChange }) => {
  // Initialize markdown-it instance
  const mdParser = new MarkdownIt();

  // Render HTML from markdown text using markdown-it
  const renderMarkdown = (text: string) => {
    return mdParser.render(text); // Convert markdown text to HTML
  };

  return (
    <div className="mb-6">
      <label htmlFor="description" className="block text-xl font-medium mb-2">
        Description
      </label>
      <div className="h-128 overflow-y-auto">
        <ReactMarkdownEditor
          value={value}
          onChange={({ text }: { text: string }) => onChange(text)}
          renderHTML={renderMarkdown} // Use markdown-it to render HTML
          config={{
            view: { menu: true, md: true, html: true },
            imageUpload: true, // Allow image upload if needed
          }}
        />
      </div>
    </div>
  );
};

export default WriteTextEditor;
