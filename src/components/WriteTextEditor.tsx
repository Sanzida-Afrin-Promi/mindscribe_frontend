import React from "react";
import ReactMarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css"; 
import MarkdownIt from "markdown-it"; 

interface WriteTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const WriteTextEditor: React.FC<WriteTextEditorProps> = ({ value, onChange }) => {
  const mdParser = new MarkdownIt();

  const renderMarkdown = (text: string) => {
    return mdParser.render(text);
  };

  return (
    <div className="mb-6">
      <label htmlFor="description" className="block text-xl font-medium mb-2">
        Description
      </label>
      <div className="h-[500px] overflow-y-auto">
        <ReactMarkdownEditor
          value={value}
          onChange={({ text }: { text: string }) => onChange(text)}
          renderHTML={renderMarkdown}
          canView={{
            menu: true,
            md: true,
            html: true,
            both: false,
            fullScreen: false,
            hideMenu: false
          }}
          style={{ height: "400px" }} 
        />
      </div>
    </div>
  );
};

export default WriteTextEditor;
