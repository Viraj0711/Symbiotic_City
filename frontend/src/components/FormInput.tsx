import React, { forwardRef } from 'react';
import { useUniqueId } from '../hooks/useAccessibility';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
  inputSize?: 'sm' | 'md' | 'lg';
  isInvalid?: boolean;
  isRequired?: boolean;
  showPasswordToggle?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      isInvalid = false,
      isRequired = false,
      showPasswordToggle = false,
      className = '',
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const uniqueId = useUniqueId('form-input');
    const inputId = id || uniqueId;
    const errorId = `${inputId}-error`;
    const helpId = `${inputId}-help`;

    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;

    const baseClasses = 'block w-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
    
    const variantClasses = {
      default: 'border border-gray-300 rounded-md bg-white focus:ring-emerald-500 focus:border-emerald-500',
      filled: 'border-0 bg-gray-100 rounded-md focus:ring-emerald-500 focus:bg-white',
      outline: 'border-2 border-gray-200 rounded-md bg-transparent focus:ring-emerald-500 focus:border-emerald-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const invalidClasses = isInvalid 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : '';

    const disabledClasses = props.disabled 
      ? 'opacity-50 cursor-not-allowed bg-gray-100' 
      : '';

    const inputClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[inputSize]}
      ${invalidClasses}
      ${disabledClasses}
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon || (type === 'password' && showPasswordToggle) ? 'pr-10' : ''}
      ${className}
    `.trim();

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="space-y-1">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {isRequired && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">
                {leftIcon}
              </div>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={inputClasses}
            aria-invalid={isInvalid}
            aria-describedby={`${error ? errorId : ''} ${helpText ? helpId : ''}`.trim() || undefined}
            aria-required={isRequired}
            {...props}
          />

          {/* Right Icon or Password Toggle */}
          {(rightIcon || (type === 'password' && showPasswordToggle)) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {type === 'password' && showPasswordToggle ? (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              ) : (
                <div className="text-gray-400 pointer-events-none">
                  {rightIcon}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help Text */}
        {helpText && !error && (
          <p
            id={helpId}
            className="text-sm text-gray-600"
          >
            {helpText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <div
            id={errorId}
            className="flex items-center space-x-1 text-red-600"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;