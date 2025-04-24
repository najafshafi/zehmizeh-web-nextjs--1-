/*
 * This component serves the General Inquiry Form
 */

import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { Form, FormLabel } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomUploader from "@/components/ui/CustomUploader";
import { StyledButton } from "@/components/forms/Buttons";
import ErrorMessage from "@/components/ui/ErrorMessage";
import useResponsive from "@/helpers/hooks/useResponsive";
import { validateGeneralInquiryForm } from "@/helpers/validation/common";
import { getPlainText, getYupErrors } from "@/helpers/utils/misc";
import { postGeneralInquiry } from "@/helpers/http/dispute";

type CKEditorInstance = {
  editing: {
    view: {
      change: (callback: (writer: any) => void) => void;
      document: {
        getRoot: () => any;
      };
    };
  };
  getData: () => string;
};

const GeneralInquiryForm = () => {
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<{
    subject: boolean;
    description: boolean;
  }>({
    subject: false,
    description: false,
  });

  const [attachments, setAttachments] = useState<
    {
      fileName?: string;
      fileUrl: string;
    }[]
  >([]);

  const handleUploadImage = (
    file: Partial<{ file: string; fileName: string; fileUrl: string }>
  ) => {
    /* This function will save the file uploaded url */
    if (file.file) {
      setAttachments([
        {
          fileName: file.fileName,
          fileUrl: file.file,
        },
      ]);
    }
  };

  const removeAttachment = () => {
    // This will remove all attachments
    setAttachments([]);
  };

  const validate = (onlyValidate = false) => {
    /* This function will validate the form */

    const formState = {
      subject,
      description,
    };

    validateGeneralInquiryForm.isValid(formState).then((valid) => {
      if (!valid) {
        validateGeneralInquiryForm
          .validate(formState, { abortEarly: false })
          .catch((err) => {
            const errors = getYupErrors(err);
            if (!onlyValidate) setTouched({ description: true, subject: true });
            setErrors({ ...errors });
          });
      } else {
        setErrors({});
        if (!onlyValidate) submitGeneralInquiry();
      }
    });
  };

  useEffect(() => {
    validate(true);
  }, [description, subject]);

  const submitGeneralInquiry = () => {
    /* This function will submit the inquiry form */
    if (wordCount > 2000) {
      toast.error("Character maximum is 2000.");
      return;
    }

    const body: {
      subject: string;
      description: string;
      attachment_file?: string;
    } = {
      subject,
      description,
    };

    if (attachments?.length > 0) {
      body.attachment_file = `${attachments[0].fileUrl}#docname=${attachments[0].fileName}`;
    }

    /* An api call to submit general inquiry */
    const promise = postGeneralInquiry(body);

    setLoading(true);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        setSubject("");
        setDescription("");
        setAttachments([]);
        setTouched({ description: false, subject: false });
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.message || "error";
      },
    });
  };

  const wordCount = useMemo(() => {
    return description ? getPlainText(description).length : 0;
  }, [description]);

  return (
    <div className="bg-white p-6 rounded-[1.25rem] shadow-[0_4px_74px_rgba(0,0,0,0.04)] md:p-8">
      <h4 className="text-center mb-3">Submit Inquiry</h4>
      {/* Subject input */}
      <label className="text-base font-normal">
        This page is for submitting questions about any topic to the ZehMizeh
        staff. You can also see if your question is already answered in our Help
        Center by checking the yellow icon in the bottom-right corner.
      </label>
      <div className="mt-4">
        <FormLabel className="text-base font-normal">
          Subject<span className="mandatory">&nbsp;*</span>
        </FormLabel>
        <Form.Control
          placeholder="Enter subject"
          className="rounded-[7px] p-4 px-5"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={100}
        />
        {touched?.subject && errors?.subject && (
          <ErrorMessage message={errors?.subject} />
        )}
      </div>

      {/* Description - CK Editor */}
      <div className="mt-4">
        <FormLabel className="text-base font-normal">
          Description<span className="mandatory">&nbsp;*</span>
        </FormLabel>
        <CKEditor
          editor={ClassicEditor}
          data={description}
          config={{
            toolbar: ["bold", "italic", "numberedList", "bulletedList"],
          }}
          onReady={(editor: CKEditorInstance) => {
            editor.editing.view.change((writer: any) => {
              writer.setStyle(
                "max-height",
                "200px",
                editor.editing.view.document.getRoot()
              );
            });
          }}
          onChange={(event: any, editor: CKEditorInstance) => {
            const data = editor.getData();
            setDescription(data);
          }}
        />

        {wordCount > 2000 ? (
          <div className="text-danger">Character maximum is 2000.</div>
        ) : null}

        {touched?.description && errors?.description && (
          <ErrorMessage message={errors?.description} />
        )}
      </div>

      {/* File Uploader */}
      <div className="mt-4">
        <CustomUploader
          handleUploadImage={handleUploadImage}
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      </div>

      {/* Submit button */}
      <div className="mt-4 flex justify-end">
        <StyledButton
          variant="primary"
          padding="0.875rem 1.875rem"
          onClick={() => validate()}
          disabled={loading}
          className={isMobile ? "w-100" : undefined}
        >
          Submit
        </StyledButton>
      </div>
    </div>
  );
};

export default GeneralInquiryForm;
