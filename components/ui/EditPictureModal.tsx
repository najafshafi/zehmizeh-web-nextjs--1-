/*
 * This component is a modal to edit skills
 */

import { useEffect, useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import axios from "axios";
import toast from "react-hot-toast";
import { generateAwsUrl } from "@/helpers/http/common";
import useResponsive from "@/helpers/hooks/useResponsive";
import LoadingButtons from "@/components/LoadingButtons";
import UploadIcon from "@/public/icons/upload.svg";
import { VscClose } from "react-icons/vsc";

type Props = {
  show: boolean;
  onClose: () => void;
  onUpdate?: (url: string) => void;
  profilePic?: string;
};

const EditPictureModal = ({ show, onClose, onUpdate, profilePic }: Props) => {
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const editorRef = useRef<AvatarEditor | null>(null);

  // Reset state when modal is opened
  useEffect(() => {
    if (show) {
      setCurrentImage(profilePic || null);
      setSelectedFile(null);
      setUploading(false);
      setZoom(1);
    }
  }, [show, profilePic]);

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

  // Load profile image
  useEffect(() => {
    if (profilePic) {
      setLoading(true);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = profilePic;
      img.onload = () => {
        setCurrentImage(profilePic);
        setLoading(false);
      };
      img.onerror = () => {
        console.error("Could not load image with CORS enabled");
        setCurrentImage(null);
        setLoading(false);
        toast.error(
          "Unable to load the existing profile image. Please upload a new one."
        );
      };
    }
  }, [profilePic]);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    const file = files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImage(reader.result as string);
      setLoading(false);
    };
    reader.onerror = () => {
      toast.error("Error reading file");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const validateFile = async () => {
    if (!editorRef.current) {
      toast.error("Editor not loaded");
      return;
    }

    try {
      if (selectedFile) {
        const fileSize = selectedFile.size / 1024 / 1024;
        const fileName = selectedFile.name;
        const extension = selectedFile.type?.replace(/(.*)\//g, "") || "";

        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        if (fileSize > 100) {
          toast.error("File size cannot exceed 100MB.");
          return;
        } else if (!allowedExtensions.exec(fileName)) {
          toast.error(`.${extension} file type is not supported.`);
          return;
        } else {
          await uploadImage(fileName, extension);
        }
      } else if (currentImage) {
        await uploadImage("profile.png", "png");
      }
    } catch (error) {
      console.error("Error in validation:", error);
      toast.error("Error processing the image. Please try again.");
    }
  };

  const uploadImage = async (fileName: string, extension: string) => {
    if (!editorRef.current) {
      toast.error("Editor not loaded");
      return;
    }

    setUploading(true);

    try {
      // Get canvas from the editor
      const canvas = editorRef.current.getImageScaledToCanvas();

      // Try to get the image data safely
      let dataUrl;
      try {
        // Try the standard method first
        dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      } catch (error) {
        console.error("CORS error when getting image data:", error);

        // Fallback: Get the image directly from the editor
        const imageData = editorRef.current.getImage();
        if (!imageData) {
          throw new Error("Failed to get image data");
        }

        // Create a blob from the image data
        return await handleImageWithBlobFallback(
          imageData,
          fileName,
          extension
        );
      }

      if (!dataUrl) {
        throw new Error("Failed to get image data");
      }

      // Convert to data URL
      const base64Data = dataUrl.replace(
        /^data:image\/(png|jpg|jpeg);base64,/,
        ""
      );

      // Create a file from the data URL
      const file = await dataUrlToFile(
        "data:image/jpeg;base64," + base64Data,
        fileName,
        `image/${extension}`
      );

      await uploadFileToAWS(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
      toast.error(
        "Error uploading image. Please try again with a different image."
      );
    }
  };

  // Fallback method using Blob instead of canvas
  const handleImageWithBlobFallback = async (
    imageData: HTMLImageElement | HTMLCanvasElement,
    fileName: string,
    extension: string
  ) => {
    try {
      // Create a temporary canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Set dimensions
      canvas.width = imageData.width;
      canvas.height = imageData.height;

      // Draw to canvas
      ctx.drawImage(imageData, 0, 0, imageData.width, imageData.height);

      // Get blob instead of data URL
      const blobPromise = new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg",
          0.9
        );
      });

      const blob = await blobPromise;
      const file = new File([blob], fileName, { type: `image/${extension}` });

      // Upload the file
      await uploadFileToAWS(file);
    } catch (error) {
      console.error("Error in blob fallback:", error);
      throw error;
    }
  };

  // Separate function for AWS upload to avoid code duplication
  const uploadFileToAWS = async (file: File) => {
    // Generate AWS upload URL
    const res = await generateAwsUrl({
      folder: "job-documents",
      file_name: file.name,
      content_type: file.type,
    });

    const { uploadURL } = res;
    const contentType = file.type;

    // Upload to AWS
    await axios.put(uploadURL, file, {
      headers: { "Content-Type": contentType },
    });

    // Return the uploaded URL
    const uploadedUrl = uploadURL.split("?")[0];
    if (onUpdate) {
      onUpdate(uploadedUrl);
    }

    setUploading(false);
    onClose();
  };

  const dataUrlToFile = async (
    url: string,
    fileName: string,
    mimeType: string
  ) => {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return new File([buffer], fileName, { type: mimeType });
    } catch (error) {
      console.error("Error converting data URL to file:", error);
      throw new Error("Failed to process the image data");
    }
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
        <div className="bg-white rounded-xl w-full max-w-[678px] max-h-[90vh] py-8 px-4 md:py-12 md:px-12 relative">
          {/* Close Button */}
          <button
            className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
            onClick={onClose}
          >
            <VscClose />
          </button>

          <div className="flex flex-col">
            <h2 className="text-[#212529] text-[1.75rem] font-normal text-left mb-8">
              Edit Profile Picture
            </h2>
          </div>

          <div className="flex flex-col justify-center items-center mt-5 mb-3">
            {loading && (
              <div className="absolute flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}

            {!currentImage && !loading && (
              <img
                src="/images/default_avatar.png"
                alt="default-avatar"
                className="h-[250px] w-[250px] rounded-full"
              />
            )}

            {currentImage && (
              <div className="mx-auto">
                <AvatarEditor
                  ref={editorRef}
                  image={currentImage}
                  width={250}
                  height={250}
                  border={25}
                  borderRadius={125}
                  color={[255, 255, 255, 0.6]}
                  scale={zoom}
                  rotate={0}
                  crossOrigin="anonymous"
                />

                <div className="mt-4 flex flex-col items-center gap-2.5">
                  <div className="w-full max-w-[300px] flex items-center gap-2.5">
                    <span className="min-w-[80px] text-left">Zoom:</span>
                    <input
                      type="range"
                      className="w-full"
                      min="1"
                      max="3"
                      step="0.01"
                      value={zoom}
                      onChange={handleZoomChange}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap mt-5 gap-3">
              <button
                className={`relative inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-[0.85rem] text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isMobile ? "w-full" : ""
                }`}
                disabled={uploading}
              >
                <UploadIcon className="mr-2" />
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={onChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </button>

              {currentImage && (
                <button
                  className={`inline-flex items-center justify-center rounded-full bg-[#F7B500] px-8 py-[0.85rem] text-lg font-medium text-[#1d1e1b] hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-[#F7B500] focus:ring-offset-2 ${
                    isMobile ? "w-full" : ""
                  }`}
                  onClick={validateFile}
                  disabled={uploading || loading}
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
