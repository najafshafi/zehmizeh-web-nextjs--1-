"use client"
import { useState, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getPlainText } from "@/helpers/utils/misc";

type Props = {
  value: string;
  placeholder?: string;
  onChange: (data: any) => void;
  maxChars: number;
};

/** @const - config for Editor - Mainly toolbar to be shown in the editor as of now */
const config = {
  toolbar: ["bold", "italic", "numberedList", "bulletedList"],
};

const TextEditor = ({ placeholder, value, onChange, maxChars }: Props) => {
  const [characters, setCharacters] = useState(0);
  const ckeditorRef = useRef<any>(null);
  const [borderColor, setBorderColor] = useState("black");
  const changeBorderColor = (color: string) => {
    if (ckeditorRef && ckeditorRef.current && ckeditorRef.current.editor) {
      ckeditorRef.current.editor.ui.view.editable.element.style.borderColor =
        color;
      setBorderColor(color);
    }
  };

  /** @function This will set the editor height to 150px */
  const onReady = (editor: any) => {
    editor.editing.view.change((writer) => {
      writer.setStyle(
        "height",
        "150px",
        editor.editing.view.document.getRoot()
      );
    });

    /** This is basically for the edit state, to prefill the editor value */
    if (value) {
      editor.setData(value);
    }
  };

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          placeholder: placeholder || "Write here",
          // enterMode: CKEditor.ENTER_BR,
          // shiftEnterMode: CKEditor.ENTER_BR,
          // autoParagraph: false,
          // fillEmptyBlocks: false,
          // breakAfterClose: true,
          // breakBeforeClose: false,
          // breakAfterOpen: false,
          // breakBeforeOpen: true,
          // indent: false,
          removePlugins: [
            "CKFinderUploadAdapter",
            "CKFinder",
            "EasyImage",
            "Image",
            "ImageCaption",
            "ImageStyle",
            "ImageToolbar",
            "ImageUpload",
            "MediaEmbed",
          ],
          ...config,
        }}
        onReady={onReady}
        ref={ckeditorRef}
        onChange={(event, editor) => {
          const html = editor.getData();
          const data = getPlainText(html);
          setCharacters(data.length);
          if (data.length > maxChars) {
            if (borderColor === "black") {
              changeBorderColor("red");
            }
          } else {
            if (borderColor === "red") {
              changeBorderColor("black");
            }
          }
          onChange(html);
        }}
      />
      <div className="mt-2 flex justify-end">
        {characters <= maxChars ? (
          <p>
            {characters}/{maxChars} characters
          </p>
        ) : (
          <p className="text-danger">
            {characters}/{maxChars} characters
          </p>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
