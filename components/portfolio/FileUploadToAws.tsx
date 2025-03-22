import axios from "axios";
import { generateAwsUrl } from "@/helpers/http/common";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { CONSTANTS } from "@/helpers/const/constants";
import toast from "react-hot-toast";
import Image from "next/image";

interface FileUploadToAwsProps {
  onFileUpload: (uploads: { fileUrl: string; fileName: string }[]) => void;
  attachments?: { fileUrl?: string; fileName?: string }[];
}

const FileUploadToAws = ({
  onFileUpload,
  attachments,
}: FileUploadToAwsProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = async (file: File | File[]) => {
    try {
      const files: File[] = Array.isArray(file) ? file : [file];

      if (loading) return;

      const numberOfFiles = files.length;
      if ((attachments?.length ?? 0) + numberOfFiles > 25) {
        toast.error("You can upload only 25 files");
        return;
      }

      const exceededSizeLimit = files.some((file) => {
        const fileSize = file.size / 1024 / 1024;
        return fileSize > CONSTANTS.FILE_SIZE[30];
      });

      if (exceededSizeLimit) {
        toast.error(`File size must not exceed ${CONSTANTS.FILE_SIZE[30]}MB.`);
        return;
      }

      setLoading(true);

      const filesUrls = await Promise.all(
        files.map(async (file) => {
          try {
            const response = await generateAwsUrl({
              folder: "job-documents",
              file_name: file.name,
              content_type: file.type,
            });
            const { uploadURL } = response;
            return { uploadURL, contentType: file.type, file };
          } catch (error) {
            console.error("Error generating AWS URL:", error);
            toast.error("Failed to generate upload URL");
            return null;
          }
        })
      );

      const validFilesUrls = filesUrls.filter(
        (item): item is NonNullable<typeof item> => item !== null
      );

      const uploadedFilesUrls = await Promise.all(
        validFilesUrls.map(async (uploadFile) => {
          try {
            const res = await axios.put(uploadFile.uploadURL, uploadFile.file, {
              headers: { "Content-Type": uploadFile.contentType },
            });

            if (res.status === 200) {
              const url = uploadFile.uploadURL.split("?")[0];
              return {
                fileUrl: url,
                fileName: uploadFile.file.name,
              };
            }
            return null;
          } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload file");
            return null;
          }
        })
      );

      const validUploadedFiles = uploadedFilesUrls.filter(
        (file): file is { fileUrl: string; fileName: string } => file !== null
      );

      if (validUploadedFiles.length > 0) {
        onFileUpload(validUploadedFiles);
      }
    } catch (error) {
      console.error("Error in file upload process:", error);
      toast.error("An error occurred while uploading files");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100px] h-[100px] bg-white text-gray-800 rounded-lg border-2 border-dashed border-gray-800 transition-all duration-200 hover:border-gray-600">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={CONSTANTS.PORTFOLIO_ATTACHMENT_SUPPORTED_TYPES}
        multiple
        classes="h-full w-full flex items-center justify-center cursor-pointer"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        ) : (
          <div className="relative w-6 h-6">
            <Image
              src="/icons/plus-yellow.svg"
              alt="Add file"
              fill
              className="object-contain"
            />
          </div>
        )}
      </FileUploader>
    </div>
  );
};

export default FileUploadToAws;
