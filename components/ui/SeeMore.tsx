import React from "react";

interface SeeMoreProps {
  children: React.ReactNode;
  fontSize?: string;
  className?: string;
  onClick?: () => void;
}

export const SeeMore: React.FC<SeeMoreProps> = ({
  children,
  fontSize = "0.8rem",
  className = "",
  ...props
}) => {
  return (
    <span
      className={`text-primary inline cursor-pointer font-normal ${className}`}
      style={{ fontSize }}
      {...props}
    >
      {children}
    </span>
  );
};
