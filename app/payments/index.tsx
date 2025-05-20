"use client";

import dynamic from "next/dynamic";
import { PaymentControllerProvider } from "./PaymentController";
import Spinner from "@/components/forms/Spin/Spinner";

// Dynamically import the Payments component with no SSR to avoid useSearchParams issues
const DynamicPayments = dynamic(() => import("./Payments"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[300px]">
      <Spinner className="w-8 h-8" />
    </div>
  ),
});

const PaymentsWrapper = () => {
  return (
    <PaymentControllerProvider>
      <DynamicPayments />
    </PaymentControllerProvider>
  );
};

export default PaymentsWrapper;
