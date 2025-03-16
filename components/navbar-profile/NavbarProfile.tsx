/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import CustomButton from "../custombutton/CustomButton";
import { useAuth } from "@/helpers/contexts/auth-context";

// Types for better type safety
interface NavigationItem {
  href: string;
  label: string;
}

interface MenuItem {
  href: string;
  label: string;
}

const NavbarProfile = () => {
  const { signout, user } = useAuth();
  const pathname = usePathname();
  const url = pathname.split("/")[1];
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [notificationCount, setNotificationCount] = useState(1);

  const navigationItems: NavigationItem[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/jobs", label: "My Projects" },
    { href: "/messages-new", label: "Messages" },
    { href: "/payments", label: "Transactions" },
    { href: "/support", label: "Help" },
  ];

  const menuItems: MenuItem[] = [
    { href: "/freelancer/account/Profile", label: "My Profile" },
    { href: "/freelancer/account/Portfolio", label: "My Portfolio" },
    { href: "/freelancer/account/Ratings", label: "My Ratings" },
    { href: "/freelancer/account/Payments", label: "My Payment Details" },
    { href: "/freelancer/account/Settings", label: "My Account Settings" },
  ];

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth >= 1024) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsProfileDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleResize, handleClickOutside]);

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await signout(); // Ensure signout is async if it involves API calls
    router.push("/login"); // Redirect to login after signout
  };

  const NavLink = ({ href, label }: NavigationItem) => (
    <div className="relative group">
      <Link href={href}>
        <p
          className={`${
            url === href.replace("/", "") ? "font-semibold" : "font-normal"
          } text-black text-[18px] group-hover:text-black/60 transition-colors duration-200`}
        >
          {label}
        </p>
      </Link>
      <span className="block h-[2px] bg-black mt-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );

  // Remove redundant fetchUser effect if handled in signout or auth context
  useEffect(() => {
    if (user) {
      console.log("User data loaded:", user);
    }
  }, [user]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-secondary border-b border-primary h-[110px] flex items-center">
      <div className="max-w-[1320px] w-full mx-auto lg:px-16 xl:px-0 sm:px-24 px-7 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/home" aria-label="Home">
            <Image
              src="/zehmizeh-logo.svg"
              alt="Zehmizeh Logo"
              width={55}
              height={55}
              quality={100}
              priority
              className="cursor-pointer"
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            <div className="h-[22px] border border-customGray" />
            {navigationItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
        </div>

        <button
          className="lg:hidden flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          <div className="px-2 py-1 rounded-md border border-gray-300">
            {isMobileMenuOpen ? (
              <IoClose className="text-gray-400 text-[35px]" />
            ) : (
              <IoMenu className="text-gray-400 text-[35px]" />
            )}
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-3">
          <div className="relative w-10">
            {notificationCount > 0 && (
              <span className="w-5 h-5 rounded-full absolute -top-3 right-0 bg-primary text-center text-sm">
                {notificationCount}
              </span>
            )}
            <BsBell
              size={30}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>
          <CustomButton
            text="Find Projects"
            className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={() => router.push("/find-projects")} // Update with actual route
          />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2"
              aria-expanded={isProfileDropdownOpen}
              aria-label="Profile menu"
            >
              <Image src="/hiring.png" width={50} height={50} alt="User avatar" priority />
              <p className="flex items-center gap-2 text-lg text-[#212529]">
                {user?.data?.first_name || user?.first_name ||  "User"}  {user?.data?.last_name || user?.last_name ||  "User"}
                <IoIosArrowDown
                  size={20}
                  className={`transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                />
              </p>
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <ul className="py-2 text-gray-700" role="menu">
                  {menuItems.map((item) => (
                    <li key={item.href} role="menuitem">
                      <Link
                        href={item.href}
                        className="block px-4 py-2 hover:text-[#283eff]"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li role="menuitem">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <p className="font-bold text-[22px]">
            <span className="ml-2" dir="rtl">
              בס"ד
            </span>
          </p>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          className="absolute top-full left-0 w-full bg-secondary shadow-md flex flex-col gap-4 py-4 md:pl-[100px] pl-[15px] border-b border-customYellow animate-slide-down"
          aria-label="Mobile navigation"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-semibold text-black py-3 border-b border-gray-300 text-[18px] hover:text-black/60"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <CustomButton
            text="Find Projects"
            className="px-9 py-4 w-fit mx-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={() => {
              setIsMobileMenuOpen(false);
              router.push("/find-projects"); // Update with actual route
            }}
          />
        </nav>
      )}
    </header>
  );
};

export default NavbarProfile;