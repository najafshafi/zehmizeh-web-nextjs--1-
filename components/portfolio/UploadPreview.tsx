import { useEffect, useState } from 'react';

const UploadPreview = ({ url }: any) => {
  const [extenstion, setExtension] = useState('');

  useEffect(() => {
    const ext = url.substr(url.lastIndexOf('.') + 1);
    setExtension(ext);
  }, [url]);

  if (
    extenstion == 'jpg' ||
    extenstion == 'png' ||
    extenstion == 'jpeg' ||
    extenstion == 'webp' ||
    extenstion == 'avif'
  ) {
    return (
      <img src={url} className="upload-preview" alt="upload-preview-icon" />
    );
  } else if (extenstion == 'pdf') {
    return (
      <img
        src={'/images/pdf.png'}
        className="upload-preview"
        alt="upload-preview-icon"
      />
    );
  } else return null;
};

export default UploadPreview;
