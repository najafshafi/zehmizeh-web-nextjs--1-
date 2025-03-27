"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientJobDetailsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard or another appropriate page
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="client-job-details-layout pt-[90px] bg-secondary flex flex-col items-center">
      Redirecting...
    </div>
  );
}
