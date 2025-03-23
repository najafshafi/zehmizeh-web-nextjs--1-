"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientJobDetailsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard or another appropriate page
    router.push("/dashboard");
  }, [router]);

  return <div>Redirecting...</div>;
}
