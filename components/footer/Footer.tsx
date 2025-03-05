"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter()
  return (
    <div className="w-full flex flex-col items-center justify-center pt-6">
      <div className="w-full 2xl:max-w-[1200px] xl:max-w-[1200px] xl:px-0 sm:px-[200px] flex md:flex-row flex-col items-center justify-between md:gap-0 gap-12 py-10">
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
          <Link href={"/about-us"}>Contact Us</Link>
        </div>
      </div>

      <div className="border-t border-orangeYellow w-full 2xl:max-w-[2250px] max-w-[750px] 2xl:px-[40px]   xl:max-w-[1200px] px-[20px] xl:px-0 sm:px-[200px] md:px-[0px]">
        <div className="flex md:flex-row flex-col md:gap-0 gap-4 items-center justify-between  py-8">
          <div className="flex flex-row items-center justify-center sm:gap-6 gap-3">
            <Link href={"#"} className="text-gray-500 text-[14px]">
              Terms of Service
            </Link>
            <Link href={"#"} className="text-gray-500 text-[14px]">
              Privacy Policy
            </Link>
            <Link href={"#"} className="text-gray-500 text-[14px]">
              Cookies
            </Link>
            <Link href={"#"} className="text-gray-500 text-[14px]">
              Finding Us
            </Link>
          </div>
          <p className="text-gray-500 text-[14px]">
            2025 ZehMizeh 1.1.2. All Rights Reserved.
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default Footer;
