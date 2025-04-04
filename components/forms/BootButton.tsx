import React from "react";

interface BootButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "link"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger"
    | "outline-warning"
    | "outline-info"
    | "outline-light"
    | "outline-dark";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  disabled?: boolean;
  block?: boolean;
  loading?: boolean;
}

const variantStyles = {
  primary: "bg-[#FFD600] text-black hover:bg-[#e6c200] focus:ring-yellow-500",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Spinner = () => (
  <div className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent rounded-full ml-2" />
);

export const BootButton = React.forwardRef<HTMLButtonElement, BootButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      active = false,
      disabled = false,
      block = false,
      loading = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

    const classes = [
      baseStyles,
      variantStyles[variant as keyof typeof variantStyles],
      sizeStyles[size],
      block ? "w-full" : "",
      active ? "ring-2 ring-offset-2" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading ? (
          <>
            {children}
            <Spinner />
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

BootButton.displayName = "BootButton";

export default BootButton;
