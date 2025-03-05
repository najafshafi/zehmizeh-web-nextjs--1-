import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

type Props = {
  value: string;
  placeholder?: string;
  onChange: (data: string) => void;
  maxChars: number;
};

const TextEditor = ({ placeholder, value, onChange, maxChars }: Props) => {
  const [characters, setCharacters] = useState(0);
  const [borderColor, setBorderColor] = useState("border-gray-300");

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setCharacters(text.length);

      if (text.length > maxChars) {
        if (borderColor === "border-gray-300") {
          setBorderColor("border-red-500");
        }
      } else {
        if (borderColor === "border-red-500") {
          setBorderColor("border-gray-300");
        }
      }

      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose p-2 ${borderColor}`,
        placeholder: placeholder || "",
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div>
      <div>
        <EditorContent editor={editor} />
      </div>
      <div className="mt-2 flex justify-end">
        <p className={characters <= maxChars ? "text-gray-700" : "text-red-500"}>
          {characters}/{maxChars} characters
        </p>
      </div>
    </div>
  );
};

export default TextEditor;