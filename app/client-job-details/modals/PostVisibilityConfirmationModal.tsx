"use client";

import React, { useEffect, useMemo, useState } from "react";
import { VscClose } from "react-icons/vsc";
import useResponsive from "@/helpers/hooks/useResponsive";

interface Props {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  isHidden: boolean;
  handleConfirm: (isDoNotShowWarningChecked: boolean) => void;
  handleReject: () => void;
  isLoading: boolean;
}

export const PostVisibilityConfirmationModal = ({
  show,
  setShow,
  isHidden,
  handleConfirm,
  handleReject,
  isLoading,
}: Props) => {
  const { isMobile } = useResponsive();
  const [isDoNotShowWarningChecked, setIsDoNotShowWarningChecked] =
    useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  useEffect(() => {
    setIsDoNotShowWarningChecked(false);
  }, [show]);

  const content = useMemo(() => {
    if (isHidden) {
      return {
        title: "Are you sure you want to hide this post?",
        text: `If you switch this post to the &quot;Hidden&quot; status, only freelancers who <b>(1)</b> you invite, <b>(2)</b> have already invited, or <b>(3)</b> who have already sent in proposals will be able to see the details. No one else will be able to submit proposals.`,
        buttons: [
          {
            variant: "secondary",
            text: "No - Keep public",
            onClick: handleReject,
          },
          {
            variant: "primary",
            text: "Yes - Hide my post",
            onClick: () => handleConfirm(isDoNotShowWarningChecked),
          },
        ],
      };
    }
    return {
      title: "Are you sure you want to make this post public?",
      text: `If you switch this post to &quot;public,&quot; any freelancer on ZehMizeh can access it on the project board.`,
      buttons: [
        {
          variant: "secondary",
          text: "No - Keep hidden",
          onClick: handleReject,
        },
        {
          variant: "primary",
          text: "Yes - Make my post public",
          onClick: () => handleConfirm(isDoNotShowWarningChecked),
        },
      ],
    };
  }, [isHidden, isDoNotShowWarningChecked, handleConfirm, handleReject]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={() => !isLoading && setShow(false)}
      />
      <div className="relative bg-white rounded-xl px-6 py-8 md:p-12 max-w-[800px] w-full mx-4">
        {!isLoading && (
          <button
            type="button"
            className="absolute right-4 top-4 lg:top-0 lg:-right-8 lg:text-white text-gray-500 hover:text-gray-600 transition-colors duration-200"
            onClick={() => setShow(false)}
            aria-label="Close modal"
          >
            <VscClose size={24} />
          </button>
        )}

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-normal text-center mb-5">
            {content.title}
          </h2>
          <div
            className="mb-4 text-lg text-center text-gray-900 px-3"
            dangerouslySetInnerHTML={{ __html: content.text }}
          />

          <div
            className={`flex ${
              isMobile ? "flex-col w-full" : "flex-row"
            } justify-center gap-4`}
          >
            {content.buttons.map((button) => (
              <button
                key={button.text}
                className={`px-9 py-[0.85rem] rounded-full text-lg font-normal transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
                  button.variant === "primary"
                    ? "bg-[#F2B420] text-[#212529]"
                    : "border border-gray-300 text-gray-700 bg-[#e7e7e7] hover:bg-gray-50"
                }`}
                onClick={button.onClick}
                disabled={isLoading}
              >
                {button.text}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 mt-5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-[#F2B420] focus:ring-[#F2B420]"
              checked={isDoNotShowWarningChecked}
              onChange={() => setIsDoNotShowWarningChecked((prev) => !prev)}
              disabled={isLoading}
            />
            <span className="text-gray-700">
              Do not show this warning in the future
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
