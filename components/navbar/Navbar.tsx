"use client";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "../custombutton/CustomButton";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";

const Navbar = () => {
  const pathname = usePathname();
  const url = pathname.split("/")[1];
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    // Update the document title using the browser API
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount to get initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const router = useRouter();
  const onLoginClick = () => {
    router.push("/login");
  };
  const onSignUpClick = () => {
    router.push("/register/employer");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full z-40 flex h-[110px] fixed items-center justify-center border-b border-primary py-6 bg-secondary ">
      <div className="w-full max-w-[1320px]  lg:px-16 xl:px-0 sm:px-24 px-7 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-6">
          <Image
            src={"/zehmizeh-logo.svg"}
            alt={"logo"}
            width={55}
            height={55}
            quality={100}
            loading="lazy"
            className="cursor-pointer"
            onClick={() => router.push("/home")}
          />
          <div className="flex-row items-center gap-6 lg:flex hidden">
            <div className="h-[22px] border border-customGray "></div>
            <div className="relative group">
              <Link
                href={"/home"}
                className={`${
                  url === "home" ? "font-semibold" : "font-normal "
                } text-black text-[18px] group-hover:text-black/60`}
              >
                Home
              </Link>
              <span className="block h-[2px] bg-black mt-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </div>
            <div className="relative group">
              <Link
                href={"/about-us"}
                className={`${
                  url === "about-us" ? "font-semibold" : "font-normal"
                } text-black text-[18px] group-hover:text-black/60`}
              >
                About Us
              </Link>
              <span className="block h-[2px] bg-black mt-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-3xl"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <div className="px-2 py-2 rounded-md border border-gray-300">
                <IoClose className="text-gray-400 text-[35px]" />
              </div>
            ) : (
              <div className="px-2  py-1 rounded-md border border-gray-300">
                <IoMenu className="text-gray-400 text-[35px]" />
              </div>
            )}
          </button>
        </div>
        <div className="lg:flex hidden flex-row items-center gap-3">
          <CustomButton
            text="Log In"
            className="px-6 text-black hover:text-black/60 text-[18px]"
            onClick={onLoginClick}
          />
          <CustomButton
            text="Sign Up"
            className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={onSignUpClick}
          />
          {/* <Image
            src={"/logo2.png"}
            alt={"logo"}
            width={60}
            height={60}
            quality={100}
            loading="lazy"
          /> */}
           <p className="font-bold text-[22px]">
              <span className="ml-2" dir="rtl">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                בס"ד
              </span>
            </p>
        </div>

        {isOpen && (
          <div className="absolute top-full border-b gap-4 border-customYellow md:h-fit h-screen left-0 w-full bg-secondary shadow-md flex flex-col md:pl-[100px] pl-[15px] py-4 transition-transform duration-300 ease-out transform origin-top">
            <Link
              href={"/home"}
              className="font-semibold text-black md:border-none md:py-0 py-3 border-b border-gray-300 text-[18px] group-hover:text-black/60"
            >
              Home
            </Link>
            <Link
              href={"/about-us"}
              className=" text-black md:py-0 py-3 text-[18px] md:border-none border-b border-gray-300 group-hover:text-black/60"
            >
              About Us
            </Link>
            {windowWidth < 768 ? ( 
              <>
                <Link
                  href={"/login"}
                  className=" text-black md:py-0 py-3 text-[18px] md:border-none border-b border-gray-300 group-hover:text-black/60"
                >
                  Log In
                </Link>
                <Link
                  href={"/register/employer"}
                  className=" text-black md:py-0 py-3 text-[18px] md:border-none border-b border-gray-300 group-hover:text-black/60"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <CustomButton
                  text="Log In"
                  className="px-6 text-black w-[150px] md:py-0 py-3 hover:text-black/60 text-[18px]"
                  onClick={onLoginClick}
                />
                <CustomButton
                  text="Sign Up"
                  className="px-9 py-4 w-[150px] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                  onClick={onSignUpClick}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
