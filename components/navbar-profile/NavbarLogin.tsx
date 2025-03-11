// components/navbar-profile/NavbarLogin.tsx
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import NavbarProfile from "./NavbarProfile";
import Navbar from "../navbar/Navbar";

const NavbarLogin = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? <NavbarProfile /> : <Navbar />;
};

export default NavbarLogin;
