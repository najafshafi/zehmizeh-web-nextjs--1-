"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider as CustomAuthProvider } from "@/helpers/contexts/auth-context";
import { ReactNode } from "react";
import AuthSync from "@/components/auth/AuthSync";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <CustomAuthProvider>
        <AuthSync />
        {children}
      </CustomAuthProvider>
    </SessionProvider>
  );
}
