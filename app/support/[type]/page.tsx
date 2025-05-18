import { Suspense } from "react";
import dynamic from "next/dynamic";
import SupportClientWrapper from "./SupportClientWrapper";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for Suspense fallback
const SupportLoading = () => (
  <div className="pt-[110px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading support...</p>
  </div>
);

export default function SupportTypePage() {
  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <Suspense fallback={<SupportLoading />}>
        <SupportClientWrapper />
      </Suspense>
    </div>
  );
}

export async function generateStaticParams() {
  // Pre-render these paths at build time
  return [
    { type: "faq" },
    { type: "submit_dispute" },
    { type: "general_inquiry" },
    { type: "technical_support" },
    { type: "payment_issues" },
    { type: "account_issues" },
    { type: "other" },
    // Uncomment if you want to enable general inquiry
    // { type: 'gen_inquiry' },
  ];
}
