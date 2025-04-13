"use client";

import { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CustomUploader from "@/components/ui/CustomUploader";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import { deleteFileFromStorage } from "@/helpers/http/common";
import { CONSTANTS } from "@/helpers/const/constants";
import { TCustomUploaderFile } from "@/components/ui/CustomUploader";

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

  const handleUploadImage = (file: TCustomUploaderFile) => {
    if (!file.file) return;
    setAttachments([
      ...attachments,
      { fileUrl: file.file, fileName: file.fileName || "" },
    ]);
  };

  const removeAttachment = (index?: number, fileUrl?: string) => {
    if (typeof index !== "number") return;
    const allAttachments = [...attachments].filter(
      (_, i: number) => i !== index
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
    if (!postedWork || postedWork.length <= 0) return null;
    postedWorkHandler(postedWork);
  };

  useEffect(() => {
    handler();
  }, [postedWork]);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggle}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="absolute right-4 top-4">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={toggle}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {existingWork.length > 0 && (
                    <div>
                      <Dialog.Title className="text-xl font-normal text-start mb-3">
                        Completed Work on this Milestone
                      </Dialog.Title>
                      <div className="flex items-center gap-4 flex-wrap my-3">
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
                    </div>
                  )}

                  <div className={existingWork.length > 0 ? "mt-5" : ""}>
                    <Dialog.Title className="text-xl font-normal text-start mb-3">
                      Click below to upload work for this milestone
                    </Dialog.Title>
                    <div>
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

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={onSend}
                      disabled={loading}
                      className="inline-flex justify-center rounded-full bg-amber-500 px-8 py-4 text-base font-normal text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Submitting...
                        </div>
                      ) : (
                        "Submit Work"
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AttachmentSubmitModal;
