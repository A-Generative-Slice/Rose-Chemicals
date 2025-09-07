// Form validation utilities

import React from 'react';

export interface ValidationRule {
  required?: {
    value: boolean;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
  custom?: {
    validate: (value: string) => boolean;
    message: string;
  };
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (name: string, value: string, rule: ValidationRule): string => {
  // Required validation
  if (rule.required?.value && (!value || value.trim() === '')) {
    return rule.required.message;
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === '') {
    return '';
  }

  // Min length validation
  if (rule.minLength && value.length < rule.minLength.value) {
    return rule.minLength.message;
  }

  // Max length validation
  if (rule.maxLength && value.length > rule.maxLength.value) {
    return rule.maxLength.message;
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.value.test(value)) {
    return rule.pattern.message;
  }

  // Custom validation
  if (rule.custom && !rule.custom.validate(value)) {
    return rule.custom.message;
  }

  return '';
};

export const validateForm = (formData: { [key: string]: string }, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach(fieldName => {
    const value = formData[fieldName] || '';
    const rule = rules[fieldName];
    const error = validateField(fieldName, value, rule);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

// Common validation rules
export const commonRules = {
  email: {
    required: {
      value: true,
      message: 'Email is required'
    },
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address'
    }
  },
  
  password: {
    required: {
      value: true,
      message: 'Password is required'
    },
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters long'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password must contain uppercase, lowercase, number and special character'
    }
  },
  
  name: {
    required: {
      value: true,
      message: 'Name is required'
    },
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters long'
    },
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: 'Name can only contain letters and spaces'
    }
  },
  
  phone: {
    required: {
      value: true,
      message: 'Phone number is required'
    },
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: 'Please enter a valid 10-digit phone number'
    }
  },
  
  pincode: {
    required: {
      value: true,
      message: 'Pincode is required'
    },
    pattern: {
      value: /^[1-9][0-9]{5}$/,
      message: 'Please enter a valid 6-digit pincode'
    }
  }
};

// Form hook for managing form state and validation
export const useForm = (initialData: { [key: string]: string }, validationRules: ValidationRules) => {
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [touched, setTouched] = React.useState<{ [key: string]: boolean }>({});

  const setValue = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const setTouchedField = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    if (validationRules[name]) {
      const error = validateField(name, formData[name] || '', validationRules[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateAll = () => {
    const newErrors = validateForm(formData, validationRules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    setValue,
    setTouchedField,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

export default useForm;
