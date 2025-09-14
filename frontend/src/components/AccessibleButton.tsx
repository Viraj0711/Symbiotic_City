import React, { forwardRef } from 'react';
import { useKeyboardNavigation } from '../hooks/useAccessibility';
import LoadingSpinner from './LoadingSpinner';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText = 'Loading...',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      ariaLabel,
      ariaDescribedBy,
      onClick,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const { handleKeyDown } = useKeyboardNavigation(
      () => {
        if (!isDisabled && onClick) {
          onClick({} as React.MouseEvent<HTMLButtonElement>);
        }
      }
    );

    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border-2 border-emerald-600 text-emerald-600 bg-transparent hover:bg-emerald-50 focus:ring-emerald-500',
      ghost: 'text-emerald-600 bg-transparent hover:bg-emerald-50 focus:ring-emerald-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded',
      md: 'px-4 py-2 text-base rounded-md',
      lg: 'px-6 py-3 text-lg rounded-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const buttonClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${widthClass}
      ${className}
    `.trim();

    const content = loading ? (
      <>
        <LoadingSpinner size="sm" className="mr-2" />
        {loadingText}
      </>
    ) : (
      <>
        {icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={isDisabled}
        {...props}
      >
        {content}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;