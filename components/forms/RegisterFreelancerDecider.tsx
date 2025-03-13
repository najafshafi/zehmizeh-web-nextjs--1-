"use client";
import Link from "next/link";
import { useState } from "react";
import RegisterFreelancerQuestion from "./RegisterFreelancerQuestion";
import RegisterFreelancerDetails from "./RegisterFreelancerDetails";
import RegisterFreelancerAgreement from "./RegisterFreelancerAgreement";

// Define types for our form data
interface FreelancerQuestionData {
  accountType: string;
}

interface FreelancerDetailsData {
  isAgency: boolean;
  agencyName?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  phone: string;
}

interface FreelancerFormData {
  questionData: FreelancerQuestionData;
  detailsData: FreelancerDetailsData;
}

const RegisterFreelancerDecider = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // State to hold form data from each step
  const [formData, setFormData] = useState<FreelancerFormData>({
    questionData: {
      accountType: "freelancer", // Default value
    },
    detailsData: {
      isAgency: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      state: "",
      phone: "",
    },
  });

  // Functions to update form data
  const updateQuestionData = (data: FreelancerQuestionData) => {
    setFormData({
      ...formData,
      questionData: data,
    });
  };

  const updateDetailsData = (data: FreelancerDetailsData) => {
    setFormData({
      ...formData,
      detailsData: data,
    });
  };

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
        return (
          <RegisterFreelancerQuestion 
            onNext={(data: FreelancerQuestionData) => {
              updateQuestionData(data);
              goToNextPage();
            }}
            initialData={formData.questionData}
          />
        );
      case 2:
        return (
          <RegisterFreelancerDetails
            onNext={(data: FreelancerDetailsData) => {
              updateDetailsData(data);
              goToNextPage();
            }}
            onBack={goToPreviousPage}
            initialData={formData.detailsData}
          />
        );
      case 3:
        return (
          <RegisterFreelancerAgreement
            onNext={(data) => {
              // Handle the final submission with all data
              console.log("Final submission data:", {
                ...formData,
                detailsData: data
              });
              // You can add your API call here
            }}
            onBack={goToPreviousPage}
            detailsData={formData.detailsData}
          />
        );
      default:
        return (
          <RegisterFreelancerQuestion 
            onNext={(data: FreelancerQuestionData) => {
              updateQuestionData(data);
              goToNextPage();
            }}
            initialData={formData.questionData}
          />
        );
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

export default RegisterFreelancerDecider;
