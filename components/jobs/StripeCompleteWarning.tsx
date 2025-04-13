"use client";

import Link from "next/link";
import Image from "next/image";
import { VscClose } from "react-icons/vsc";
import ErrorIcon from "@/public/icons/error-orange-icon.svg";

interface Props {
  show: boolean;
  toggle: () => void;
  stripeStatus: string;
}

const StripeCompleteWarning = ({ show, toggle, stripeStatus }: Props) => {
  const onCloseModal = () => {
    toggle();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onCloseModal}
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full max-w-[570px] transform overflow-hidden rounded-2xl bg-white px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
            <button
              onClick={onCloseModal}
              className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <VscClose className="h-6 w-6" />
            </button>

            <div className="content text-center">
              <div className="flex justify-center mb-6">
                <Image src={ErrorIcon} alt="Error" width={48} height={48} />
              </div>

              {(stripeStatus === "pending" ||
                stripeStatus === "currently_due") && (
                <>
                  <h3 className="text-3xl font-bold mb-3">
                    Complete Stripe Information
                  </h3>
                  <div className="text-xl font-normal text-gray-700">
                    To add milestones, please complete your Stripe account
                    information (at the bottom of your profile page) and add
                    your bank details
                  </div>
                </>
              )}

              {stripeStatus === "pending_verification" && (
                <>
                  <h3 className="text-3xl font-bold mb-3">
                    Stripe verification pending
                  </h3>
                  <div className="text-xl font-normal text-gray-700">
                    Your Stripe account information is being verified. Once
                    you&apos;re approved, you can add your bank information.
                  </div>
                </>
              )}

              {(stripeStatus === "bank_account_pending" ||
                stripeStatus === "verified") && (
                <>
                  <h3 className="text-3xl font-bold mb-3">
                    Complete bank details
                  </h3>
                  <div className="text-xl font-normal text-gray-700">
                    To add milestones or request payment delivery, please first
                    add your bank details
                  </div>
                </>
              )}
            </div>

            {(stripeStatus === "pending" ||
              stripeStatus === "currently_due" ||
              stripeStatus === "bank_account_pending") && (
              <div className="flex mt-6 justify-center">
                <Link
                  href="/freelancer/account/Payment%20Details"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-amber-500 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                >
                  {["pending", "currently_due"].includes(stripeStatus)
                    ? "Begin Stripe Activation"
                    : "Add Bank Account"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCompleteWarning;
