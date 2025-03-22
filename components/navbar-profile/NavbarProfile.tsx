/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import CustomButton from "../custombutton/CustomButton";
import { useAuth } from "@/helpers/contexts/auth-context";
import NotificationDropdown from "../notification-dropdown/NotificationDropdown";

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
  const pathname = usePathname() || ""; // Handle null pathname
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // Commented out unused states
  // const [windowWidth, setWindowWidth] = useState<number | null>(null);
  // const [notificationCount, setNotificationCount] = useState(1);

  // Check if user is a client or freelancer
  const isClient = user?.user_type === "client";

  const navigationItems: NavigationItem[] = isClient
    ? [
        { href: "/client/dashboard", label: "Dashboard" },
        { href: "/client-jobs", label: "My Projects" },
        { href: "/search?type=freelancers", label: "Find Freelancers" },
        { href: "/messages-new", label: "Messages" },
        { href: "/payments", label: "Transactions" },
        { href: "/support", label: "Help" },
      ]
    : [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/jobs", label: "My Projects" },
        { href: "/messages-new", label: "Messages" },
        { href: "/payments", label: "Transactions" },
        { href: "/support", label: "Help" },
      ];

  const menuItems: MenuItem[] = isClient
    ? [
        { href: "/freelancer/account/Profile", label: "My Profile" },
        { href: "/client/account/Ratings", label: "My Ratings" },
        { href: "/client/account/Payments", label: "My Payment Details" },
        { href: "/client/account/Settings", label: "My Account Settings" },
      ]
    : [
        { href: "/freelancer/account/Profile", label: "My Profile" },
        { href: "/freelancer/account/Portfolio", label: "My Portfolio" },
        { href: "/freelancer/account/Ratings", label: "My Ratings" },
        { href: "/freelancer/account/Payments", label: "My Payment Details" },
        { href: "/freelancer/account/Settings", label: "My Account Settings" },
      ];

  const handleResize = useCallback(() => {
    // setWindowWidth(window.innerWidth);
    if (window.innerWidth >= 1024) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsProfileDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    // setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleResize, handleClickOutside]);

  const handleLogout = () => {
    // Close dropdown
    setIsProfileDropdownOpen(false);

    // Use the global logout function if available, otherwise fall back to context signout
    if (typeof window !== "undefined" && "handleGlobalLogout" in window) {
      // @ts-expect-error - Global function added by NavbarLogin
      window.handleGlobalLogout();
    } else {
      // Fallback to original logout logic
      signout();
      // Add small delay before navigation to ensure auth state updates
      setTimeout(() => {
        router.replace("/home");
      }, 50);
    }
  };

  const NavLink = ({ href, label }: NavigationItem) => {
    // Improved active path detection that handles deeper paths
    const isActive = () => {
      if (href.startsWith("/search")) {
        // Handle search paths specifically (for Find Freelancers)
        return (
          pathname.startsWith("/search") &&
          pathname.includes(href.split("?")[1])
        );
      }

      // For client dashboard and other deep paths
      if (href.includes("/client/") || href.includes("/freelancer/")) {
        return pathname.startsWith(href);
      }

      // For top-level paths like /jobs, /client-jobs, etc.
      return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
      <div className="relative group">
        <Link href={href}>
          <p
            className={`${
              isActive() ? "font-semibold" : "font-normal"
            } text-black text-[18px] group-hover:text-black/60 transition-colors duration-200`}
          >
            {label}
          </p>
        </Link>
        <span className="block h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
      </div>
    );
  };

  // Remove redundant fetchUser effect if handled in signout or auth context
  useEffect(() => {
    if (user) {
    }
  }, [user]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-secondary border-b border-primary h-[110px] flex items-center p-6">
      <div className="max-w-[1320px] w-full mx-auto lg:px-16 xl:px-0 sm:px-24 !px-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/home" aria-label="Home">
            <Image
              src="/zehmizeh-logo.svg"
              alt="Zehmizeh Logo"
              width={48}
              height={48}
              priority
              className="cursor-pointer"
            />
          </Link>

          <div className="ml-1 h-5 border border-customGray" />
          <nav
            className="hidden lg:flex items-center gap-5"
            aria-label="Main navigation"
          >
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

        <div className="hidden lg:flex items-center gap-4 px-4">
          <NotificationDropdown />
          <CustomButton
            text={isClient ? "Post Project" : "Find Projects"}
            className="px-8 py-[15px] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={() =>
              router.push(
                isClient ? "/post-new-job" : "/search?type=jobs&page=1"
              )
            }
          />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2"
              aria-expanded={isProfileDropdownOpen}
              aria-label="Profile menu"
            >
              <Image
                src={user?.user_image}
                width={50}
                height={50}
                alt="User avatar"
                priority
              />
              <p className="flex items-center gap-2 text-lg text-[#212529]">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : "User"}
                <IoIosArrowDown
                  size={20}
                  className={`transition-transform ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </p>
            </button>
            {isProfileDropdownOpen && (
              <div
                className="absolute right-0 mt-[0.125rem] w-[200px] bg-white rounded-md z-50"
                style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 0px 15px" }}
              >
                <ul className="py-[14px] px-1 text-gray-700" role="menu">
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
          <p className="font-bold text-xl">
            <span dir="rtl">בס"ד</span>
          </p>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          className="absolute top-full h-screen left-0 w-full bg-secondary shadow-md flex flex-col gap-4 py-4 md:pl-[100px] pl-[15px] border-b border-customYellow animate-slide-down"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between pr-4">
            <div className="px-4 mb-2">
              <NotificationDropdown />
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2"
                aria-expanded={isProfileDropdownOpen}
                aria-label="Profile menu"
              >
                <Image
                  src={user?.user_image}
                  width={40}
                  height={40}
                  alt="User avatar"
                  priority
                />
                <p className="flex items-center gap-2 text-lg text-[#212529]">
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : "User"}
                  <IoIosArrowDown
                    size={20}
                    className={`transition-transform ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </p>
              </button>
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-[0.125rem] w-[200px] bg-white rounded-md z-50"
                  style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 0px 15px" }}
                >
                  <ul className="py-[14px] px-1 text-gray-700" role="menu">
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
            <p className="font-bold text-xl">
              <span dir="rtl">בס"ד</span>
            </p>
          </div>

          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className=" text-black py-2 border-b border-gray-300 text-[18px] hover:text-black/60"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontWeight: "550" }}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex justify-center">
            <CustomButton
              text={isClient ? "Post Project" : "Find Projects"}
              className="px-9 py-4 w-fit mx-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push(
                  isClient ? "/post-new-job" : "/search?type=jobs&page=1"
                );
              }}
            />
          </div>
        </nav>
      )}
    </header>
  );
};

export default NavbarProfile;
