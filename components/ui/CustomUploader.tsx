import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";
import { transition } from "@/styles/transitions";
import ErrorMessage from "./ErrorMessage";
import { generateAwsUrl } from "@/helpers/http/common";
import { showErr } from "@/helpers/utils/misc";
import AttachIcon from "../../public/icons/attach.svg";
import AttachmentPreview from "./AttachmentPreview";
import toast from "react-hot-toast";
import { CONSTANTS } from "@/helpers/const/constants";

export const Wrapper = styled.div`
  color: #444444;
  .file-uploader {
    position: relative;
    border: 1.5px dashed #858585;
    padding: 1.125rem 1.25rem;
    border-radius: 7px;
    line-height: 1.25rem;
    ${() => transition()}
  }
  .uploading {
    opacity: 0.5;
    cursor: not-allowed;
  }
  input[type="file"] {
    display: none;
  }
  .upload-loader {
    position: absolute;
    right: 20px;
  }
  .uploaded-item {
    border-radius: 6px;
    border: ${(props) => `1px solid ${props.theme.colors.primary}`};
    padding: 0.5rem;
    position: relative;
    margin-top: 0.75rem;
    margin: 1rem 1rem 0rem 0rem;
  }
  .upload-preview {
    height: 6.5625rem;
    width: 8.5625rem;
    object-fit: contain;
  }
  .upload-remove-icon {
    position: absolute;
    right: -12px;
    top: -12px;
    border-radius: 100%;
    height: 25px;
    width: 25px;
    text-align: center;
    border: ${(props) => `1px solid ${props.theme.colors.primary}`};
    background: ${(props) => props.theme.colors.white};
  }
`;

export type TCustomUploaderFile = Partial<{
  file: string;
  fileName: string;
  fileUrl: string;
}>;

type Props = {
  attachments: TCustomUploaderFile[];
  handleUploadImage?: (file: TCustomUploaderFile) => void;
  handleMultipleUploadImage?: (files: TCustomUploaderFile[]) => void;
  removeAttachment: (index?: number, fileUrl?: string) => void;
  suggestions?: string;
  placeholder?: string;
  acceptedFormats?: string;
  multiple?: boolean;
  limit?: number;
  totalUploaded?: number;
  shouldShowFileNameAndExtension?: boolean;
  imageUploadingListener?: (value: boolean) => void;
};

const CustomUploader = ({
  handleUploadImage,
  handleMultipleUploadImage,
  attachments,
  removeAttachment,
  suggestions,
  placeholder,
  acceptedFormats = CONSTANTS.DEFAULT_ATTACHMENT_SUPPORTED_TYPES.join(", "),
  multiple = false,
  limit,
  totalUploaded,
  shouldShowFileNameAndExtension = true,
  imageUploadingListener,
}: Props) => {
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  /* START ----------------------------------------- If image is uploading then user can't leave
  1. Listen for is image uploading state and update parent state
  2. beforeUnload event to stop user from closing or refreshing tab
  */
  useEffect(() => {
    imageUploadingListener?.(uploading);
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      if (uploading) {
        e.preventDefault();
        return "Are you sure you want to close?";
      }
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      imageUploadingListener?.(false);
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploading]);
  /* END ------------------------------------------- If image is uploading then user can't leave */

  const isFileValid = (file) => {
    if (!file) return;
    const fileSize = file?.size / 1024 / 1024;
    const extension = file?.type?.replace(/(.*)\//g, "");

    if (fileSize > 100) {
      /* This makes sure that file size is not more than 100mb */

      setError("File size must not exceed 100MB.");
      return false;
    } else if (extension == "svg+xml" || extension == "gif") {
      /* We are accepting images but not gifs and svgs */

      setError(`.${extension} file type is not supported.`);
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    const { uploadURL } = await generateAwsUrl({
      folder: "job-documents",
      file_name: file.name,
      content_type: file.type,
    });

    const contentType = file.type;

    /* This will upload the file on the above path generated */
    await axios.put(uploadURL, file, {
      headers: { "Content-Type": contentType },
    });

    const uploadedUrl = uploadURL.split("?")[0]; // This is the uploaded url
    return {
      file: uploadedUrl,
      fileName: file.name,
    };
  };

  const onChangeMultipleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    let isValid = true;
    let i = 0;
    const files = Array.from(e.target.files);
    while (isValid && i < files.length) {
      const file = files[i];
      isValid = isFileValid(file);
      i++;
    }
    if (!isValid) return;
    if ((limit && attachments.length + files.length > limit) || count >= limit)
      return toast.error("Maximum Attachment Limit Reached");

    try {
      setError("");
      setUploading(true);

      const uploadedFiles = await Promise.all(
        files.map((file) => uploadFile(file))
      );
      handleMultipleUploadImage(uploadedFiles);
      setUploading(false);
    } catch (error) {
      setUploading(false);
      showErr("Error while uploading file.");
    }
  };

  const onChangeSingleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!isFileValid(e.target.files[0])) return;
    if ((limit && attachments.length + 1 > limit) || count >= limit)
      return toast.error("Maximum Attachment Limit Reached");

    /* This will make error empty when proper format file is uploaded */
    try {
      setError("");
      setUploading(true);

      const file = e.target.files[0];
      const uploadedFile = await uploadFile(file);

      handleUploadImage(uploadedFile);
      setUploading(false);
    } catch (error) {
      setUploading(false);
      showErr("Error while uploading file.");
    }
  };

  const UploadCount = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  const count = attachments?.length + (totalUploaded || 0);

  return (
    <Wrapper>
      <label
        className={`file-uploader w-full text-base font-light pointer flex ${
          uploading ? "uploading" : ""
        }`}
        htmlFor="file-upload"
      >
        <AttachIcon className="mx-1" /> &nbsp;
        {placeholder || "Attach file"} (Max size: 100MB)
        {uploading && (
          <div className="upload-loader">
            <Spinner animation="border" size="sm" />
          </div>
        )}
      </label>
      <input
        id="file-upload"
        type="file"
        className="w-100"
        onChange={(e) =>
          multiple ? onChangeMultipleFile(e) : onChangeSingleFile(e)
        }
        disabled={uploading}
        accept={acceptedFormats}
        multiple={multiple}
      />
      <UploadCount>
        <div className="upload-file-types w-full text-base font-light mt-2">
          {suggestions ||
            "File type: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, JPEG"}
        </div>
        {limit && (
          <div
            className="text-base font-light mt-2 ms-2"
            style={{ flex: "none" }}
          >
            {count}/{limit}
          </div>
        )}
      </UploadCount>

      {error && <ErrorMessage message={error} />}
      {attachments?.length > 0 && (
        <div className="uploads-attached flex flex-wrap mt-3 gap-2">
          {attachments.map(({ fileName, fileUrl }, index) => (
            <AttachmentPreview
              uploadedFile={fileUrl}
              fileName={fileName}
              key={fileUrl}
              onDelete={() => removeAttachment(index, fileUrl)}
              shouldShowFileNameAndExtension={shouldShowFileNameAndExtension}
            />
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export default CustomUploader;
