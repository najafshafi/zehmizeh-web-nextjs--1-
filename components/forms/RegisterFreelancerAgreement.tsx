"use client";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "../custombutton/CustomButton";
import { useState } from "react";
import PropTypes from "prop-types";
// import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { useAuth } from "@/helpers/contexts/auth-context";
import toast from "react-hot-toast";
import Spinner from "../forms/Spin/Spinner";

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

interface RegisterFreelancerAgreementProps {
  onNext: (data: FreelancerDetailsData) => void;
  onBack: () => void;
  detailsData: FreelancerDetailsData;
}

const RegisterFreelancerAgreement: React.FC<
  RegisterFreelancerAgreementProps
> = ({ onNext, onBack, detailsData }) => {
  const { submitRegisterUser, isLoading: contextLoading } = useAuth();
  const [isCheckedFirst, setIsCheckedFirst] = useState(false);
  const [isCheckedSecond, setIsCheckedSecond] = useState(false);
  const [isCheckedThird, setIsCheckedThird] = useState(false);
  const [isCheckedFourth, setIsCheckedFourth] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !isCheckedFirst ||
      !isCheckedSecond ||
      !isCheckedThird ||
      !isCheckedFourth
    ) {
      toast.error("Please accept all terms and conditions to continue.");
      return;
    }

    // Client-side validation before submitting
    if (!detailsData.email.includes("@") || !detailsData.email.includes(".")) {
      toast.error("Email id must be a valid email");
      return;
    }

    if (detailsData.password.length < 6) {
      toast.error("Password length must be at least 6 characters long");
      return;
    }

    // Set loading state
    setLocalLoading(true);

    // Prepare the registration payload
    const registrationPayload = {
      first_name: detailsData.firstName,
      last_name: detailsData.lastName,
      email_id: detailsData.email,
      password: detailsData.password,
      confirm: detailsData.confirmPassword,
      phone_number: detailsData.phone,
      formatted_phonenumber: detailsData.phone,
      user_type: "freelancer" as const,
      is_agency: detailsData.isAgency ? 1 : 0,
      agency_name: detailsData.agencyName || "",
      location: {
        country_name: detailsData.country,
        state: detailsData.state,
        country_id: 305,
        country_code: "1",
        country_short_name: "US",
        label: detailsData.country,
      },
    };

    try {
      // Register using the custom auth context
      const response = await submitRegisterUser(registrationPayload);

      // Only show success toast if the registration was successful
      if (response && response.status) {
        toast.success(
          "Registration successful! Please check your email for verification."
        );

        // Skip the immediate NextAuth login attempt that was causing the error
        // The user needs to verify their email first

        onNext(detailsData);
      } else {
        // Handle registration failure
        const errorMessage =
          response?.message || "Registration failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);

      // Extract error message from the error object
      let errorMessage = "Registration failed. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = error.response as { data?: { message?: string } };
        if (errorResponse?.data?.message) {
          errorMessage = errorResponse.data.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  // Determine if loading is active from any source
  const isLoading = contextLoading || localLoading;

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
            id="terms1"
            checked={isCheckedFirst}
            onChange={() => setIsCheckedFirst(!isCheckedFirst)}
            className="w-5 h-5 cursor-pointer"
          />

          <label
            htmlFor="terms1"
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
            id="terms2"
            checked={isCheckedSecond}
            onChange={() => setIsCheckedSecond(!isCheckedSecond)}
            className="w-8 h-8 cursor-pointer"
          />

          <label
            htmlFor="terms2"
            className="text-gray-700 text-[16px] cursor-pointer"
          >
            I am aware that ZMZ is intended for hiring freelancers to complete
            projects and not as a job portal for hiring permanent employees.
          </label>
        </div>
        <div className="flex flex-row items-center gap-4">
          <input
            type="checkbox"
            id="terms3"
            checked={isCheckedThird}
            onChange={() => setIsCheckedThird(!isCheckedThird)}
            className="w-8 h-8 cursor-pointer"
          />

          <label
            htmlFor="terms3"
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
            id="terms4"
            checked={isCheckedFourth}
            onChange={() => setIsCheckedFourth(!isCheckedFourth)}
            className="w-12 h-12 cursor-pointer"
          />

          <label
            htmlFor="terms4"
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
            disabled={isLoading}
          />
          <CustomButton
            text={isLoading ? <Spinner className="w-5 h-5" /> : "Submit"}
            className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

// Add prop types validation for ESLint
RegisterFreelancerAgreement.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  detailsData: PropTypes.shape({
    isAgency: PropTypes.bool.isRequired,
    agencyName: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
};

export default RegisterFreelancerAgreement;
