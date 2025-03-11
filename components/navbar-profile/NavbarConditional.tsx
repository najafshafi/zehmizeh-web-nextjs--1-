// components/NavbarConditional.tsx
"use client";

import { usePathname } from "next/navigation";
import NavbarLogin from "./NavbarLogin";

const NavbarConditional = () => {
  const pathname = usePathname();
  if (pathname === "/login" || pathname.startsWith("/register")) {
    return null;
  }
  return <NavbarLogin />;
};

export default NavbarConditional;
