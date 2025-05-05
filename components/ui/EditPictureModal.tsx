/*
 * This component is a modal to edit skills
 */

"use client";

import { useEffect, useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import toast from "react-hot-toast";
import { generateAwsUrl } from "@/helpers/http/common";
import useResponsive from "@/helpers/hooks/useResponsive";

import { VscClose } from "react-icons/vsc";
import Image from "next/image";
import CustomButton from "../custombutton/CustomButton";

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
  const cropperRef = useRef<ReactCropperElement>(null);

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

  useEffect(() => {
    if (show) {
      setCurrentImage(profilePic || null);
      setSelectedFile(null);
      setUploading(false);
    }
  }, [profilePic, show]);

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
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
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
      }
    }

    await uploadFileToSerever();
  };

  const uploadFileToSerever = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      toast.error("Please wait for the image to load");
      return;
    }

    try {
      setUploading(true);

      const croppedCanvas = cropper.getCroppedCanvas({
        width: 400,
        height: 400,
        minWidth: 256,
        minHeight: 256,
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: "#fff",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (!croppedCanvas) {
        throw new Error("Failed to get cropped canvas");
      }

      const roundedCanvas = getRoundedCanvas(croppedCanvas);
      const dataUrl = roundedCanvas.toDataURL("image/jpeg", 0.9);
      const base64Data = dataUrl.replace(
        /^data:image\/(png|jpg|jpeg);base64,/,
        ""
      );

      const file = await dataUrlToFileUsingFetch(
        dataUrl,
        selectedFile?.name || "profile.jpg",
        "image/jpeg"
      );

      const res = await generateAwsUrl({
        folder: "profile-pictures",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl w-full max-w-[678px] max-h-[90vh] overflow-y-auto p-8 mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <VscClose className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Edit Profile Picture
        </h2>

        <div className="flex flex-col items-center space-y-6">
          {/* Image Preview Container */}
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gray-100 rounded-full overflow-hidden">
            {loadingImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            )}

            {!currentImage ? (
              <Image
                src="/images/default_avatar.png"
                alt="Default avatar"
                fill
                className="object-cover"
              />
            ) : (
              <Cropper
                ref={cropperRef}
                src={currentImage}
                style={{ height: "100%", width: "100%" }}
                aspectRatio={1}
                viewMode={1}
                dragMode="move"
                background={false}
                responsive
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
                cropBoxMovable={true}
                cropBoxResizable={true}
                toggleDragModeOnDblclick={false}
                onInitialized={() => {
                  setLoadingImage(true);
                }}
                ready={onLoaded}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center w-full">
            <button
              className={`relative flex items-center px-6 py-2.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isMobile ? "w-full" : ""
              }`}
              disabled={uploading}
            >
              <svg
                className="w-5 h-5 mr-2"
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
              <CustomButton
                text="Save"
                className={`px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] ${
                  isMobile ? "w-full" : ""
                }`}
                onClick={validateFile}
                disabled={uploading}
                showSpinner={uploading}
                spinnerPosition="right"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPictureModal;
