import axios from 'axios';
import styled from 'styled-components';
import { generateAwsUrl } from '@/helpers/http/common';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { transition } from '@/styles/transitions';
import PlusIcon from "../../public/icons/plus-yellow.svg";
import { Spinner } from 'react-bootstrap';
import { showErr } from '@/helpers/utils/misc';
import { CONSTANTS } from '@/helpers/const/constants';

const Wrapper = styled.div`
  width: 100px;
  height: 100px;
  background: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.gray8};
  border-radius: 0.5rem;
  border: 1.5px dashed ${(props) => props.theme.colors.gray8};
  ${() => transition()}
  .upload-layout {
    height: 100%;
    width: 100%;
  }
`;

const FileUploadToAws = ({
  onFileUpload,
  attachments,
}: {
  onFileUpload: (uploads: { fileUrl: string; fileName: string }[]) => void;
  attachments?: { fileUrl?: string; fileName?: string }[];
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = async (file: any) => {
    const files: File[] = Array.from(file);

    if (loading) return;

    const numberOfFiles = Object.values(files)?.length;
    if ((attachments?.length ?? 0) + numberOfFiles > 25) {
      showErr('You can upload only 25 files');
      return;
    }
    const exceededSizeLimit =
      files.findIndex((file) => {
        const fileSize = file.size / 1024 / 1024;
        return fileSize > CONSTANTS.FILE_SIZE[30];
      }) >= 0;
    if (exceededSizeLimit) {
      showErr(`File size must not exceed ${CONSTANTS.FILE_SIZE[30]}MB.`);
      return;
    }

    setLoading(true);

    const filesUrls = await Promise.all(
      Object.values(files).map(async (file: any) => {
        const response = await generateAwsUrl({
          folder: 'job-documents',
          file_name: file.name,
          content_type: file.type,
        });
        const { uploadURL } = response;

        return { uploadURL, contentType: file.type, file };
      })
    );

    const uploadedFilesUrls = await Promise.all(
      filesUrls.map(async (uploadFile: any) => {
        const res = await axios.put(uploadFile.uploadURL, uploadFile.file, {
          headers: { 'Content-Type': uploadFile.contentType },
        });

        if (res.status === 200) {
          const url = uploadFile.uploadURL.split('?')[0];
          const uploadedFile = {
            fileUrl: url,
            fileName: uploadFile.file.name,
          };

          return uploadedFile;
        }
      })
    );

    // console.log(JSON.stringify(uploadedFilesUrls));
    onFileUpload(uploadedFilesUrls.filter((file): file is { fileUrl: string; fileName: string } => file !== undefined));

    setLoading(false);
  };

  return (
    <Wrapper className="d-flex align-items-center justify-content-center pointer">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={CONSTANTS.PORTFOLIO_ATTACHMENT_SUPPORTED_TYPES}
        multiple
        classes="upload-layout d-flex align-items-center justify-content-center pointer"
      >
        {loading ? <Spinner animation="border" /> : <PlusIcon />}
      </FileUploader>
    </Wrapper>
  );
};
export default FileUploadToAws;
