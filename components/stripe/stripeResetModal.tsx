"use client";

import { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { resetStripeHandler } from "@/helpers/http/freelancer";
import toast from "react-hot-toast";

interface ApiResponse {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface Props {
  show: boolean;
  onClose: () => void;
  refetch: () => void;
}

const StripeResetModal = ({ show, onClose, refetch }: Props) => {
  const [loading, setLoading] = useState(false);

  // Add effect to manage body scrolling
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure body scrolling is restored when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  const resetStripe = async () => {
    setLoading(true);

    const promise = resetStripeHandler();
    toast.promise(promise, {
      loading: "loading...",
      success: (res: ApiResponse) => {
        setLoading(false);
        onClose();
        refetch();
        return res?.message ?? "success";
      },
      error: (err: ApiResponse) => {
        setLoading(false);
        onClose();
        return err?.response?.data?.message ?? err.toString();
      },
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center  sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block transform text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[678px] sm:align-middle">
          <div className="relative bg-white rounded-xl p-12">
            {/* Close Button */}
            <VscClose
              className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
              onClick={onClose}
            />

            {/* Title */}
            <h4 className="text-2xl font-bold text-center mb-6">
              Are You Sure You Want to Reset Stripe?
            </h4>

            {/* Content */}
            <div className="text-lg">
              <p className="mt-4">
                Resetting Stripe means all of your previous Stripe account
                details will be deleted and you will need to restart Stripe
                activation from the beginning. (Nothing else about your profile
                or your project history will be changed.)
              </p>

              <span className="block mt-4">
                This action is only recommended if:
              </span>
              <ul className="list-disc ml-8">
                <li>You&apos;ve registered with incorrect information</li>
                <li>You&apos;re moving to a new country</li>
              </ul>

              <p className="text-center font-bold mt-4">
                This step cannot be undone.
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-8 flex justify-center">
              <button
                className="bg-[#F7B500] text-[#1d1e1b] px-8 py-3 rounded-full text-lg font-medium hover:bg-[#E5A800] focus:outline-none focus:ring-2 focus:ring-[#F7B500] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3"
                disabled={loading}
                onClick={resetStripe}
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 text-[#1d1e1b]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                Reset Stripe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeResetModal;
