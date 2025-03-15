// components/NavbarConditional.tsx
"use client";

import { usePathname } from "next/navigation";
import NavbarLogin from "./NavbarLogin";

const NavbarConditional = () => {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/reset-password" || pathname === "/forgot-password" || pathname === "/2fa" || pathname?.startsWith("/register") || pathname === "/complete-profile" || pathname === "/terms" || pathname === "/post-new-job") {
    return null;
  }
  return <NavbarLogin />;
};

export default NavbarConditional;