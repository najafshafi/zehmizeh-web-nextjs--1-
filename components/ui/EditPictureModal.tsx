/*
 * This component is a modal to edit skills
 */

import { Modal, Button, Spinner } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import styled from "styled-components";
import { StyledButton } from "@/components/forms/Buttons";
import axios from "axios";
import toast from "react-hot-toast";
import { generateAwsUrl } from "@/helpers/http/common";
import useResponsive from "@/helpers/hooks/useResponsive";
import LoadingButtons from "@/components/LoadingButtons";
import UploadIcon from "../../public/icons/upload.svg";

const Wrapper = styled.div`
  .upload-btn {
    position: relative;
    svg {
      stroke: #000;
    }
  }
  .upload-btn:hover {
    svg {
      stroke: #fff;
    }
  }
  input[type="file"] {
    position: absolute;
    z-index: 2;
    opacity: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
  }
  .cropper-view-box {
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
  .cropper-face {
    background-color: inherit !important;
  }
  .cropper {
    position: relative;
  }
  .spinner {
    position: absolute;
    margin: auto;
  }
`;

type Props = {
  show: boolean;
  onClose: () => void;
  onUpdate?: (url: string) => void;
  profilePic?: string;
};

const EditPictureModal = ({ show, onClose, onUpdate, profilePic }: Props) => {
  const { isMobile } = useResponsive();
  const [loadingImage, setLoadingImage] = useState(false);
  const [currentImage, setCurrentImage] = useState<any>(profilePic);
  const [cropper, setCropper] = useState<any>();
  const [selectedFile, setSelectedFile] = useState<any>();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (show) {
      setCurrentImage(profilePic);
      setSelectedFile(null);
      setUploading(false);
    }
  }, [profilePic, selectedFile, show]);

  const onLoaded = () => {
    setLoadingImage(false);
  };

  // const handleFileRead = useCallback((event) => {
  //   const content = event.target.result;
  //   setCurrentImage(content);
  // }, []);

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    setSelectedFile(files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImage(reader.result);
      setCurrentImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  function getRoundedCanvas(sourceCanvas) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
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
    setUploading(true);

    const roundedCanvas = getRoundedCanvas(cropper.getCroppedCanvas());
    const dataUrl = await roundedCanvas.toDataURL();
    const base64Data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");

    /** This will create the file from the base64 data of the cropper canvas */
    const file = await dataUrlToFileUsingFetch(
      "data:image/jpeg;base64," + base64Data,
      fileName,
      `image/${extension}`
    );

    generateAwsUrl({
      folder: "job-documents",
      file_name: file.name,
      content_type: file.type,
    }).then((res) => {
      const { uploadURL } = res;
      const contentType = file.type;

      /* This will upload the selected file to the above path */
      axios
        .put(uploadURL, file, {
          headers: { "Content-Type": contentType },
        })
        .then(() => {
          const uploadedUrl = uploadURL.split("?")[0];

          onUpdate(uploadedUrl);
        })
        .catch(() => {
          setUploading(false);
          toast.error("Error uploading image.");
        });
    });
  };

  const dataUrlToFileUsingFetch = async (url, fileName, mimeType) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    return new File([buffer], fileName, { type: mimeType });
  };

  return (
    <StyledModal maxwidth={678} show={show} size="sm" onHide={onClose} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>
        <Wrapper>
          <div className="content flex flex-col">
            <div className="modal-title fs-28 font-normal">
              Edit Profile Picture
            </div>
          </div>

          <div className="cropper flex flex-col justify-center items-center mt-5 mb-3">
            {loadingImage && (
              <Spinner animation="grow" className="spinner mb-3" />
            )}
            {!currentImage && (
              <img
                src="/images/default_avatar.png"
                alt="default-avatar"
                height="400px"
                width="400px"
              />
            )}
            {currentImage && (
              <Cropper
                style={{ height: 400, width: 400, borderRadius: "50%" }}
                zoomTo={0}
                initialAspectRatio={1}
                preview=".img-preview"
                src={currentImage}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                onInitialized={(instance) => {
                  setCropper(instance);
                  setLoadingImage(true);
                }}
                aspectRatio={1}
                guides={true}
                ready={onLoaded}
              />
            )}

            <div className="flex flex-wrap mt-5 gap-3">
              <StyledButton
                variant="outline-dark"
                className={isMobile ? "upload-btn w-100" : "upload-btn"}
                disabled={uploading}
              >
                <UploadIcon className="me-2" />
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={onChange}
                  className="pointer"
                />
              </StyledButton>
              {currentImage && (
                <StyledButton
                  className={isMobile ? "w-100" : null}
                  onClick={validateFile}
                  disabled={uploading}
                >
                  Save {uploading && <LoadingButtons />}
                </StyledButton>
              )}
            </div>
          </div>
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default EditPictureModal;
