import { useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import axios from "axios";
import { generateAwsUrl } from "@/helpers/http/common";
import Image from "next/image";
import React from "react";

const ImageWrapper = styled.div`
  position: relative;
  height: 9.5625rem;
  width: 9.5625rem;
  .profile-pic-img {
    height: 9.5625rem;
    width: 9.5625rem;
    object-fit: cover;
    border-radius: 50%;
  }
  .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 9.5625rem;
    height: 100%;
    background: -webkit-linear-gradient(
      rgba(255, 255, 255, 0) 80%,
      rgba(165, 165, 165, 0.5) 40%
    );
    border-radius: 1000px;
    cursor: pointer;
  }
  .change-text {
    position: absolute;
    z-index: 1;
    bottom: 5px;
    top: 87%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 0.75rem;
  }
  .uploading {
    left: 28%;
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
`;

type Props = {
  imageUrl?: string;
  handleChange: (url: string) => void;
  overlayText?: string;
};

const ImageUploader = ({
  imageUrl,
  handleChange,
  overlayText = "Change",
}: Props) => {
  const [uploading, setUploading] = useState<boolean>(false);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* Uploaded file details */
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const fileSize = e.target.files[0].size / 1024 / 1024;
    const name = e.target.files[0].name;
    const extension = e.target.files[0].type?.replace(/(.*)\//g, "");

    /* Validations */
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (fileSize > 100) {
      toast.error("File size cannot exceed 100MB.");
      return;
    } else if (!allowedExtensions.exec(name)) {
      toast.error(`.${extension} file type is not supported.`);
    } else {
      setUploading(true);
      const file = e.target.files[0];

      /* This will generate a url where the image shoule be uploaded */
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
            handleChange(uploadedUrl);
            setUploading(false);
          })
          .catch(() => {
            setUploading(false);
            toast.error("Error uploading image.");
          });
      });
    }
  };

  return (
    <ImageWrapper>
      <Image
        src={imageUrl || ""}
        className="profile-pic-img"
        alt="uploaded-profile-image"
        width={100}
        height={100}
      />
      {!uploading && (
        <>
          <div className="overlay pointer"></div>
          <div className="change-text fs-sm font-normal pointer">
            {overlayText}
          </div>
        </>
      )}
      <input
        id="file-upload"
        type="file"
        className="w-100 pointer"
        onChange={handleUploadImage}
        disabled={uploading}
        accept="image/*"
      />
      {uploading && (
        <>
          <div className="overlay"></div>
          <div className="change-text uploading fs-sm font-normal">
            Uploading
          </div>
        </>
      )}
    </ImageWrapper>
  );
};

export default ImageUploader;
