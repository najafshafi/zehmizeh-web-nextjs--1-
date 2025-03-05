"use client";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "../custombutton/CustomButton";
import { useState } from "react";

interface RegisterFreelancerAgreementProps {
  onNext: () => void;
  onBack: () => void;
}

const RegisterFreelancerAgreement: React.FC<RegisterFreelancerAgreementProps> = ({
  onNext,
  onBack,
}) => {
  const [isCheckedFirst, setIsCheckedFirst] = useState(false);
  const [isCheckedSecond, setIsCheckedSecond] = useState(false);
  const [isCheckedThird, setIsCheckedThird] = useState(false);
  const [isCheckedFourth, setIsCheckedFourth] = useState(false);

  return (
    <div className="flex flex-col gap-10 md:px-0 px-8  w-full max-w-[600px] sm:mt-0 mt-3">
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-4">
          <input
            type="checkbox"
            id="terms"
            checked={isCheckedFirst}
            onChange={() => setIsCheckedFirst(!isCheckedFirst)}
            className="w-5 h-5 cursor-pointer"
          />

          <label
            htmlFor="terms"
            className="text-gray-700 text-[16px] cursor-pointer"
          >
            I agree to all of{" "}
            <span className="font-semibold">ZehMizeh&apos;s </span>
            <span className="text-customYellow font-semibold">
              Terms & Conditions.
            </span>
          </label>
        </div>
        <div className="flex flex-row items-center gap-4">
          <input
            type="checkbox"
            id="terms"
            checked={isCheckedSecond}
            onChange={() => setIsCheckedSecond(!isCheckedSecond)}
            className="w-8 h-8 cursor-pointer"
          />

          <label
            htmlFor="terms"
            className="text-gray-700 text-[16px] cursor-pointer"
          >
            I am aware that ZMZ is intended for hiring freelancers to complete
            projects and not as a job portal for hiring permanent employees.
          </label>
        </div>
        <div className="flex flex-row items-center gap-4">
          <input
            type="checkbox"
            id="terms"
            checked={isCheckedThird}
            onChange={() => setIsCheckedThird(!isCheckedThird)}
            className="w-8 h-8 cursor-pointer"
          />

          <label
            htmlFor="terms"
            className="text-gray-700 text-[16px] cursor-pointer"
          >
            I understand that the work on ZMZ{" "}
            <span className="font-semibold">must be deliverable online</span>{" "}
            and that ZMZ does not platform work that would require users to meet
            in person.
          </label>
        </div>
        <div className="flex flex-row items-center gap-4">
          <input
            type="checkbox"
            id="terms"
            checked={isCheckedFourth}
            onChange={() => setIsCheckedFourth(!isCheckedFourth)}
            className="w-12 h-12 cursor-pointer"
          />

          <label
            htmlFor="terms"
            className="text-gray-700 text-[16px] cursor-pointer"
          >
            I understand that payment for projects found on ZMZ{" "}
            <span className="font-semibold">
              must be made through ZMZ&apos;s payment system{" "}
            </span>
            and that payment through any other method constitutes theft from the
            company (a violation of our Terms of Service and Halacha).
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="md:text-[21px] text-[18px] text-center mt-8">
          Already have an account?{" "}
          <Link href={"/login"} className="text-primary">
            Log in
          </Link>
        </p>
        <div className="mt-3 flex flex-row justify-between pb-8">
          <CustomButton
            text="Back"
            className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-[#E7E7E7] text-[18px]"
            onClick={onBack}
          />
          <CustomButton
            text="Submit"
            className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={onNext}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterFreelancerAgreement;
