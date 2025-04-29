"use client";
import React, { ReactNode } from "react";
import Spinner from "@/components/forms/Spin/Spinner";

type CustomButtonProps = {
  className?: string;
  text: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  showSpinner?: boolean;
  spinnerPosition?: "left" | "right";
};

const CustomButton: React.FC<CustomButtonProps> = ({
  className,
  text,
  onClick,
  disabled,
  showSpinner = false,
  spinnerPosition = "right",
}) => {
  return (
    <button
      className={`${className} flex justify-center items-center gap-2 disabled:opacity-50`}
      onClick={onClick}
      disabled={disabled}
    >
      {showSpinner && spinnerPosition === "left" && <Spinner />}
      {text}
      {showSpinner && spinnerPosition === "right" && <Spinner />}
    </button>
  );
};

export default CustomButton;
