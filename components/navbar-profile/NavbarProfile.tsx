/* eslint-disable react/no-unescaped-entities */
"use client";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import CustomButton from "../custombutton/CustomButton";
import { useDispatch } from "react-redux"; // Import useDispatch
import { RootState } from "@/store"; // Import RootState from your store
import { signoutAction } from "@/lib/auth"; // Import signoutAction from auth.ts
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
  const { user } = useSelector((state: RootState) => state.auth); // Get user from Redux store
  const pathname = usePathname();
  const url = pathname.split("/")[1];
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch(); // Get dispatch function

  // State management with better initial values
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [notificationCount, setNotificationCount] = useState(1);

  // Memoized navigation items
  const navigationItems: NavigationItem[] = [
    { href: "#", label: "Dashboard" },
    { href: "#", label: "My Projects" },
    { href: "#", label: "Messages" },
    { href: "#", label: "Transactions" },
    { href: "#", label: "Help" },
  ];

  const menuItems: MenuItem[] = [
    { href: "/profile", label: "My Profile" },
    { href: "/portfolio", label: "My Portfolio" },
    { href: "/ratings", label: "My Ratings" },
    { href: "/payments", label: "My Payment Details" },
    { href: "/settings", label: "My Account Settings" },
  ];

  // Handle window resize with debounce
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth >= 1024) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  // Handle click outside for dropdown
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsProfileDropdownOpen(false);
    }
  }, []);

  // Initial setup and cleanup
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleResize, handleClickOutside]);

  // Handle logout
  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
signoutAction(dispatch, router); // Call signoutAction with dispatch and router
  };

  // Navigation link component
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

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser()); // Dispatch an action to fetch the user
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      // Logic to load the page when user data arrives
      console.log("User data loaded:", user);
      // You can add more logic here to handle the user data
    }
  }, [user]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-secondary border-b border-primary h-[110px] flex items-center">
      <div className="max-w-[1320px] w-full mx-auto lg:px-16 xl:px-0 sm:px-24 px-7 flex items-center justify-between">
        {/* Logo and Navigation */}
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

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label="Main navigation"
          >
            <div className="h-[22px] border border-customGray" />
            {navigationItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
        </div>

        {/* Mobile Menu Toggle */}
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

        {/* Desktop Profile and Actions */}
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
            onClick={() => router.push("#")}
          />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2"
              aria-expanded={isProfileDropdownOpen}
              aria-label="Profile menu"
            >
              <Image
                src="/hiring.png"
                width={50}
                height={50}
                alt="User avatar"
                priority
              />
              <p className="flex items-center gap-2 text-lg text-[#212529]">
             {user?.data?.first_name} 
                <IoIosArrowDown
                  size={20}
                  className={`transition-transform ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
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
                      className="w-full text-left px-4 py-2 text-red-500"
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

      {/* Mobile Menu */}
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
              router.push("#");
            }}
          />
        </nav>
      )}
    </header>
  );
};

export default NavbarProfile;
