"use client"; // Ensure this is a client component
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  coverImgHandler,
  isAudio,
  isPDF,
  isVideo,
} from "@/helpers/utils/coverImgHandler";
import Image from "next/image";
import { VscClose } from "react-icons/vsc";

// const getItems = (count: any) =>
//   Array.from({ length: count }, (v, k) => k).map((k) => ({
//     id: `item-${k}`,
//     content: `item ${k}`,
//   }));

interface Props {
  files: string[];
  onPosChange: (data: string[]) => void;
  allowEdit: boolean;
}

const PortfolioFiles = ({ files, onPosChange, allowEdit }: Props) => {
  const [filesArr, setFilesArr] = useState<string[]>(files);
  const [previewURL, setPreviewURL] = useState<string>();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newFileArr = reorder(
      filesArr,
      result.source.index,
      result.destination.index
    );
    setFilesArr(newFileArr);
    onPosChange(newFileArr);
  };

  const previewHandler = (val: string) => {
    setPreviewURL(val);
    document.body.style.overflow = val ? "hidden" : "unset";
  };

  const reorder = (
    list: string[],
    startIndex: number,
    endIndex: number
  ): string[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {filesArr.map((file, index) => (
                <Draggable
                  key={file}
                  draggableId={file}
                  index={index}
                  isDragDisabled={!allowEdit}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative aspect-square transition-shadow duration-200 ${
                        snapshot.isDragging ? "shadow-lg" : ""
                      }`}
                    >
                      <div
                        className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => previewHandler(file)}
                      >
                        <Image
                          src={coverImgHandler(file)}
                          alt={`Portfolio item ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {!!previewURL && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => previewHandler("")}
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl w-full max-w-[678px] max-h-[90vh] overflow-y-auto py-[2rem] px-[1rem] md:py-[3.20rem] md:px-12">
              <button
                onClick={() => previewHandler("")}
                className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
              >
                <VscClose size={24} />
              </button>

              {isPDF(previewURL) && (
                <iframe
                  src={previewURL}
                  className="w-full h-[80vh] rounded-lg"
                />
              )}

              {isVideo(previewURL) && (
                <video controls src={previewURL} className="w-full rounded-lg">
                  Your browser does not support the video tag.
                </video>
              )}

              {isAudio(previewURL) && (
                <audio controls src={previewURL} className="w-full">
                  Your browser does not support the audio tag.
                </audio>
              )}

              {!isVideo(previewURL) &&
                !isPDF(previewURL) &&
                !isAudio(previewURL) && (
                  <div className="relative aspect-square w-full">
                    <Image
                      src={previewURL}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioFiles;
