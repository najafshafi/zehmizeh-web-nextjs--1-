interface StyledButtonProps {
    background?: string;
    backgroundColor?: string;
    position?: string;
    top?: string;
    right?: string;
    color?: string;
    minWidth?: string;
    padding?: string;
    fontSize?: string;
    width?: string;
    border?: string;
    shadow?: boolean;
    height?: number;
    children?: React.ReactNode;
  }
  
  export const StyledButton = ({
    background,
    backgroundColor,
    position,
    top,
    right,
    color,
    minWidth,
    padding = "px-8 py-2",
    fontSize = "text-lg",
    width,
    border,
    shadow,
    height,
    children,
  }: StyledButtonProps) => {
    return (
      <button
        className={`${
          background ? `bg-${background} border-none` : ""
        } ${
          backgroundColor ? `bg-${backgroundColor}` : ""
        } ${position ? position : ""} ${
          top ? `top-${top}` : ""
        } ${right ? `right-${right}` : ""} ${color ? `text-${color}` : ""} ${
          minWidth ? `min-w-${minWidth}` : ""
        } ${padding} ${fontSize} text-center rounded-full min-h-[56px] ${
          shadow
            ? "shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-200"
            : ""
        } ${width ? `w-${width}` : ""} ${border ? `border-${border}` : ""}`}
        style={{ height: height ? `${height}px` : undefined }}
      >
        {children}
      </button>
    );
  };