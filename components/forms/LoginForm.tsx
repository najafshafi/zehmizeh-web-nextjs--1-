"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import CustomButton from "../custombutton/CustomButton";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkboxError, setCheckboxError] = useState("");

  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      setCheckboxError("");
    }
  };
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const onLoginClick = () => {
    let isValid = true;
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

    if (isValid) {
      router.push("/login");
    }
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex flex-col gap-2 max-w-[730px] w-full mt-[100px]  px-0 md:px-10 ">
      <Link
        href={"/home"}
        className="text-[#f2b420] text-[16px] font-medium"
      >
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
          <div
            className={`p-1 rounded-lg transition-all duration-300 ${
              isFocusedEmail ? "bg-blue-500/40 border" : "border-transparent"
            }`}
            onClick={() => emailRef.current?.focus()}
          >
            <div className="relative p-4 rounded-md border border-gray-300 bg-white cursor-text">
              <input
                type="email"
                placeholder=" "
                ref={emailRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
                className="peer block w-full text-gray-900 bg-transparent focus:outline-none placeholder-transparent"
              />
              <label
                className="cursor-text absolute left-4 text-gray-400 transition-all
            peer-focus:-top-[1px] peer-focus:text-[14px] peer-focus:text-gray-400 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-[17px]
            -top-1 text-[14px] font-light"
              >
                Email Address
              </label>
            </div>
          </div>
          {emailError && (
            <p className="text-red-600 text-[15px] pl-1">{emailError}</p>
          )}

          <div
            className={`p-1 rounded-lg transition-all duration-300 ${
              isFocusedPassword ? "bg-blue-500/40 border" : "border-transparent"
            }`}
            onClick={() => passwordRef.current?.focus()}
          >
            <div className=" flex flex-row items-center justify-between relative p-4 rounded-md border border-gray-300 bg-white cursor-text">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder=" "
                ref={passwordRef}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocusedPassword(true)}
                onBlur={() => setIsFocusedPassword(false)}
                className="peer block w-full text-gray-900 bg-transparent focus:outline-none placeholder-transparent "
              />
              <IoEyeOutline
                onClick={togglePasswordVisibility}
                className={` cursor-pointer  text-[24px] ${
                  passwordVisible ? "text-black" : "text-gray-400"
                }`}
              />

              <label
                className="cursor-text absolute left-4 text-gray-400 transition-all
            peer-focus:-top-[1px] peer-focus:text-[14px] peer-focus:text-gray-400 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-[17px]
            -top-1 text-[14px] font-light"
              >
                Password
              </label>
            </div>
          </div>
          {passwordError && (
            <p className="text-red-600 text-[15px] pl-1">{passwordError}</p>
          )}

          <div className="flex justify-end mt-3">
            <Link href={"/forgot-password"}>Forgot Password?</Link>
          </div>
          <div className="">
            {/* <div className="flex flex-row gap-1">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="form-checkbox h-10 w-10 text-primary"
              />
              <p className=" text-center font-normal text-[16px] text-gray-500">
                I agree that all payments will be processed through Zehmizeh.
                <span className="font-bold">
                  Paying outside Zehmizeh is against Halacha and violates our
                </span>
                <span className="text-customYellow"> Terms</span>
              </p>
            </div> */}
           <div className="bg-[#F8F9FA] p-4 rounded-lg border-gray-200 border mt-4  flex items-center justify-center">
              <div className="flex flex-row relative  w-fit">
              <input
                    type="checkbox"
                    id="agreePayments"
                    name="agreePayments"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="h-6 w-6 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500 md:absolute left-0 top-1 accent-customYellow"
                  />
                <div className="flex items-center  flex-col w-fit ">
                  
                  <label
                    htmlFor="agreePayments"
                    className="ml-2 text-[#7d7777] font-base text-sm md:text-base"
                  >
                    I agree that all payments will be processed through
                    ZehMizeh.
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
          </div>
          <div className="flex flex-col items-center justify-center">
            <CustomButton
              text="Log In"
              className="px-9 py-4 w-full max-w-[200px] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-5"
              onClick={onLoginClick}
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
