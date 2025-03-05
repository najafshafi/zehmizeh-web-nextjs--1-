"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import CustomButton from "../custombutton/CustomButton";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [isFocusedEmail, setIsFocusedEmail] = useState(false);

  const onLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col gap-2 max-w-[730px] w-full mt-[100px] md:px-0 px-10">
      <div className="flex flex-row justify-between">
        <Link
          href={"/login"}
          className="text-black flex  items-center font-normal text-[18px]"
        >
          <IoIosArrowRoundBack className="text-[27px] font-light" />
          Back
        </Link>
        <Link href={"/home"} className="text-customYellow font-normal text-[18px]">
          Go To Home
        </Link>
      </div>
      <div className="bg-white rounded-xl pt-12 pb-16 flex flex-col gap-4 items-center justify-center">
        <Image
          src={"/zehmizeh-logo.svg"}
          alt={"logo"}
          width={70}
          height={70}
          quality={100}
          loading="lazy"
        />

        <p className="font-bold mt-6 text-[30px] leading-none">
          Forgot Password
        </p>
        <p className="text-center w-full max-w-[600px]  md:px-0 px-6 text-[22px] font-normal text-[#757E7D]">
          Enter the email address attached to your account and we&apos;ll send you a
          code to reset your password.
        </p>
        <div className="flex flex-col gap-1 w-full max-w-[600px] md:px-0 px-6 mt-2">
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

          <div className="flex flex-col items-center justify-center">
            <CustomButton
              text="Submit"
              className="px-9 py-4 w-full max-w-[200px] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-5"
              onClick={onLoginClick}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Link
            href={"/register/employer"}
            className="text-[20px] text-customYellow"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
