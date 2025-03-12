// components/navbar-profile/NavbarLogin.tsx
"use client";

import { useAuth } from "@/helpers/contexts/auth-context";
import NavbarProfile from "./NavbarProfile";
import Navbar from "../navbar/Navbar";

const NavbarLogin = () => {
const { user } = useAuth();
  return user ? <NavbarProfile /> : <Navbar />;
};

export default NavbarLogin;
