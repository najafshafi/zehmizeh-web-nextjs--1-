import React from "react";

interface PageTitleProps {
  children: React.ReactNode;
  fontSize?: string;
  className?: string;
}

const PageTitle = ({
  children,
  fontSize,
  className = ""
}: PageTitleProps) => {
  return (
    <h1
      className={`font-normal mt-5 capitalize break-words md:text-[3.25rem] text-2xl ${className}`}
      style={fontSize ? { fontSize } : undefined}
    >
      {children}
    </h1>
  );
};

export default PageTitle;
