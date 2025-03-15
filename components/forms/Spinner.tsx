// components/Spinner.tsx
import React from 'react';

interface SpinnerProps {
  color?: string; // Optional color prop
  size?: 'sm' | 'md' | 'lg'; // Optional size prop
  visible?: boolean; // Control visibility
}

const Spinner: React.FC<SpinnerProps> = ({
  color = 'text-blue-500', // Default Tailwind color (Bootstrap-like primary)
  size = 'md', // Default size
  visible = false, // Hidden by default
}) => {
  // Size mapping to Tailwind classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`inline-block ${visible ? 'block' : 'hidden'}`}
      aria-label="Loading"
    >
      <div
        className={`
          animate-spin
          rounded-full
          border-4
          border-t-transparent
          ${color}
          ${sizeClasses[size]}
        `}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;