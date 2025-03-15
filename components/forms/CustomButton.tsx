import React from 'react';

interface CustomButtonProps {
  background?: string;
  variant?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  [key: string]: any; // Allow additional props to be passed through
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  background,
  variant,
  onClick,
  style = {},
  className = '',
  disabled = false,
  children,
  ...rest
}) => {
  // Base Tailwind classes matching StyledButton's default styles
  let twClasses = [
    'inline-block',
    'text-center',
    'whitespace-nowrap',
    'rounded-[4.8125rem]', // Matches border-radius: 4.8125rem
    'min-h-[56px]',       // Matches min-height: 56px
    'px-8',               // Matches padding: 0 2rem (2rem = 32px)
    'py-2',               // Vertical padding for consistency
    'text-lg',            // Matches font-size: 1.125rem
  ];

  // Styles object to merge background and user-provided styles
  let buttonStyle: React.CSSProperties = { ...style };

  // Handle background prop with inline styles (highest specificity)
  if (background) {
    buttonStyle.backgroundColor = background;
    twClasses.push('border-none'); // Matches original behavior, overridden by style if present
  }
  // Handle variant prop when background is not set
  else if (variant) {
    if (variant === 'primary') {
      twClasses.push('bg-blue-500', 'text-white', 'hover:bg-blue-600');
    } else if (variant === 'light') {
      twClasses.push('bg-gray-100', 'text-gray-800', 'hover:bg-gray-200');
    }
    // Add more variants as needed based on your design system
  }

  // Handle disabled state
  if (disabled) {
    twClasses.push('opacity-50', 'cursor-not-allowed');
  }

  // Combine Tailwind classes with user-provided className
  const finalClassName = twClasses.join(' ') + ' ' + className;

  return (
    <button
      className={finalClassName}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      {...rest} // Pass through any additional props
    >
      {children}
    </button>
  );
};