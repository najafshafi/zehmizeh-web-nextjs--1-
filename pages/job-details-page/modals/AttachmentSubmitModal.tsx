import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import CustomUploader from "@/components/ui/CustomUploader";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import { deleteFileFromStorage } from "@/helpers/http/common";
import { CONSTANTS } from "@/helpers/const/constants";

export interface FileAttachment {
  fileUrl: string;
  fileName: string;
}

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: (file: FileAttachment[]) => void;
  loading: boolean;
  postedWork?: string;
};

const AttachmentSubmitModal = ({
  show,
  toggle,
  onConfirm,
  loading,
  postedWork,
}: Props) => {
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [existingWork, setExistingWork] = useState<FileAttachment[]>([]);
  const [uploadLimit] = useState<number>(5);

  const handleUploadImage = ({
    file,
    fileName,
  }: {
    file: string;
    fileName?: string;
  }) => {
    setAttachments([...attachments, { fileUrl: file, fileName }]);
  };

  const removeAttachment = (removeIndex: number, fileUrl?: string) => {
    const allAttachments = [...attachments].filter(
      (_, index: number) => index !== removeIndex
    );
    setAttachments(allAttachments);
    if (fileUrl) deleteFileFromStorage(fileUrl);
  };

  const onSend = () => {
    onConfirm([...existingWork, ...attachments]);
  };

  const onDelete = (fileUrl: string) => {
    setExistingWork(existingWork.filter(({ fileUrl: url }) => url !== fileUrl));
  };

  const postedWorkHandler = (images: string) => {
    if (images.length === 0) return null;
    const files: FileAttachment[] = images.split(",").map((file) => {
      const [fileUrl, fileName] = file.split("#docname=");
      return { fileUrl, fileName };
    });
    setExistingWork(files);
  };

  const handler = () => {
    if (postedWork.length <= 0) return null;
    postedWorkHandler(postedWork);
  };

  useEffect(() => {
    handler();
  }, [postedWork]);

  return (
    <StyledModal maxwidth={570} show={show} size="sm" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>

        {existingWork.length ? (
          <>
            <div className="fs-20 font-normal text-start mb-3">
              Completed Work on this Milestone
            </div>
            {!!existingWork.length && (
              <div className="d-flex align-items-center gap-4 flex-wrap my-3">
                {existingWork.map((file, index: number) => (
                  <div key={`milestone-${index}`}>
                    <AttachmentPreview
                      uploadedFile={file.fileUrl}
                      removable={true}
                      onDelete={() => onDelete(file.fileUrl)}
                      shouldShowFileNameAndExtension={false}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <></>
        )}

        <div className={existingWork.length ? "mt-5" : "mt-0"}>
          <div className="fs-20 font-normal text-start mb-3">
            Click below to upload work for this milestone
          </div>
          <div className="fs-20 font-normal text-start">
            <CustomUploader
              limit={uploadLimit}
              handleUploadImage={handleUploadImage}
              attachments={attachments}
              removeAttachment={removeAttachment}
              placeholder="Attach doc"
              totalUploaded={existingWork.length}
              acceptedFormats={[
                ...CONSTANTS.DEFAULT_ATTACHMENT_SUPPORTED_TYPES,
                "audio/*",
                "video/*",
              ].join(", ")}
              suggestions="File type: PDF, DOC, DOCX, XLS, XLSX, Image Files, Audio Files, Video Files"
              shouldShowFileNameAndExtension={false}
            />
          </div>
        </div>

        <div className="d-flex justify-content-md-end justify-content-center mt-4">
          <StyledButton
            className="fs-16 font-normal"
            variant="primary"
            padding="0.8125rem 2rem"
            onClick={onSend}
            disabled={loading}
          >
            Submit Work
          </StyledButton>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default AttachmentSubmitModal;
