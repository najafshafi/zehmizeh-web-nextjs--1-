"use client";
import Link from "next/link";
import { useState } from "react";
import RegisterEmployerQuestion from "./RegisterEmployerQuestion";
import RegisterEmployerDetails from "./RegisterEmployerDetails";
import RegisterEmployerAgreement from "./RegisterEmployerAgreement";

const RegisterEmployerDecider = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // const router = useRouter();

  // const onNextClick = () => {
  //   console.log("SAdsd");
  // };

  const goToNextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return <RegisterEmployerQuestion onNext={goToNextPage} />;
      case 2:
        return (
          <RegisterEmployerDetails
            onNext={goToNextPage}
            onBack={goToPreviousPage}
          />
        );
      case 3:
        return (
          <RegisterEmployerAgreement
            onBack={goToPreviousPage}
            onNext={goToNextPage}
          />
        );
      default:
        return <RegisterEmployerQuestion onNext={goToNextPage} />;
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-[730px] w-full mt-[100px] md:px-0 px-10 h-[110vh]">
      <Link href={"/home"} className="text-customYellow font-normal text-[16px]">
        Go To Home
      </Link>
      <div className="bg-white rounded-xl py-5 flex flex-col  items-center justify-center w-full">
        <div className="flex justify-end w-full pr-6">
          <div className="px-6 py-2 bg-[#FBF5E8] rounded-lg">
            <p className="text-[#F4BA20]">Page: {currentPage}/3</p>
          </div>
        </div>

        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default RegisterEmployerDecider;
