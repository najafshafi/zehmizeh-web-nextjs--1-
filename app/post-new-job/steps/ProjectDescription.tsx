"use client";

import { Form } from "react-bootstrap";
import { FormLabel, FormLabelSubText, PostForm } from "../postJob.styled";
import { usePostJobContext } from "../context";
import { REGEX } from "@/helpers/const/regex";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useRef, useState } from "react";
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

export const ProjectDescription = () => {
  useWebSpellChecker();

  const { isIpadProOnlyMaxWidth } = useResponsive();
  const { formData, setFormData, errors, setIsImageUploading } =
    usePostJobContext();
  const ckeditorRef = useRef(null);

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
  const onReady = (editor) => {
    editor.editing.view.change((writer) => {
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
      ...formData.attachments,
      ...files.map(({ file, fileName }) => `${file}#docname=${fileName}`),
    ];
    setFormData({ attachments: attachmentsUrls });
  };

  const removeAttachment = (index: number) => {
    const attachmentsUrls = [...formData.attachments];
    attachmentsUrls.splice(index, 1);
    setFormData({ attachments: attachmentsUrls });
  };
  /* END ------------------------------------------- Functions */

  const ProjectTitleTips = seeMore === "TITLE" && (
    <div className={classNames({ tips: !isIpadProOnlyMaxWidth })}>
      <ul className="mt-2">
        {CONSTANTS.JOB_TITLE_EXAMPLES.map((jobTitleExample) => (
          <li key={jobTitleExample}>
            <FormLabelSubText>{jobTitleExample}</FormLabelSubText>
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
      <span className="fs-16 fw-bold">
        For an effective project post, answer these questions:
      </span>

      <div className="mt-2">
        {CONSTANTS.JOB_DESCRIPTION_QUESTION_ANSWER.map(
          ({ answer, question }) => (
            <FormLabelSubText key={question}>
              <b>{question}</b>
              <p>{answer}</p>
            </FormLabelSubText>
          )
        )}
      </div>
    </div>
  );

  return (
    <PostForm>
      <div className="d-flex-column">
        {/* START ----------------------------------------- Project title */}
        <div className="form-group">
          {/* Showing on side for desktop */}
          {!isIpadProOnlyMaxWidth && ProjectTitleTips}
          <FormLabel>
            Project Title<span className="mandatory">&nbsp;*</span>
          </FormLabel>
          <FormLabelSubText>
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
          </FormLabelSubText>
          <Form.Control
            id={CONSTANTS.WEB_SPELL_CHECKER_DOM_ID}
            className="mt-2"
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
            className={classNames("mb-0 mt-2 text-end", {
              "text-danger":
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
        <div className="form-group">
          {/* Showing on side for desktop */}
          {!isIpadProOnlyMaxWidth && ProjectDescriptionTips}
          <FormLabel className="mb-2">
            Project Description<span className="mandatory">&nbsp;*</span>
          </FormLabel>
          <FormLabelSubText className="mb-2">
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
          </FormLabelSubText>
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
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData({ job_description: data });
                const plainText = getPlainText(data);
                countHandler(plainText);
              }}
            />
          </div>
          <div className="mt-2 d-flex justify-content-between">
            <span>
              {errors?.job_description && (
                <ErrorMessage message={errors.job_description} />
              )}
            </span>
            <p
              className={classNames("mb-0", {
                "text-danger":
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
        <div className="form-group">
          <FormLabel className="mb-2">Related Files (Optional)</FormLabel>
          <FormLabelSubText className="mb-2">
            If you can make the project easier to understand by attaching files,
            and you’re comfortable sharing those files with all of our
            freelancers, you can attach them here.
          </FormLabelSubText>
          <div className="mt-2">
            <CustomUploader
              multiple
              handleMultipleUploadImage={handleUploadImage}
              attachments={formData.attachments.map((url) =>
                getFileNameAndFileUrlFromAttachmentUrl(url)
              )}
              removeAttachment={removeAttachment}
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
    </PostForm>
  );
};
