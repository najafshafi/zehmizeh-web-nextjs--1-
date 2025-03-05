"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { name: "Home", path: "/home" },
  { name: "About Us", path: "/about-us" },
];

const SiteHeader: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  const toggleNavbar = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 bg-[#fefbf4] py-6 border-b border-[#f2b420] z-[999]">
      <div className="xl:w-[1320px] mx-auto px-3">
        <nav className="flex items-center justify-between h-[58px]">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Image src="/logo192.png" alt="Logo" width={48} height={48} />
            </Link>

            <div className="flex items-center justify-between">
              <div className="lg:h-6 w-[2px] bg-gray-300 ml-7"></div>
            </div>

            <div className="space-x-6 flex items-center justify-between ml-5">
              {NAV_ITEMS.map(({ name, path }, index) => (
                <Link
                  key={name}
                  href={path}
                  className={`${
                    index === 0 ? "font-semibold" : "font-medium"
                  } text-black text-lg hover:text-gray-600 relative after:content-[&quot;&quot;] after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-250 hover:after:left-0 after:translate-x-2 after:translate-y-1 hover:after:w-[80%]`}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login" className="text-lg mr-8">
              Log In
            </Link>
            <Link
              href="/register/employer"
              className="text-lg bg-[rgb(242,180,32)] border border-[rgb(242,180,32)] px-[35px] py-[15px] rounded-[40px] transition-all duration-300 transform hover:scale-105 hover:bg-[rgba(242,179,32,0.92)] hover:shadow-lg"
            >
              Sign Up
            </Link>

            <p className="font-bold text-[22px]">
              <span className="ml-2" dir="rtl">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                בס"ד
              </span>
            </p>
          </div>
          <button
            className="lg:hidden px-4 rounded-md focus:outline-none border border-gray-400 sm:border-transparent"
            onClick={toggleNavbar}
          >
            <span className="inline-block text-gray-500 text-[28px]">
              {isExpanded ? "X" : "☰"}
            </span>
          </button>
        </nav>

        <div
          className={`lg:hidden fixed top-[100px] left-0 w-full h-screen bg-[#fefbf4] flex flex-col space-y-4 p-4 z-[1000] overflow-y-auto transition-all duration-300 ease-in-out ${
            isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <span className="text-gray-900 text-[20px] my-4 font-semibold">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            בס"ד
          </span>
          {NAV_ITEMS.map(({ name, path }, index) => (
            <Link
              key={name}
              href={path}
              className={`text-gray-900 text-lg py-4 !m-0 text-[20px] border-b border-gray-300 ${
                index === 0 ? "font-semibold" : "font-medium"
              }`}
              onClick={toggleNavbar}
            >
              {name}
            </Link>
          ))}
          <Link href="/login" className="text-gray-900 py-4 !m-0 text-[20px] border-b border-gray-300">
            Log In
          </Link>
          <Link href="/register/employer" className="text-gray-900 py-4 !m-0 text-[20px] border-b border-gray-300">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
