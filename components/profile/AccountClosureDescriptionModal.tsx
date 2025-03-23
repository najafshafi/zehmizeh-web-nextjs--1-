"use client";

import { useState, useEffect } from "react";
import { VscClose } from "react-icons/vsc";
import TextEditor from "@/components/forms/TextEditor";

interface Props {
  show: boolean;
  toggle: () => void;
  onConfirm?: (msg: string) => void;
  loading: boolean;
}

const AccountClosureDescriptionModal = ({
  show,
  toggle,
  onConfirm,
  loading,
}: Props) => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (show) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    }

    return () => {
      // Cleanup
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [show]);

  useEffect(() => {
    if (show) {
      setMessage("");
    }
  }, [show]);

  const handleClose = () => {
    setMessage("");
    toggle();
  };

  const onDescriptionChange = (data: string) => {
    setMessage(data);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm(message);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-hidden">
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-xl px-[1rem] py-[2rem] md:p-12 max-w-[765px] w-full mx-4 my-8">
        <button
          className="absolute right-4 top-4 md:top-0 md:-right-8 text-2xl md:text-white text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <VscClose size={24} />
        </button>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="content">
            <div className="text-[20px] font-normal">
              We&apos;re sorry to see you go! We can improve with your
              feedback... please let us know why you&apos;re closing your
              account.
            </div>
            <div className="mt-4">
              <TextEditor
                value={message}
                onChange={onDescriptionChange}
                placeholder="Write here..."
                maxChars={1000}
              />
            </div>
          </div>
          <div className="flex justify-center md:justify-end mt-8">
            <button
              type="submit"
              disabled={message === "" || loading}
              className="w-fit bg-[#F2B420] text-[#212529] px-8 py-[0.9rem] hover:scale-105 duration-300 text-[18px] self-end rounded-full disabled:bg-[#F2A420] flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#212529] border-t-transparent rounded-full animate-spin" />
              ) : (
                "Closed Account Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountClosureDescriptionModal;
