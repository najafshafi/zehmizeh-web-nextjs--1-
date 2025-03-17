// components/navbar-profile/NavbarLogin.tsx
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import NavbarProfile from "./NavbarProfile";
import Navbar from "../navbar/Navbar";
import { useAuth } from "@/helpers/contexts/auth-context";
import { useEffect, useState } from "react";

const NavbarLogin = () => {
  const { user: reduxUser } = useSelector((state: RootState) => state.auth);
  const { user: contextUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Simpler check - show NavbarProfile if EITHER auth source has user data
  const isAuthenticated = Boolean(
    reduxUser || contextUser
  );

  useEffect(() => {
    // Brief delay to let auth state stabilize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [reduxUser, contextUser]);

  // Show nothing during initial load to prevent flashing
  if (isLoading) {
    return null;
  }

  // Default to Navbar unless we're confident the user is authenticated
  return isAuthenticated ? <NavbarProfile /> : <Navbar />;
};

export default NavbarLogin;
