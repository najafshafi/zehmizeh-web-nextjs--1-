"use client"

type CustomButtonProps = {
  className?: string;
  text: string;
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
      className={`${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default CustomButton;