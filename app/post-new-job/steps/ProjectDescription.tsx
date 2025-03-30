"use client";

import { useEffect, useRef, useState } from "react";
import { REGEX } from "@/helpers/const/regex";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CONSTANTS } from "@/helpers/const/constants";
import {
  getFileNameAndFileUrlFromAttachmentUrl,
  getPlainText,
} from "@/helpers/utils/misc";
import { FooterButtons } from "../partials/FooterButtons";
import { SeeMore } from "@/components/ui/SeeMore";
import CustomUploader, {
  TCustomUploaderFile,
} from "@/components/ui/CustomUploader";
import classNames from "classnames";
import useResponsive from "@/helpers/hooks/useResponsive";
import { useWebSpellChecker } from "@/helpers/hooks/useWebSpellChecker";
import { usePostJobContext } from "../context";

// Writer type for CKEditor
interface Writer {
  setStyle: (name: string, value: string, element: unknown) => void;
}

// Editor type for CKEditor
interface Editor {
  ui: {
    view: {
      editable: {
        element: {
          style: {
            borderColor: string;
          };
        };
      };
    };
  };
  editing: {
    view: {
      change: (callback: (writer: Writer) => void) => void;
      document: {
        getRoot: () => unknown;
      };
    };
  };
  getData: () => string;
  setData: (data: string) => void;
}

