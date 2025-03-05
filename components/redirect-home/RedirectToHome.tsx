"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const RedirectToHome = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/home");
    }
  }, [pathname, router]);

  return null;
};

export default RedirectToHome;