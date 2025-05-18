"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { IoEyeOutline } from "react-icons/io5";
import CustomButton from "@/components/custombutton/CustomButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/helpers/contexts/auth-context";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "./Spin/Spinner";
import { apiClient } from "@/helpers/http";

const LoginForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { signin: contextSignIn, isLoading: contextLoading } = useAuth();

  // Local state for form inputs and validation errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkboxError, setCheckboxError] = useState("");

  // Refs for input focus
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Get loading state from Redux
  const { isLoading: reduxLoading } = useSelector(
    (state: RootState) => state.auth
  );

  // Local state for UI interactions
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Direct state for visual feedback
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

    // If valid, proceed with login
    if (isValid) {
      // Set local loading state immediately for visual feedback
      setLocalLoading(true);

      try {
        console.log("Attempting login with:", { email_id: email });

        // First, use our existing auth context to login
        // This will handle the legacy authentication system
        const loginData = {
          email_id: email,
          password: password,
          stay_signedin: true,
          terms_agreement: true,
        };

        // Call the signin method from the auth context
        // This handles setting localStorage and user state
        await contextSignIn(loginData);

        // Also authenticate with NextAuth for future compatibility
        const nextAuthResult = await signIn("credentials", {
          email_id: email,
          email: email,
          password: password,
          redirect: false,
        });

        if (nextAuthResult?.error) {
          console.warn("NextAuth login warning:", nextAuthResult.error);
          // Continue anyway since we have the direct token
        }

        // Toast is already shown by contextSignIn
        console.log("Login successful");

        // Navigation is handled by contextSignIn
        // No need to manually navigate
      } catch (error: any) {
        console.error("Error during login:", error);
        toast.error(
          error?.response?.data?.message || "Login failed. Please try again."
        );
        setLocalLoading(false);
      }
    }
  };

  // Use any of the loading states
  const showLoading = reduxLoading || contextLoading || localLoading;

  // Focus management
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus(); // Focus on Email field first
    }
  }, []);

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
              autoFocus
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onLoginClick();
                }
              }}
            />
            <label
              htmlFor="floatingPassword"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-neutral-500 "
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
