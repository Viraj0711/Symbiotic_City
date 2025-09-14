import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  number?: boolean;
  min?: number;
  max?: number;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormField {
  value: any;
  rules?: ValidationRule;
  touched?: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

// Pre-defined validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
  number: /^\d+(\.\d+)?$/,
};

// Validation messages
const messages = {
  required: 'This field is required',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  number: 'Please enter a valid number',
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be no more than ${max}`,
  pattern: 'Please enter a valid value',
};

// Individual field validation
export const validateField = (value: any, rules?: ValidationRule): string => {
  if (!rules) return '';

  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return messages.required;
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return '';
  }

  // String-based validations
  if (typeof value === 'string') {
    // Min length
    if (rules.minLength && value.length < rules.minLength) {
      return messages.minLength(rules.minLength);
    }

    // Max length
    if (rules.maxLength && value.length > rules.maxLength) {
      return messages.maxLength(rules.maxLength);
    }

    // Email validation
    if (rules.email && !patterns.email.test(value)) {
      return messages.email;
    }

    // Phone validation
    if (rules.phone && !patterns.phone.test(value)) {
      return messages.phone;
    }

    // URL validation
    if (rules.url && !patterns.url.test(value)) {
      return messages.url;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return messages.pattern;
    }
  }

  // Number-based validations
  if (rules.number) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) {
      return messages.number;
    }

    if (rules.min !== undefined && num < rules.min) {
      return messages.min(rules.min);
    }

    if (rules.max !== undefined && num > rules.max) {
      return messages.max(rules.max);
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) return customError;
  }

  return '';
};

// Form validation hook
export const useFormValidation = (initialState: FormState) => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValid, setIsValid] = useState(false);

  // Update field value and validation
  const updateField = useCallback((fieldName: string, value: any, shouldValidate = true) => {
    setFormState(prev => {
      const newState = {
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          value,
          touched: shouldValidate ? true : prev[fieldName]?.touched || false,
        },
      };

      // Validate if needed
      if (shouldValidate) {
        const error = validateField(value, newState[fieldName].rules);
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          if (error) {
            newErrors[fieldName] = error;
          } else {
            delete newErrors[fieldName];
          }
          return newErrors;
        });
      }

      return newState;
    });
  }, []);

  // Validate all fields
  const validateAll = useCallback(() => {
    const newErrors: ValidationErrors = {};
    let formIsValid = true;

    Object.entries(formState).forEach(([fieldName, field]) => {
      const error = validateField(field.value, field.rules);
      if (error) {
        newErrors[fieldName] = error;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [formState]);

  // Mark field as touched
  const touchField = useCallback((fieldName: string) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched: true,
      },
    }));

    // Validate the field if it exists
    if (formState[fieldName]) {
      const error = validateField(formState[fieldName].value, formState[fieldName].rules);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[fieldName] = error;
        } else {
          delete newErrors[fieldName];
        }
        return newErrors;
      });
    }
  }, [formState]);

  // Get field props for easy integration with form inputs
  const getFieldProps = useCallback((fieldName: string) => {
    const field = formState[fieldName] || { value: '', touched: false };
    const hasError = errors[fieldName] && field.touched;

    return {
      value: field.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        updateField(fieldName, e.target.value);
      },
      onBlur: () => touchField(fieldName),
      error: hasError ? errors[fieldName] : '',
      isInvalid: !!hasError,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `${fieldName}-error` : undefined,
    };
  }, [formState, errors, updateField, touchField]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormState(initialState);
    setErrors({});
    setIsValid(false);
  }, [initialState]);

  // Get form values
  const getFormValues = useCallback(() => {
    const values: { [key: string]: any } = {};
    Object.entries(formState).forEach(([key, field]) => {
      values[key] = field.value;
    });
    return values;
  }, [formState]);

  return {
    formState,
    errors,
    isValid: Object.keys(errors).length === 0,
    updateField,
    validateAll,
    touchField,
    getFieldProps,
    resetForm,
    getFormValues,
  };
};

export default useFormValidation;