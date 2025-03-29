"use client";

import { useState, useEffect } from "react";
import TextEditor from "@/components/forms/TextEditor";

interface Props {
  show: boolean;
  toggle: () => void;
  onInvite?: (msg: string) => void;
  freelancerName: string;
  loading: boolean;
  inviteMessage?: string;
  isEditFlag?: boolean;
}

const InviteFreelancerMessageModal = ({
  show,
  toggle,
  onInvite,
  freelancerName,
  loading,
  inviteMessage,
  isEditFlag,
}: Props) => {
  const [message, setMessage] = useState<string>("");

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

  useEffect(() => {
    if (show) {
      setMessage("");
    }
  }, [show]);

  const onDescriptionChange = (data: string) => {
    setMessage(data);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onInvite) {
      onInvite(message);
      setMessage("");
    }
  };

  const onCloseModal = () => {
    setMessage("");
    toggle();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCloseModal}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-[765px] transform rounded-lg bg-white px-4 py-8 md:p-12 shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={onCloseModal}
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
          <form onSubmit={handleSubmit} className="mt-0">
            <div className="content">
              <h3 className="text-[28px] font-semibold">
                {freelancerName
                  ? "Write Your Personal Invitation"
                  : "Message Freelancers"}
              </h3>
              {freelancerName ? (
                <div className="mt-4 text-xl">
                  Share a message with{" "}
                  <span className="font-bold capitalize">
                    {freelancerName && ` ${freelancerName}. `}
                  </span>
                  (Optional)
                </div>
              ) : (
                <div className="mt-4 text-xl">
                  Share a message with the freelancers you&apos;re inviting
                  (Optional)
                </div>
              )}
              {!isEditFlag && (
                <div className="mt-4">
                  <TextEditor
                    value={message}
                    onChange={onDescriptionChange}
                    placeholder="Write here..."
                    maxChars={1000}
                  />
                </div>
              )}
              {isEditFlag && (
                <div className="mt-4">
                  <TextEditor
                    value={inviteMessage || ""}
                    onChange={onDescriptionChange}
                    maxChars={1000}
                  />
                </div>
              )}
            </div>

            {/* Bottom buttons */}
            <div className="mt-6 flex justify-end">
              {!isEditFlag && (
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-[#F2B420] px-8 py-[0.9rem] text-lg font-normal text-[#212529] transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="h-5 w-5 animate-spin"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="ml-2">Sending...</span>
                    </div>
                  ) : (
                    "Send Invitation"
                  )}
                </button>
              )}
              {isEditFlag && (
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-[#F2B420] px-8 py-[0.9rem] text-lg font-normal text-[#212529] transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="h-5 w-5 animate-spin"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="ml-2">Editing...</span>
                    </div>
                  ) : (
                    "Edit Invitation"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteFreelancerMessageModal;