export const ProjectDescription = () => {
  useWebSpellChecker();

  const { isIpadProOnlyMaxWidth } = useResponsive();
  const { formData, setFormData, errors, setIsImageUploading } =
    usePostJobContext();
  const ckeditorRef = useRef<{ editor: Editor } | null>(null);

  /* START ----------------------------------------- React states */
  const [characters, setCharacters] = useState(0);
  const [borderColor, setBorderColor] = useState("black");
  const [seeMore, setSeeMore] = useState<"TITLE" | "DESCRIPTION" | "">("");
  /* END ------------------------------------------- React states */

  useEffect(() => {
    if (formData?.job_description) {
      setCharacters(getPlainText(formData.job_description).length);
    }
  }, [formData.job_description]);

  /* START ----------------------------------------- Functions */
  const changeBorderColor = (color: string) => {
    if (ckeditorRef && ckeditorRef.current && ckeditorRef.current.editor) {
      ckeditorRef.current.editor.ui.view.editable.element.style.borderColor =
        color;
      setBorderColor(color);
    }
  };

  const countHandler = (text: string) => {
    setCharacters(text.length);
    if (text.length > CONSTANTS.POST_JOB_DESCRIPTION_MAX_CHARACTERS) {
      if (borderColor === "black") {
        changeBorderColor("red");
      }
    } else {
      if (borderColor === "red") {
        changeBorderColor("black");
      }
    }
  };

  /** @function This will set the editor height to 150px */
  const onReady = (editor: Editor) => {
    editor.editing.view.change((writer: Writer) => {
      writer.setStyle(
        "height",
        "150px",
        editor.editing.view.document.getRoot()
      );
    });

    /** This is basically for the edit state, to prefill the editor value */
    if (formData?.job_description) {
      editor.setData(formData.job_description);
    }
  };

  const handleUploadImage = (files: TCustomUploaderFile[]) => {
    const attachmentsUrls = [
      ...(formData.attachments || []),
      ...files.map(({ file, fileName }) => `${file}#docname=${fileName}`),
    ];
    setFormData({ attachments: attachmentsUrls });
  };

  const removeAttachment = (index: number) => {
    const attachmentsUrls = [...(formData.attachments || [])];
    attachmentsUrls.splice(index, 1);
    setFormData({ attachments: attachmentsUrls });
  };
  /* END ------------------------------------------- Functions */

  const ProjectTitleTips = seeMore === "TITLE" && (
    <div className={classNames({ tips: !isIpadProOnlyMaxWidth })}>
      <ul className="mt-2">
        {CONSTANTS.JOB_TITLE_EXAMPLES.map((jobTitleExample) => (
          <li key={jobTitleExample}>
            <span className="text-sm text-gray-600">{jobTitleExample}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const ProjectDescriptionTips = seeMore === "DESCRIPTION" && (
    <div
      className={classNames({
        tips: !isIpadProOnlyMaxWidth,
        "mt-3": isIpadProOnlyMaxWidth,
      })}
    >
      <span className="text-base font-bold">
        For an effective project post, answer these questions:
      </span>

      <div className="mt-2">
        {CONSTANTS.JOB_DESCRIPTION_QUESTION_ANSWER.map(
          ({ answer, question }) => (
            <div key={question} className="text-sm text-gray-600">
              <b>{question}</b>
              <p>{answer}</p>
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col w-full">
        {/* START ----------------------------------------- Project title */}
        <div className="mb-6">
          {/* Showing on side for desktop */}
          {!isIpadProOnlyMaxWidth && ProjectTitleTips}

          <label className="block text-base font-bold mb-1 text-left">
            Project Title<span className="text-red-500">&nbsp;*</span>
          </label>
          <p className="text-sm text-gray-600 text-left">
            Choose a clear, precise title.{" "}
            <SeeMore
              $fontSize="0.9rem"
              onClick={() =>
                setSeeMore((prev) => (prev === "TITLE" ? "" : "TITLE"))
              }
            >
              {seeMore === "TITLE" ? "Hide" : "See"} Examples.
            </SeeMore>
            {/* Show below subtext for mobile screens */}
            {isIpadProOnlyMaxWidth && ProjectTitleTips}
          </p>
          <input
            id={CONSTANTS.WEB_SPELL_CHECKER_DOM_ID}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Project Title"
            value={formData.job_title}
            maxLength={CONSTANTS.POST_JOB_TITLE_MAX_CHARACTERS}
            onChange={(e) => {
              setFormData({
                job_title: e.target.value.replace(REGEX.TITLE, ""),
              });
            }}
          />
          <p
            className={classNames("mt-2 text-right text-sm", {
              "text-red-500":
                (formData?.job_title?.length || 0) >
                CONSTANTS.POST_JOB_TITLE_MAX_CHARACTERS,
            })}
          >
            {formData?.job_title?.length || 0}/
            {CONSTANTS.POST_JOB_TITLE_MAX_CHARACTERS} characters
          </p>
          {errors?.job_title && <ErrorMessage message={errors.job_title} />}
        </div>
        {/* END ------------------------------------------- Project title */}

        {/* START ----------------------------------------- Project description */}
        <div className="mb-6">
          {/* Showing on side for desktop */}
          {!isIpadProOnlyMaxWidth && ProjectDescriptionTips}
          <label className="block text-base font-bold mb-2 text-left">
            Project Description<span className="text-red-500">&nbsp;*</span>
          </label>
          <span className="block text-sm text-gray-600 mb-2 text-left">
            This is the MOST important part of the post! The more details you
            provide here, the more likely you are to get precise price quotes
            and find the right freelancer for your project.{" "}
            <SeeMore
              $fontSize="0.9rem"
              onClick={() =>
                setSeeMore((prev) =>
                  prev === "DESCRIPTION" ? "" : "DESCRIPTION"
                )
              }
            >
              {seeMore === "DESCRIPTION" ? "Hide" : "See"} tips.
            </SeeMore>
          </span>
          {/* Show below subtext for mobile screens */}
          {isIpadProOnlyMaxWidth && ProjectDescriptionTips}
          <div className="mt-2">
            <CKEditor
              editor={ClassicEditor}
              data={formData.job_description}
              ref={ckeditorRef}
              config={{
                toolbar: ["bold", "italic", "numberedList", "bulletedList"],
                placeholder: CONSTANTS.ckEditorPlaceholder,
              }}
              onReady={onReady}
              onChange={(_event: unknown, editor: Editor) => {
                const data = editor.getData();
                setFormData({ job_description: data });
                const plainText = getPlainText(data);
                countHandler(plainText);
              }}
            />
          </div>
          <div className="mt-2 flex justify-between">
            <span>
              {errors?.job_description && (
                <ErrorMessage message={errors.job_description} />
              )}
            </span>
            <p
              className={classNames("text-sm", {
                "text-red-500":
                  characters > CONSTANTS.POST_JOB_DESCRIPTION_MAX_CHARACTERS,
              })}
            >
              {characters}/{CONSTANTS.POST_JOB_DESCRIPTION_MAX_CHARACTERS}{" "}
              characters
            </p>
          </div>
        </div>
        {/* END ------------------------------------------- Project description */}

        {/* START ----------------------------------------- Attachments */}
        <div className="mb-6">
          <label className="block text-base font-bold mb-2 text-left">
            Related Files (Optional)
          </label>
          <span className="block text-sm text-gray-600 mb-2 text-left">
            If you can make the project easier to understand by attaching files,
            and you&apos;re comfortable sharing those files with all of our
            freelancers, you can attach them here.
          </span>
          <div className="mt-2">
            <CustomUploader
              multiple
              handleMultipleUploadImage={handleUploadImage}
              attachments={(formData.attachments || []).map((url) =>
                getFileNameAndFileUrlFromAttachmentUrl(url)
              )}
              removeAttachment={(index) => {
                if (typeof index === "number") {
                  removeAttachment(index);
                }
              }}
              limit={CONSTANTS.ATTACHMENTS_LIMIT}
              acceptedFormats={[
                ...CONSTANTS.DEFAULT_ATTACHMENT_SUPPORTED_TYPES,
                "audio/*",
                "video/*",
              ].join(", ")}
              suggestions="File type: PDF, DOC, DOCX, XLS, XLSX, Image Files, Audio Files, Video Files"
              shouldShowFileNameAndExtension={false}
              imageUploadingListener={(value) => {
                setIsImageUploading(value);
              }}
            />
          </div>
        </div>
        {/* END ------------------------------------------- Attachments */}
      </div>
      <FooterButtons />
    </div>
  );
};
