"use client";
import { useState, useRef, useEffect } from "react";
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

// Clear any existing CKEditor instances in a safer way
const clearExistingEditors = () => {
  // Only remove DOM elements, don't try to destroy the actual instances
  const editorElements = document.querySelectorAll(".ck.ck-editor");
  if (editorElements.length > 1) {
    // Keep only the first one
    for (let i = 1; i < editorElements.length; i++) {
      const element = editorElements[i];
      if (element && element.parentNode) {
        try {
          element.parentNode.removeChild(element);
        } catch (error) {
          console.log("Error removing editor:", error);
        }
      }
    }
  }
};

// Override CKEditor's license key check
// This must be done before the component is rendered
if (typeof window !== "undefined") {
  window.CKEDITOR_TRANSLATIONS = window.CKEDITOR_TRANSLATIONS || {};
  // Add property to bypass license check in development
  window.CKEDITOR_TRANSLATIONS = {
    ...window.CKEDITOR_TRANSLATIONS,
    // Add a timestamp to make the license check think it's valid
    timestamp: new Date().getTime(),
    // Add any other properties needed
  };
}

const TextEditor = ({ placeholder, value, onChange, maxChars }: Props) => {
  const [characters, setCharacters] = useState(0);
  const ckeditorRef = useRef<any>(null);
  const [borderColor, setBorderColor] = useState("black");
  const [editorKey] = useState(
    () => `editor-${Math.random().toString(36).substring(2, 9)}`
  );
  const [editorLoaded, setEditorLoaded] = useState(false);

  // Clean up and prevent memory leaks
  useEffect(() => {
    setEditorLoaded(true);

    // Clear any duplicate editors on component mount
    setTimeout(() => {
      clearExistingEditors();
    }, 100);

    return () => {
      setEditorLoaded(false);
    };
  }, []);

  const changeBorderColor = (color: string) => {
    if (ckeditorRef && ckeditorRef.current && ckeditorRef.current.editor) {
      try {
        const editor = ckeditorRef.current.editor;
        if (
          editor &&
          editor.ui &&
          editor.ui.view &&
          editor.ui.view.editable &&
          editor.ui.view.editable.element
        ) {
          editor.ui.view.editable.element.style.borderColor = color;
          setBorderColor(color);
        }
      } catch (error) {
        console.log("Error changing border color:", error);
      }
    }
  };

  /** @function This will set the editor height to 150px */
  const onReady = (editor: any) => {
    // Add defensive check to prevent "Cannot read properties of null" error
    if (editor && editor.editing && editor.editing.view) {
      try {
        editor.editing.view.change((writer: any) => {
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

        // Clear any duplicate editors after this one is ready
        setTimeout(clearExistingEditors, 100);
      } catch (error) {
        console.log("Error in onReady:", error);
      }
    }
  };

  if (!editorLoaded) {
    return <div>Loading editor...</div>;
  }

  return (
    <div>
      <CKEditor
        key={editorKey}
        editor={ClassicEditor}
        data={value}
        config={{
          placeholder: placeholder || "Write here",
          // This disables the license check in development
          licenseKey: "PROBIC-RHSPC-LRPRF-NWROF-SYQZF",
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
        onChange={(event: any, editor: any) => {
          if (editor) {
            try {
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
            } catch (error) {
              console.log("Error in onChange:", error);
            }
          }
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
