// Simple validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return typeof password === 'string' && password.length >= 8;
};

export const validateRequired = (value: any): boolean => {
  return value !== null && value !== undefined && value !== '';
};

export const validateString = (value: any, minLength = 1, maxLength = 1000): boolean => {
  return typeof value === 'string' && value.length >= minLength && value.length <= maxLength;
};

export const validateNumber = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value);
};

export const userValidation = {
  create: {
    validate: (data: any) => {
      const errors = [];
      
      if (!validateRequired(data.name) || !validateString(data.name, 2, 100)) {
        errors.push('Name must be between 2 and 100 characters');
      }
      
      if (!validateRequired(data.email) || !validateEmail(data.email)) {
        errors.push('Valid email is required');
      }
      
      if (!validateRequired(data.password) || !validatePassword(data.password)) {
        errors.push('Password must be at least 8 characters');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  },
  
  update: {
    validate: (data: any) => {
      const errors = [];
      
      if (data.name && (!validateString(data.name, 2, 100))) {
        errors.push('Name must be between 2 and 100 characters');
      }
      
      if (data.email && !validateEmail(data.email)) {
        errors.push('Valid email is required');
      }
      
      if (data.password && !validatePassword(data.password)) {
        errors.push('Password must be at least 8 characters');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  },
  
  login: {
    validate: (data: any) => {
      const errors = [];
      
      if (!validateRequired(data.email) || !validateEmail(data.email)) {
        errors.push('Valid email is required');
      }
      
      if (!validateRequired(data.password)) {
        errors.push('Password is required');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  }
};

export const projectValidation = {
  create: {
    validate: (data: any) => {
      const errors = [];
      
      if (!validateRequired(data.title) || !validateString(data.title, 3, 100)) {
        errors.push('Title must be between 3 and 100 characters');
      }
      
      if (!validateRequired(data.description) || !validateString(data.description, 10, 1000)) {
        errors.push('Description must be between 10 and 1000 characters');
      }
      
      if (!validateRequired(data.category) || !validateString(data.category, 2, 50)) {
        errors.push('Category is required');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  },
  
  update: {
    validate: (data: any) => {
      const errors = [];
      
      if (data.title && !validateString(data.title, 3, 100)) {
        errors.push('Title must be between 3 and 100 characters');
      }
      
      if (data.description && !validateString(data.description, 10, 1000)) {
        errors.push('Description must be between 10 and 1000 characters');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  }
};

export const eventValidation = {
  create: {
    validate: (data: any) => {
      const errors = [];
      
      if (!validateRequired(data.title) || !validateString(data.title, 3, 100)) {
        errors.push('Title must be between 3 and 100 characters');
      }
      
      if (!validateRequired(data.description) || !validateString(data.description, 10, 1000)) {
        errors.push('Description must be between 10 and 1000 characters');
      }
      
      if (!validateRequired(data.date)) {
        errors.push('Event date is required');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  },
  
  update: {
    validate: (data: any) => {
      const errors = [];
      
      if (data.title && !validateString(data.title, 3, 100)) {
        errors.push('Title must be between 3 and 100 characters');
      }
      
      if (data.description && !validateString(data.description, 10, 1000)) {
        errors.push('Description must be between 10 and 1000 characters');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  }
};

export const postValidation = {
  create: {
    validate: (data: any) => {
      const errors = [];
      
      if (!validateRequired(data.title) || !validateString(data.title, 3, 200)) {
        errors.push('Title must be between 3 and 200 characters');
      }
      
      if (!validateRequired(data.content) || !validateString(data.content, 10, 5000)) {
        errors.push('Content must be between 10 and 5000 characters');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  },
  
  update: {
    validate: (data: any) => {
      const errors = [];
      
      if (data.title && !validateString(data.title, 3, 200)) {
        errors.push('Title must be between 3 and 200 characters');
      }
      
      if (data.content && !validateString(data.content, 10, 5000)) {
        errors.push('Content must be between 10 and 5000 characters');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  }
};

export const cityDataValidation = {
  create: {
    validate: (data: any) => {
      const errors = [];
      
      if (!validateRequired(data.metric_name) || !validateString(data.metric_name, 2, 100)) {
        errors.push('Metric name must be between 2 and 100 characters');
      }
      
      if (!validateRequired(data.value) || !validateNumber(data.value)) {
        errors.push('Value must be a valid number');
      }
      
      if (!validateRequired(data.unit) || !validateString(data.unit, 1, 20)) {
        errors.push('Unit is required');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  },
  
  update: {
    validate: (data: any) => {
      const errors = [];
      
      if (data.value && !validateNumber(data.value)) {
        errors.push('Value must be a valid number');
      }
      
      if (data.unit && !validateString(data.unit, 1, 20)) {
        errors.push('Unit must be between 1 and 20 characters');
      }
      
      return {
        error: errors.length > 0 ? { details: [{ message: errors[0] }] } : null
      };
    }
  }
};
