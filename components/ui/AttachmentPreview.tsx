import styled from 'styled-components';
import { fileIsAnImage } from '@/helpers/utils/misc';
import  CrossIcon from "../../public/icons/cross-icon.svg";
import { useState } from 'react';
import classNames from 'classnames';

const FILE_PATHS = {
  docx: '/images/doc.png',
  pdf: '/images/pdf.png',
  xls: '/images/sheet.png',
  xl: '/images/sheet.png',
  xlsx: '/images/sheet.png',
  xlsb: '/images/sheet.png',
  csv: '/images/sheet.png',
  doc: '/images/doc.png',
  webm: '/images/video.png',
  mp4: '/images/video.png',
  mov: '/images/video.png',
  avi: '/images/video.png',
  mpeg: '/images/video.png',
  mpg: '/images/video.png',
  wmv: '/images/video.png',
  flv: '/images/video.png',
  mkv: '/images/video.png',
  ogg: '/images/video.png',
  ogv: '/images/video.png',
  mp3: '/images/audio.png',
  wav: '/images/audio.png',
};

type Props = {
  fileName?: string;
  onDelete?: () => void;
  uploadedFile?: any;
  removable?: boolean;
  shouldShowFileNameAndExtension?: boolean;
};

const getFileDetails = (file: string) => {
  const attachedName = file.includes('#docname=') ? file.split('#docname=').pop() : '';
  const fileExtension = file.split('.').pop() || 'Doc';
  const fileName = attachedName || file.split('/').pop() || 'File';
  const fileIcon = FILE_PATHS[fileExtension.toLowerCase()] || FILE_PATHS.doc;
  return { fileExtension, fileName, fileIcon };
};

const PreviewWrapper = styled.div`
  border-radius: 0.75rem;
  img {
    border: 1px solid ${(props) => props.theme.colors.gray6};
    border-radius: 0.75rem;
    object-fit: cover;
  }
  .doctype-preview {
    padding: 0.5rem 0rem;
    .file-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .extension {
      color: ${(props) => props.theme.colors.gray8};
    }
    .doctype-preview-details {
      width: 9.5rem;
    }
  }
  .delete-preview {
    top: -5px;
    right: -5px;
    background-color: ${(props) => props.theme.colors.black};
    z-index: 9999;
    height: 25px;
    width: 25px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.colors.white};
  }
  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
  }
`;

const AttachmentPreview = ({
  fileName,
  uploadedFile,
  onDelete,
  removable = true,
  shouldShowFileNameAndExtension = true,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  /** @function This function will download the sample csv file - works across all browsers */
  const downloadSampleFile = () => {
    // const requestOptions = {
    //   method: 'GET',
    //   mode: 'cors',
    //   headers: { Accept: '*' },
    // };

    setIsLoading(true);
    fetch(uploadedFile, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: '*',
        pragma: 'no-cache',
        'cache-control': 'no-cache',
      },
    })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', getFileDetails(uploadedFile)?.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        return Promise.reject({ Error: 'Something Went Wrong', err });
      });
  };

  return (
    <PreviewWrapper
      className={`d-flex attachment-preview position-relative ${isLoading ? 'shimmer-loading' : ''}`}
      title={fileName || getFileDetails(uploadedFile)?.fileName || ''}
    >
      {/* <a href={uploadedFile} target="_blank" rel="noreferrer"> */}
      <div onClick={downloadSampleFile} className={`pointer ${isLoading ? 'opacity-25' : ''}`}>
        {fileIsAnImage(uploadedFile) ? (
          <img src={uploadedFile} alt="uploaded" height="100px" width="100px" />
        ) : (
          <div
            className={classNames('text-center d-flex align-items-center', {
              'doctype-preview': shouldShowFileNameAndExtension,
            })}
          >
            <img
              src={getFileDetails(uploadedFile)?.fileIcon || '/images/pdf.png'}
              alt="uploaded"
              height="100px"
              width="100px"
            />
            {shouldShowFileNameAndExtension && (
              <div className="doctype-preview-details ms-2">
                <div className="file-title text-start text-capitalize fw-500">
                  {fileName || getFileDetails(uploadedFile)?.fileName}
                </div>
                <div className="extension text-start text-uppercase fs-sm">
                  {getFileDetails(uploadedFile)?.fileExtension}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* </a> */}
      {removable && (
        <div
          className="delete-preview position-absolute d-flex align-items-center justify-content-center pointer"
          onClick={onDelete}
          title="Delete attachment"
        >
          <CrossIcon />
        </div>
      )}
    </PreviewWrapper>
  );
};

export default AttachmentPreview;
