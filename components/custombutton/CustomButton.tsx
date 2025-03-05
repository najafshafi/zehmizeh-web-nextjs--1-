"use client"


type CustomButtonProps = {
  className?: string;
  text: string;
  onClick: () => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  className,
  text,
  onClick,
}) => {
  return (
    <button
      className={`${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CustomButton;
