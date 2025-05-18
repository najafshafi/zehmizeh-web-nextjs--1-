"use client";
import Link from "next/link";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import RegisterEmployerAgreement from "./RegisterEmployerAgreement";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for forms
const FormLoading = () => (
  <div className="flex justify-center items-center p-8">
    <Spinner className="w-6 h-6" />
    <p className="ml-2">Loading form...</p>
  </div>
);

// Define types for our form data
interface EmployerQuestionData {
  accountType: string;
}

interface EmployerDetailsData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  phone: string;
  companyName: string;
}

interface EmployerFormData {
  questionData: EmployerQuestionData;
  detailsData: EmployerDetailsData;
}

// Dynamically import components that might use useSearchParams
const DynamicRegisterEmployerQuestion = dynamic(
  () => import("./RegisterEmployerQuestion"),
  { ssr: false, loading: () => <FormLoading /> }
);

const DynamicRegisterEmployerDetails = dynamic(
  () => import("./RegisterEmployerDetails"),
  { ssr: false, loading: () => <FormLoading /> }
);

const RegisterEmployerDecider = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // State to hold form data from each step
  const [formData, setFormData] = useState<EmployerFormData>({
    questionData: {
      accountType: "employer", // Default value
    },
    detailsData: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      state: "",
      phone: "",
      companyName: "",
    },
  });

  // Functions to update form data
  const updateQuestionData = (data: EmployerQuestionData) => {
    setFormData({
      ...formData,
      questionData: data,
    });
  };

  const updateDetailsData = (data: EmployerDetailsData) => {
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
          <Suspense fallback={<FormLoading />}>
            <DynamicRegisterEmployerQuestion
              onNext={(data: EmployerQuestionData) => {
                updateQuestionData(data);
                goToNextPage();
              }}
              initialData={formData.questionData}
            />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<FormLoading />}>
            <DynamicRegisterEmployerDetails
              onNext={(data: EmployerDetailsData) => {
                updateDetailsData(data);
                goToNextPage();
              }}
              onBack={goToPreviousPage}
              initialData={formData.detailsData}
            />
          </Suspense>
        );
      case 3:
        return (
          <Suspense fallback={<FormLoading />}>
            <RegisterEmployerAgreement
              onNext={(data) => {
                // Handle the final submission with all data
                console.log("Final submission data:", {
                  ...formData,
                  detailsData: data,
                });
                // You can add your API call here
              }}
              onBack={goToPreviousPage}
              detailsData={formData.detailsData}
            />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<FormLoading />}>
            <DynamicRegisterEmployerQuestion
              onNext={(data: EmployerQuestionData) => {
                updateQuestionData(data);
                goToNextPage();
              }}
              initialData={formData.questionData}
            />
          </Suspense>
        );
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-[730px] w-full mt-[100px] md:px-0 px-10 h-[110vh]">
      <Link
        href={"/home"}
        className="text-customYellow font-normal text-[16px]"
      >
        Go To Home
      </Link>
      <div className="bg-white rounded-xl py-5 flex flex-col items-center justify-center w-full">
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
