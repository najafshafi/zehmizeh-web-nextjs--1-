"use client"
import React, { ReactNode } from 'react';

type CustomButtonProps = {
  className?: string;
  text: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  className,
  text,
  onClick,
  disabled,
}) => {
  return (
    <button
      className={`${className} flex justify-center content-center`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default CustomButton;