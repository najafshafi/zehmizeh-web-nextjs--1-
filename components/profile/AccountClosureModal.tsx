"use client";

import { VscClose } from "react-icons/vsc";
import { useEffect } from "react";

interface Props {
  show: boolean;
  toggle: () => void;
  onConfirm?: () => void;
  clousureToggle?: () => void;
  loading: boolean;
}

const AccountClosureModal = ({
  show,
  toggle,
  clousureToggle,
  loading,
}: Props) => {
  // Add useEffect for body scroll management
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure body scroll is restored when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  const handleClose = () => {
    document.body.style.overflow = "unset";
    toggle();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-xl px-[1rem] py-[2rem] md:p-12 max-w-[678px] w-full mx-4">
        <button
          className="absolute right-4 top-4 md:top-0 md:-right-8 text-2xl md:text-white text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <VscClose size={24} />
        </button>

        <div className="flex flex-col gap-2">
          <h2 className="text-[28px] font-normal text-center text-[#212529]">
            Are you sure you would like to close your account?
          </h2>

          <p className="text-[20px] p-2 font-normal text-center text-[#212529]">
            Closing an account means permanently removing this user profile from
            the website.
          </p>

          <p className="text-[20px] font-normal text-center text-[#212529]">
            After closing, you will no longer have access to your transaction
            history, project records, ratings and reviews, message history, or
            any other aspect of your personal account. Starting a new account
            with the same name will not reinstate any of these elements.
          </p>

          <p className="text-[20px] font-normal text-center text-[#212529]">
            ZehMizeh will have no record of your personal banking and payment
            details after closure.
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <button
              className="w-full bg-[#F2B420] text-[#212529] px-8 py-[0.9rem] hover:scale-105 duration-300 text-[18px] rounded-full disabled:bg-[#F2A420]"
              onClick={handleClose}
              disabled={loading}
            >
              Keep my account open
            </button>

            <button
              className="w-full border border-[#FF4D4D] text-[#FF4D4D] px-8 py-[0.9rem] hover:bg-[#FF4D4D] hover:text-white duration-300 text-[18px] rounded-full disabled:opacity-50"
              onClick={clousureToggle}
              disabled={loading}
            >
              I&apos;d like my account to be closed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountClosureModal;
