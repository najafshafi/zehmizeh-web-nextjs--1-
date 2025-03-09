const ErrorMessage = ({ message, children, className }: { children?: any; message?: string; className?: string }) => (
  <small className={`capital-first-ltr text-danger d-block mt-1 ${className}`}>{children || message}</small>
);
export default ErrorMessage;
