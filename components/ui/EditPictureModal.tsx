/*
 * This component is a modal to edit skills
 */

import { useEffect, useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import toast from "react-hot-toast";
import { generateAwsUrl } from "@/helpers/http/common";
import useResponsive from "@/helpers/hooks/useResponsive";
import LoadingButtons from "@/components/LoadingButtons";
import { VscClose } from "react-icons/vsc";
import Image from "next/image";

interface Props {
  show: boolean;
  onClose: () => void;
  onUpdate?: (url: string) => void;
  profilePic?: string;
}

const EditPictureModal = ({ show, onClose, onUpdate, profilePic }: Props) => {
  const { isMobile } = useResponsive();
  const [loadingImage, setLoadingImage] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(
    profilePic || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const cropperRef = useRef<Cropper | null>(null);

  // Add effect to manage body scrolling
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure body scrolling is restored when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  useEffect(() => {
    if (show) {
      setCurrentImage(profilePic || null);
      setSelectedFile(null);
      setUploading(false);
    }
  }, [profilePic, selectedFile, show]);

  const onLoaded = () => {
    setLoadingImage(false);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    let files: FileList | null = null;

    if ("dataTransfer" in e) {
      files = e.dataTransfer.files;
    } else if (e.target instanceof HTMLInputElement) {
      files = e.target.files;
    }

    if (files && files[0]) {
      setSelectedFile(files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  function getRoundedCanvas(sourceCanvas: HTMLCanvasElement) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get canvas context");
    }

    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = "destination-in";
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    return canvas;
  }

  const validateFile = async () => {
    if (!cropperRef.current) {
      toast.error("Please wait for the image to load");
      return;
    }

    if (selectedFile) {
      const fileSize = selectedFile.size / 1024 / 1024;
      const fileName = selectedFile.name;
      const extension = selectedFile.type?.replace(/(.*)\//g, "");

      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (fileSize > 100) {
        toast.error("File size cannot exceed 100MB.");
        return;
      } else if (!allowedExtensions.exec(fileName)) {
        toast.error(`.${extension} file type is not supported.`);
        return;
      } else {
        uploadFileToSerever(fileName, extension);
      }
    } else {
      uploadFileToSerever("profile.png", "png");
    }
  };

  const uploadFileToSerever = async (fileName: string, extension: string) => {
    if (!cropperRef.current) {
      toast.error("Please wait for the image to load");
      return;
    }

    try {
      setUploading(true);

      const croppedCanvas = cropperRef.current.getCroppedCanvas();
      if (!croppedCanvas) {
        throw new Error("Failed to get cropped canvas");
      }

      const roundedCanvas = getRoundedCanvas(croppedCanvas);
      const dataUrl = await roundedCanvas.toDataURL();
      const base64Data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");

      const file = await dataUrlToFileUsingFetch(
        "data:image/jpeg;base64," + base64Data,
        fileName,
        `image/${extension}`
      );

      const res = await generateAwsUrl({
        folder: "job-documents",
        file_name: file.name,
        content_type: file.type,
      });

      const { uploadURL } = res;
      const contentType = file.type;

      await axios.put(uploadURL, file, {
        headers: { "Content-Type": contentType },
      });

      const uploadedUrl = uploadURL.split("?")[0];
      onUpdate?.(uploadedUrl);
      onClose();
    } catch (err) {
      console.error("Error uploading image:", err);
      setUploading(false);
      toast.error("Error uploading image. Please try again.");
    }
  };

  const dataUrlToFileUsingFetch = async (
    url: string,
    fileName: string,
    mimeType: string
  ) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new File([buffer], fileName, { type: mimeType });
  };

  if (!show) return null;

  return (

    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-[678px] max-h-[90vh] py-[2rem] px-[1rem] md:py-[3.20rem] md:px-12 relative">
          {/* Close Button */}
          <VscClose
            className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
            onClick={onClose}
          />

          <div className="content flex flex-col">
            <h2 className="text-[#212529] text-[1.75rem] font-normal text-left mb-8">

              Edit Profile Picture
            </h2>
          </div>

          <div className="cropper flex flex-col justify-center items-center mt-5 mb-3">
            {loadingImage && (
              <div className="spinner absolute m-auto">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}

            {!currentImage && (
              <div className="relative h-[400px] w-[400px]">
                <Image
                  src="/images/default_avatar.png"
                  alt="default-avatar"
                  fill
                  width={400}
                  height={400}
                  className="object-cover rounded-full"
                />
              </div>
            )}

            {currentImage && (
              <Cropper
                style={{ height: 400, width: 400, borderRadius: "50%" }}
                initialAspectRatio={1}
                preview=".img-preview"
                src={currentImage}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                  cropperRef.current = instance;
                  setLoadingImage(true);
                  setTimeout(() => {
                    instance.zoomTo(0);
                  }, 0);
                }}
                aspectRatio={1}
                guides={true}
                ready={onLoaded}
              />
            )}

            <div className="flex flex-wrap mt-5 gap-3">
              <button
                className={`relative inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-[0.85rem] text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isMobile ? "w-full" : ""
                }`}
                disabled={uploading}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={onChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </button>

              {currentImage && (
                <button
                  className={`inline-flex items-center justify-center rounded-full bg-[#F7B500] px-8 py-[0.85rem] text-lg font-medium text-[#1d1e1b] hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-[#F7B500] focus:ring-offset-2 ${
                    isMobile ? "w-full" : ""
                  }`}
                  onClick={validateFile}
                  disabled={uploading}
                >
                  Save {uploading && <LoadingButtons />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPictureModal;
