import React from "react";

const ErrorMessage = ({
  message,
  children,
  className,
}: {
  children?: React.ReactNode;
  message?: string;
  className?: string;
}) => (
  <small className={`capital-first-ltr text-red-500 block mt-1 ${className}`}>
    {children || message}
  </small>
);
export default ErrorMessage;
