"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter()
  return (
    <div className="w-full flex flex-col items-center justify-center pt-6 xl:p-[4rem_8.75rem_0rem]">

      <div className="container max-w-[1320px] w-full  flex md:flex-row flex-col items-center justify-between md:gap-0 gap-8 pb-10">
        <Image
          src={"/zehmizeh-logo.svg"}
          alt={"logo"}
          width={50}
          height={50}
          quality={100}
          loading="lazy"
          className="cursor-pointer"
          onClick={() => router.push("/home")}
        />
        <div className="flex flex-row gap-10">
          <Link href={"/about-us"}>About Us</Link>
          <Link href={"/customer-support"}>Contact Us</Link>
        </div>
      </div>

      <div className="border-t border-orangeYellow w-full    ">
        <div className="flex md:flex-row flex-col md:gap-0 gap-4 items-center justify-between  py-8">
          <div className="flex flex-row items-center justify-center sm:gap-6 gap-3 md:text-sm  text-xs">
            <Link href={"#"} className="text-[#212529] ">
              Terms of Service
            </Link>
            <Link href={"#"} className="text-[#212529] ">
              Privacy Policy
            </Link>
            <Link href={"#"} className="text-[#212529] ">
              Cookies
            </Link>
            <Link href={"/finding-us"} target="_blank" rel="noopener noreferrer" className="text-[#212529] ">
              Finding Us
            </Link>
          </div>
          <p className="text-[#212529]  md:text-sm  text-xs">
            2025 ZehMizeh 1.1.2. All Rights Reserved.
          </p>
        </div>
      </div>

     
      
    </div>
  );
};

export default Footer;
