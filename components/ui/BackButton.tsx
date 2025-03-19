// "use client"; // Required for Next.js client components

// import { useRouter } from "next/navigation";
// import BackArrow from "../../public/icons/back-arrow.svg";
// import { goBack } from "@/helpers/utils/goBack";
// import Image from "next/image";

// type Props = {
//   className?: string;
//   children?: React.ReactNode;
//   onBack?: () => void;
//   route?: string;
// };

// const BackButton = ({ className, children, onBack, route }: Props) => {
//   const router = useRouter(); // Use Next.js navigation instead of useNavigate

//   const handleGoBack = () => {
//     if (onBack) {
//       onBack();
//     } else {
//       goBack(router, route);
//     }
//   };

//   return (
//     <div className={`${className || ""} flex`}>
//       <div
//         className="flex back-button flex items-center pointer"
//         onClick={handleGoBack}
//       >
//         <Image src={BackArrow} alt="Back" width={24} height={24} />
//          &nbsp;<span className="fs-18 font-normal">Back</span>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default BackButton;

"use client"; // Required for Next.js client components

import { useRouter } from "next/navigation";
import Image from "next/image";
import BackArrow from "../../public/icons/back-arrow.svg";

type Props = {
  className?: string;
  children?: React.ReactNode;
  onBack?: () => void;
  route?: string;
};

const BackButton = ({ className, children, onBack, route }: Props) => {
  const router = useRouter(); // Use Next.js navigation

  const handleGoBack = () => {
    if (onBack) {
      onBack(); // Call custom onBack function if provided
    } else if (route) {
      router.push(route); // Navigate to the specified route
    } else {
      router.back(); // Go back in history
    }
  };

  return (
    <div className={`${className || ""} flex`}>
      <div
        className="flex gap-1 back-button items-center cursor-pointer"
        onClick={handleGoBack}
      >
        <BackArrow />
        <span className="text-lg font-normal">Back</span>
        {children}
      </div>
    </div>
  );
};

export default BackButton;
