"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Card } from "@/components/styled/Auth.styled";
import CheckMark from "@/public/icons/check-mark.svg";
import Logo from "@/public/zehmizeh-logo.svg";
import CustomButton from "@/components/custombutton/CustomButton";

export default function Terms() {
  const [isAccepted, setIsAccepted] = React.useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   if (!user?.email_id) {
  //     navigate('/register');
  //     return;
  //   }
  // });

  const onAccept = () => setIsAccepted(true);
  const onLeave = () => router.push("/");

  if (isAccepted) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Card small={true}>
          <div className="text-center flex flex-col items-center">
            <span className="flex justify-center items-center  bg-[#34a853] w-28 h-28 rounded-full mb-2 box-shadow: 0px 13px 26px -4px rgba(52, 168, 83, 0.31) ">
              <CheckMark className="" />
            </span>
            <h2 className="mt-10 opacity-100 text-black">
              Mazal tov - your account has been created successfully!
            </h2>
            <Link href="/complete-profile" className="block">
              <CustomButton
                text={"Continue to Set Profile"}
                className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-5"
                onClick={() => router.push("/complete-profile")}
              />
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <Card small={true}>
        <div className="logo">
          <Logo className="w-20 h-20" />
        </div>
        <h1>Accept Terms</h1>
        <p className="terms-description">
          You understand that it is against Jewish law and our{" "}
          <span className="inline-block text-[#F2B420] text-base">
            terms and conditions
          </span>{" "}
          to leave outside the ZehMizeh platform to acquire a freelancer whom
          you found on the platform.
        </p>
        <footer className="flex justify-end gap-4 mt-4">
          <CustomButton
            text={"Leave Platform"}
            className="px-[2rem] py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full hover:bg-black hover:text-white text-[18px] border border-black"
            onClick={onLeave}
          />

          <CustomButton
            text={"Accept"}
            className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] "
            onClick={onAccept}
          />
        </footer>
      </Card>
    </div>
  );
}
