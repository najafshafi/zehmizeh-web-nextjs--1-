import styled from "styled-components";
import { fileIsAnImage } from "@/helpers/utils/misc";
import CrossIcon from "@/public/icons/cross-icon.svg";
import { useState } from "react";
import classNames from "classnames";
import Image from "next/image";

const FILE_PATHS: Record<string, string> = {
  docx: "/images/doc.png",
  pdf: "/images/pdf.png",
  xls: "/images/sheet.png",
  xl: "/images/sheet.png",
  xlsx: "/images/sheet.png",
  xlsb: "/images/sheet.png",
  csv: "/images/sheet.png",
  doc: "/images/doc.png",
  webm: "/images/video.png",
  mp4: "/images/video.png",
  mov: "/images/video.png",
  avi: "/images/video.png",
  mpeg: "/images/video.png",
  mpg: "/images/video.png",
  wmv: "/images/video.png",
  flv: "/images/video.png",
  mkv: "/images/video.png",
  ogg: "/images/video.png",
  ogv: "/images/video.png",
  mp3: "/images/audio.png",
  wav: "/images/audio.png",
};

type Props = {
  fileName?: string;
  onDelete?: () => void;
  uploadedFile?: string;
  removable?: boolean;
  shouldShowFileNameAndExtension?: boolean;
};

const getFileDetails = (file: string) => {
  const attachedName = file.includes("#docname=")
    ? file.split("#docname=").pop()
    : "";
  const fileExtension = file.split(".").pop() || "Doc";
  const fileName = attachedName || file.split("/").pop() || "File";
  const fileIcon = FILE_PATHS[fileExtension.toLowerCase()] || FILE_PATHS.doc;
  return { fileExtension, fileName, fileIcon };
};

const PreviewWrapper = styled.div`
  border-radius: 0.75rem;
  img {
    border: 1px solid ${(props) => props.theme.colors.gray6};
    border-radius: 0.75rem;
    object-fit: cover;
  }
  .doctype-preview {
    padding: 0.5rem 0rem;
    .file-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .extension {
      color: ${(props) => props.theme.colors.gray8};
    }
    .doctype-preview-details {
      width: 9.5rem;
    }
  }
  .delete-preview {
    top: -5px;
    right: -5px;
    background-color: ${(props) => props.theme.colors.black};
    z-index: 9999;
    height: 25px;
    width: 25px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.colors.white};
  }
  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
  }
`;

/** @function This function will download the sample csv file - works across all browsers */
const downloadSampleFile = (
  uploadedFile: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  fetch(uploadedFile, {
    method: "GET",
    mode: "cors",
    headers: {
      Accept: "*",
      pragma: "no-cache",
      "cache-control": "no-cache",
    },
  })
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", getFileDetails(uploadedFile)?.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsLoading(false);
    })
    .catch((err) => {
      setIsLoading(false);
      return Promise.reject({ Error: "Something Went Wrong", err });
    });
};

const AttachmentPreview = ({
  fileName,
  uploadedFile = "",
  onDelete,
  removable = true,
  shouldShowFileNameAndExtension = true,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    if (uploadedFile) {
      downloadSampleFile(uploadedFile, setIsLoading);
    }
  };

  // Get file details only if uploadedFile exists
  const fileDetails = uploadedFile ? getFileDetails(uploadedFile) : null;
  const isImage = uploadedFile ? fileIsAnImage(uploadedFile) : false;

  return (
    <PreviewWrapper
      className={`flex attachment-preview position-relative ${
        isLoading ? "shimmer-loading" : ""
      }`}
      title={fileName || fileDetails?.fileName || ""}
    >
      <div
        onClick={handleDownload}
        className={`cursor-pointer ${isLoading ? "opacity-25" : ""}`}
      >
        {isImage ? (
          <Image
            src={uploadedFile}
            alt="uploaded"
            height={100}
            width={100}
            className="object-cover h-[100px] w-[100px]"
          />
        ) : (
          <div
            className={classNames("text-center flex items-center", {
              "doctype-preview": shouldShowFileNameAndExtension,
            })}
          >
            <Image
              src={fileDetails?.fileIcon || "/images/pdf.png"}
              alt="uploaded"
              height={100}
              width={100}
              className="object-cover h-[100px] w-[100px]"
            />
            {shouldShowFileNameAndExtension && (
              <div className="doctype-preview-details ms-2">
                <div className="file-title text-start capitalize font-medium">
                  {fileName || fileDetails?.fileName || ""}
                </div>
                <div className="extension text-start text-uppercase text-sm">
                  {fileDetails?.fileExtension || ""}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {removable && (
        <div
          className="delete-preview position-absolute flex items-center justify-center cursor-pointer"
          onClick={onDelete}
          title="Delete attachment"
        >
          <CrossIcon />
        </div>
      )}
    </PreviewWrapper>
  );
};

export default AttachmentPreview;
