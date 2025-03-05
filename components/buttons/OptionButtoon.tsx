import React from "react";
import clsx from "clsx";

type OptionButtonProps = {
  selected: boolean;
  margin?: string;
  padding?: string;
  fontSize?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const OptionButton: React.FC<OptionButtonProps> = ({
  selected,
  margin = "m-4",
  padding = "py-5 px-6",
  fontSize = "text-lg",
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-[0.875rem] font-light leading-[128%] border focus:outline-none transition-colors",
        padding,
        fontSize,
        margin,
        selected
          ? "border-blue-500 outline outline-1 outline-blue-500 text-black"
          : "border-gray-300 text-black",
        "hover:bg-transparent hover:text-black focus:bg-transparent focus:text-black"
      )}
    >
      {children}
    </button>
  );
};

export default OptionButton;