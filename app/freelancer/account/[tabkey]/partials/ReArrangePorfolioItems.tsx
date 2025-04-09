import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "react-hot-toast";
import { addEditPortfolio } from "@/helpers/http/portfolio";
import { VscClose } from "react-icons/vsc";
import Image from "next/image";

interface Portfolio {
  portfolio_id: string;
  project_name: string;
  project_year: string;
  project_description: string;
  project_skills: string[];
  image_urls: string[];
}

interface Props {
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
  portfolio: Portfolio;
  freelancerId: string;
  refetch: () => void;
}

const ReArrangePorfolioItems = ({
  show,
  onClose,
  onUpdate,
  portfolio,
  freelancerId,
  refetch,
}: Props) => {
  const [filesArr, setFilesArr] = useState<string[]>(
    portfolio?.image_urls || []
  );
  const [loading, setLoading] = useState(false);
  const { project_name } = portfolio ?? {};

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

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

  const isPDF = (url: string): boolean => url?.split(".").pop() === "pdf";
  const isVideo = (url: string): boolean => url?.split(".").pop() === "mp4";
  const isAudio = (url: string): boolean =>
    ["mp3", "wav"].includes(url?.split(".").pop() || "");

  const coverImgHandler = (file: string): string => {
    if (isPDF(file)) return "/images/pdf-file.svg";
    if (isVideo(file)) return "/images/video.png";
    if (isAudio(file)) return "/images/audio.png";
    return file;
  };

  const updatedPorfolioHandler = async (portFiles: string[]) => {
    const data = { ...portfolio };
    const body = {
      action: "edit_portfolio",
      portfolio_id: data.portfolio_id,
      project_name: data.project_name,
      project_year: data.project_year,
      project_description: data.project_description,
      project_skills: data.project_skills,
      image_urls: portFiles,
    };

    const promise = addEditPortfolio(body);
    setLoading(true);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.message || "error";
      },
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newFileArr = reorder(
      filesArr,
      result.source.index,
      result.destination.index
    );

    updatedPorfolioHandler(newFileArr);
    setFilesArr(newFileArr);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="rounded-xl bg-white w-full max-w-[678px] max-h-[90vh] py-[2rem] px-[1rem] md:p-11 relative">
          <VscClose
            className="absolute top-4 md:top-0 right-4 lg:-right-8 text-2xl text-black  lg:text-white hover:text-gray-200 cursor-pointer"
            onClick={onClose}
          />

          <div className="content">
            <h2 className="text-[#212529] text-[1.75rem] font-normal text-left mb-8 line-break">
              {project_name}
            </h2>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="droppable"
                direction="horizontal"
                isDropDisabled={loading}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  >
                    {filesArr.map((file, index) => (
                      <Draggable
                        key={`drag-key-${index + 1}`}
                        draggableId={`drag-id-${index + 1}`}
                        index={index}
                        isDragDisabled={loading}
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
                            <div className="relative w-full h-full rounded-lg overflow-hidden">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReArrangePorfolioItems;
