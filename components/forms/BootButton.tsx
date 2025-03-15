import React from 'react';

interface BootButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-light' | 'outline-dark';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
  block?: boolean;
  loading?: boolean;
}

const variantStyles = {
  'primary': 'bg-[#FFD600] text-black hover:bg-[#e6c200] focus:ring-yellow-500',
  'secondary': 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  'success': 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  'danger': 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  'warning': 'bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-400',
  'info': 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400',
  'light': 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300',
  'dark': 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700',
  'link': 'bg-transparent text-blue-600 hover:text-blue-700 hover:underline',
  'outline-primary': 'border-2 border-[#FFD600] text-[#FFD600] hover:bg-[#FFD600] hover:text-black',
  'outline-secondary': 'border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white',
  'outline-success': 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
  'outline-danger': 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
  'outline-warning': 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black',
  'outline-info': 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
  'outline-light': 'border-2 border-gray-100 text-gray-100 hover:bg-gray-100 hover:text-gray-800',
  'outline-dark': 'border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
};

const sizeStyles = {
  'sm': 'px-3 py-1.5 text-sm',
  'md': 'px-4 py-2 text-base',
  'lg': 'px-6 py-3 text-lg'
};

const Spinner = () => (
  <div className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent rounded-full ml-2" />
);

export const BootButton = React.forwardRef<HTMLButtonElement, BootButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      active = false,
      disabled = false,
      block = false,
      loading = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
    
    const classes = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      block ? 'w-full' : '',
      active ? 'ring-2 ring-offset-2' : '',
      className
    ].filter(Boolean).join(' ');

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

BootButton.displayName = 'BootButton';

export default BootButton; 