"use client";

import { budgetChangeDeleteRequest } from "@/helpers/http/proposals";
import { TapiResponse } from "@/helpers/types/apiRequestResponse";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  jobPostId: string;
  refetch: () => void;
}

export const ChangeBudgetDeleteRequest = ({
  show,
  setShow,
  jobPostId,
  refetch,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  // Add scroll lock effect
  useEffect(() => {
    if (show) {
      // Store the current scroll position and body padding
      const scrollY = window.scrollY;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      const bodyPadding =
        parseInt(window.getComputedStyle(document.body).paddingRight) || 0;

      // Prevent body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.paddingRight = `${bodyPadding + scrollbarWidth}px`;

      return () => {
        // Restore body scroll
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.paddingRight = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [show]);

  const apiCall = async () => {
    const res = await budgetChangeDeleteRequest(jobPostId);
    await refetch();
    return res;
  };

  const handleDelete = () => {
    setIsLoading(true);
    toast.promise(apiCall(), {
      loading: "Please wait...",
      success: (res: TapiResponse<unknown>) => {
        setIsLoading(false);
        setShow(false);
        return res?.message;
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShow(false)}
      />

      <div className="relative w-full max-w-[800px] mx-4 bg-white rounded-xl py-8 px-4 md:p-12">
        <button
          type="button"
          className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => setShow(false)}
          aria-label="Close modal"
        >
          <VscClose size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-normal mb-6">
            Are you sure you want to delete this request?
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setShow(false)}
              disabled={isLoading}
              className="px-8 py-3 text-base font-medium border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            >
              No
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="px-8 py-3 text-base font-medium bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-600"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
