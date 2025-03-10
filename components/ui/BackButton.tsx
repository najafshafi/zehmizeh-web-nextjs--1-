"use client"; // Required for Next.js client components

import { useRouter } from "next/navigation";
import BackArrow from "../../public/icons/back-arrow.svg";
import { goBack } from "@/helpers/utils/goBack";
import Image from "next/image";

type Props = {
  className?: string;
  children?: React.ReactNode;
  onBack?: () => void;
  route?: string;
};

const BackButton = ({ className, children, onBack, route }: Props) => {
  const router = useRouter(); // Use Next.js navigation instead of useNavigate

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack(router, route);
    }
  };

  return (
    <div className={`${className || ""} d-flex`}>
      <div
        className="d-flex back-button d-flex align-items-center pointer"
        onClick={handleGoBack}
      >
        <Image src={BackArrow} alt="Back" width={24} height={24} />
         &nbsp;<span className="fs-18 fw-400">Back</span>
        {children}
      </div>
    </div>
  );
};

export default BackButton;
