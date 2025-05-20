"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { IoEyeOutline } from "react-icons/io5";
import CustomButton from "@/components/custombutton/CustomButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust path to your store
import { useAuth } from "@/helpers/contexts/auth-context"; // Adjust path to AuthContext
import Spinner from "./Spin/Spinner";
import { signIn } from "next-auth/react";
// import ErrorMessage from '@/components/ui/ErrorMessage';

const LoginForm = () => {
  const { signin } = useAuth();
  // Local state for form inputs and validation errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkboxError, setCheckboxError] = useState("");
  const [authError, setAuthError] = useState("");

  // Refs for input focus
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { isLoading } = useSelector((state: RootState) => state.auth);

  // Local state for UI interactions
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Add direct state for visual feedback even if Redux is slow
  const [localLoading, setLocalLoading] = useState(false);

  // Handle checkbox toggle
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      setCheckboxError(""); // Clear error when checked
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle login submission
  const onLoginClick = async () => {
    let isValid = true;
    setAuthError("");

    // Local validation
    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isChecked) {
      setCheckboxError("You must accept the payment terms to continue");
      isValid = false;
    } else {
      setCheckboxError("");
    }

    // If valid, proceed with authentication
    if (isValid) {
      // Set local loading state immediately for visual feedback
      setLocalLoading(true);

      const formData = {
        email_id: email, // Match expected API key
        password,
        terms_agreement: isChecked,
        stay_signedin: false, // Default value
      };

      try {
        // Use NextAuth signIn method
        const result = await signIn("credentials", {
          email_id: email,
          password: password,
          redirect: false,
        });

        if (result?.error) {
          setAuthError(result.error);
          setLocalLoading(false);
        } else if (result?.ok) {
          // If NextAuth is successful, also use the existing auth context for compatibility
          signin(formData);
        }
      } catch (error) {
        console.error("Error during login:", error);
        setAuthError("An unexpected error occurred. Please try again.");
        setLocalLoading(false);
      }

      // Set a timeout to reset loading after 2 seconds if Redux state doesn't update
      setTimeout(() => {
        setLocalLoading(false);
      }, 2000);
    }
  };

  // Use either Redux loading state or local loading state
  const showLoading = isLoading || localLoading;

  // For debugging
  useEffect(() => {
    console.log("Redux isLoading changed:", isLoading);
  }, [isLoading]);

  return (
    <div className="flex flex-col gap-2 max-w-[730px] w-full mt-[100px] px-0 md:px-10">
      <Link href={"/home"} className="text-[#f2b420] text-[16px] font-medium">
        Go To Home
      </Link>
      <div className="bg-white rounded-xl py-12 flex flex-col gap-10 items-center justify-center">
        <Image
          src={"/zehmizeh-logo.svg"}
          alt={"logo"}
          width={70}
          height={70}
          quality={100}
          loading="lazy"
        />
        <p className="font-bold text-[30px] leading-none">Log in to ZehMizeh</p>
        <div className="flex flex-col gap-1 w-full max-w-[600px] md:px-0 px-6">
          {/* Email Input */}
          <div className="relative mb-3">
            <input
              type="email"
              className="peer m-0 block h-[58px] w-full rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-blue-500 focus:ring-2 focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-black focus:outline-none    [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
              id="floatingInput"
              placeholder="name@example.com"
              ref={emailRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="floatingInput"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-neutral-500"
            >
              Email Address
            </label>
          </div>
          {emailError && (
            <p className="text-red-600 text-[15px] pl-1">{emailError}</p>
          )}

          {/* Password Input */}
          <div className="relative mb-3">
            <input
              type={passwordVisible ? "text" : "password"}
              className="peer m-0 block h-[58px] w-full rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-blue-500 focus:ring-2 focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-black focus:outline-none    [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
              id="floatingPassword"
              placeholder="Password"
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="floatingPassword"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-neutral-500"
            >
              Password
            </label>
            <IoEyeOutline
              onClick={togglePasswordVisibility}
              className={`absolute right-3 top-4 cursor-pointer text-[24px] ${
                passwordVisible ? "text-black" : "text-gray-400"
              }`}
            />
          </div>
          {passwordError && (
            <p className="text-red-600 text-[15px] pl-1">{passwordError}</p>
          )}

          {/* Authentication Error */}
          {authError && (
            <p className="text-red-600 text-[15px] pl-1 mb-2">{authError}</p>
          )}

          <div className="flex justify-end mt-3">
            <Link href={"/forgot-password"}>Forgot Password?</Link>
          </div>

          {/* Checkbox */}
          <div className="bg-[#F8F9FA] p-4 rounded-lg border-gray-200 border mt-4 flex items-center justify-center">
            <div className="flex flex-row relative w-fit">
              <input
                type="checkbox"
                id="agreePayments"
                name="agreePayments"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="h-6 w-6 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500 md:absolute left-0 top-1 accent-customYellow"
              />
              <div className="flex items-center flex-col w-fit">
                <label
                  htmlFor="agreePayments"
                  className="ml-2 text-[#7d7777] font-base text-sm md:text-base"
                >
                  I agree that all payments will be processed through ZehMizeh.
                </label>
                <p className="text-[#7d7777] mt-1 text-md font-semibold text-sm md:text-base text-center">
                  Paying outside ZehMizeh is against Halacha and violates our{" "}
                  <span className="text-yellow-500 cursor-pointer font-light">
                    Terms
                  </span>
                </p>
              </div>
            </div>
          </div>
          {checkboxError && (
            <p className="text-red-600 text-[15px] text-center pb-2 pt-1">
              {checkboxError}
            </p>
          )}

          {/* Login Button */}
          <div className="flex flex-col items-center justify-center">
            <CustomButton
              text={showLoading ? <Spinner className="w-5 h-5" /> : "Log In"}
              className="px-9 py-4 w-full max-w-[200px] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-5"
              onClick={onLoginClick}
              disabled={showLoading}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-[20px]">Don&apos;t have an account?</p>
          <p className="text-[20px]">
            Register{" "}
            <Link href={"/register/employer"} className="text-customYellow">
              here!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
