"use client";
import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import CustomButton from "../custombutton/CustomButton";
import Link from "next/link";

interface FreelancerQuestionData {
  accountType: string;
}

interface RegisterFreelancerQuestionProps {
  onNext: (data: FreelancerQuestionData) => void;
  initialData?: FreelancerQuestionData;
}

// Loading component for Suspense fallback
const QuestionLoading = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-2">Loading registration question...</p>
  </div>
);

// Client component
const RegisterFreelancerQuestionClient: React.FC<
  RegisterFreelancerQuestionProps
> = ({ onNext, initialData = { accountType: "freelancer" } }) => {
  const [accountType, setAccountType] = useState(initialData.accountType);
  const [pathType, setPathType] = useState<string>("");

  // Use effect to get the path from window location
  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split("/");
    const type = pathSegments.length > 2 ? pathSegments[2] : "";
    setPathType(type);
  }, []);

  const clientAccount = () => {
    setAccountType("employer");
    window.location.href = "/register/employer";
  };

  const freelancerAccount = () => {
    setAccountType("freelancer");
    window.location.href = "/register/freelancer";
  };

  const handleNext = () => {
    // Return the account type data to the parent component
    onNext({
      accountType: pathType || "freelancer",
    });
  };

  return (
    <div className="flex flex-col gap-10 md:px-0 px-8  w-full max-w-[600px] sm:mt-0 mt-3 ">
      <div className="flex items-center justify-center">
        <Image
          src={"/zehmizeh-logo.svg"}
          alt={"logo"}
          width={70}
          height={70}
          quality={100}
          loading="lazy"
        />
      </div>

      <p className="font-bold text-[30px] leading-none">
        Welcome! First things first:
      </p>

      <div className="flex flex-col md:mt-4 mt-0 gap-2">
        <p className="text-[24px] xl:pr-4">
          What type of ZehMizeh account would you like to open?
        </p>
        <p className="text-[16px] xl:pr-4">
          If you would like to post projects and hire freelancers, continue with
          a Client account. If you would like to be hired and paid for your
          work, continue with a Freelancer account.
        </p>
        <div className="flex md:flex-row flex-col md:gap-5 gap-2 mt-4">
          <CustomButton
            text="Client - I Want to Hire Freelancers"
            className={`px-3 py-4 rounded-2xl text-black ${
              pathType === "employer"
                ? "border-2 border-black"
                : "border border-gray-300"
            } md:text-[18px] text-[16px]`}
            onClick={clientAccount}
          />
          <CustomButton
            text="Freelancer - I Want to Be Hired"
            className={`px-3 py-4 rounded-2xl text-black ${
              pathType === "employer"
                ? "border border-gray-300"
                : " border-2 border-black"
            } md:text-[18px] text-[16px]`}
            onClick={freelancerAccount}
          />
        </div>
        <p className="md:text-[21px] text-[18px] text-center mt-8">
          Already have an account?{" "}
          <Link href={"/login"} className="text-primary">
            Log in
          </Link>
        </p>
        <div className="mt-3 flex justify-end pb-8">
          <CustomButton
            text="Next"
            className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

// Main component wrapped in Suspense boundary
const RegisterFreelancerQuestion: React.FC<RegisterFreelancerQuestionProps> = (
  props
) => {
  return (
    <Suspense fallback={<QuestionLoading />}>
      <RegisterFreelancerQuestionClient {...props} />
    </Suspense>
  );
};

export default RegisterFreelancerQuestion;
