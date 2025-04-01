import Image from "next/image";
import { useEffect, useState } from "react";

const UploadPreview = ({ url }: any) => {
  const [extenstion, setExtension] = useState("");

  useEffect(() => {
    const ext = url.substr(url.lastIndexOf(".") + 1);
    setExtension(ext);
  }, [url]);

  if (
    extenstion == "jpg" ||
    extenstion == "png" ||
    extenstion == "jpeg" ||
    extenstion == "webp" ||
    extenstion == "avif"
  ) {
    return (
      <Image
        src={url}
        className="upload-preview"
        alt="upload-preview-icon"
        width={100}
        height={100}
      />
    );
  } else if (extenstion == "pdf") {
    return (
      <Image
        src={"/images/pdf.png"}
        className="upload-preview"
        alt="upload-preview-icon"
        width={100}
        height={100}
      />
    );
  } else return null;
};

export default UploadPreview;
