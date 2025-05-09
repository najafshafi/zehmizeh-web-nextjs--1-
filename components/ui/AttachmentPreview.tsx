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
    <div
      className={`flex rounded-[0.75rem] attachment-preview relative ${
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
            className="object-cover h-[100px] w-[100px] border border-[#d9d9d9] rounded-[0.75rem]"
          />
        ) : (
          <div
            className={classNames("text-center flex items-center", {
              "py-2": shouldShowFileNameAndExtension,
            })}
          >
            <Image
              src={fileDetails?.fileIcon || "/images/pdf.png"}
              alt="uploaded"
              height={100}
              width={100}
              className="object-cover h-[100px] w-[100px] border border-[#d9d9d9] rounded-[0.75rem]"
            />
            {shouldShowFileNameAndExtension && (
              <div className="w-[9.5rem] ms-2">
                <div className="whitespace-nowrap overflow-hidden text-ellipsis text-start capitalize font-medium">
                  {fileName || fileDetails?.fileName || ""}
                </div>
                <div className="text-start uppercase text-sm text-[#858585]">
                  {fileDetails?.fileExtension || ""}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {removable && (
        <div
          className="absolute top-[-5px] right-[-5px] bg-black z-[9999] h-[25px] w-[25px] rounded-full border-2 border-white flex items-center justify-center cursor-pointer"
          onClick={onDelete}
          title="Delete attachment"
        >
          <CrossIcon />
        </div>
      )}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 loader">
          {/* Loader content would go here */}
        </div>
      )}
    </div>
  );
};

export default AttachmentPreview;
