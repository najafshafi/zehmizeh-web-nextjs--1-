"use client";

import { useEffect } from "react";
// import Image from "next/image";
import ErrorIcon from "@/public/icons/error-orange-icon.svg";

interface Props {
  show: boolean;
  error?: string;
  toggle: () => void;
  goToMilestones?: () => void;
}

const EndJobErrorModal = ({ show, toggle, goToMilestones, error }: Props) => {
  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (show) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10));
    }
  }, [show]);

  if (!show) return null;

  return (

    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={toggle}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-[540px] transform rounded-lg bg-white px-4 py-8  md:p-12 shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={toggle}
            className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"

            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="flex flex-col items-center justify-center">
            <div className="mb-3">
              <ErrorIcon />
            </div>
            <div className="text-center text-xl text-[#212529] opacity-75">
              {error ||
                "Please complete/close all the remaining milestones in order to end the project."}
            </div>
            {goToMilestones && (
              <button
                onClick={goToMilestones}
                className="mt-5 rounded-full bg-[#F2B420] px-9 py-[1.125rem] text-lg font-normal text-[#212529] transition-transform hover:scale-105"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndJobErrorModal;
