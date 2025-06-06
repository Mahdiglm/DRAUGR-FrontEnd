import DOMPurify from 'dompurify';

// XSS Protection Utilities
export const xssProtection = {
  // Sanitize HTML content
  sanitizeHtml: (htmlString, options = {}) => {
    if (typeof htmlString !== 'string') return '';
    
    const defaultConfig = {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
      ALLOWED_URI_REGEXP: /^https?:\/\/|^\/|^mailto:|^tel:/i,
      FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror'],
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
      ...options
    };
    
    return DOMPurify.sanitize(htmlString, defaultConfig);
  },

  // Sanitize user input for display
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Clean text content (remove HTML tags completely)
  stripHtml: (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/<[^>]*>/g, '');
  },

  // Validate URLs
  validateUrl: (url) => {
    if (typeof url !== 'string') return false;
    
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  // Sanitize URL
  sanitizeUrl: (url) => {
    if (!xssProtection.validateUrl(url)) return '#';
    return url;
  }
};

// Input Validation
export const inputValidation = {
  // Email validation
  validateEmail: (email) => {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  // Password validation
  validatePassword: (password) => {
    if (typeof password !== 'string') return { isValid: false, errors: ['Password must be a string'] };
    
    const errors = [];
    
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (password.length > 128) errors.push('Password must be less than 128 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must contain at least one special character');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Name validation
  validateName: (name) => {
    if (typeof name !== 'string') return false;
    const nameRegex = /^[a-zA-Zآ-ی\s]{2,50}$/;
    return nameRegex.test(name.trim());
  },

  // Phone validation (Iranian format)
  validatePhone: (phone) => {
    if (typeof phone !== 'string') return false;
    const phoneRegex = /^(\+98|0)?9[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  },

  // Sanitize and validate text input
  sanitizeAndValidateText: (text, maxLength = 1000) => {
    if (typeof text !== 'string') return '';
    
    const sanitized = xssProtection.sanitizeInput(text.trim());
    return sanitized.length <= maxLength ? sanitized : sanitized.substring(0, maxLength);
  }
};

// CSRF Protection
export const csrfProtection = {
  // Generate CSRF token
  generateToken: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Set CSRF token in meta tag
  setToken: (token) => {
    let metaTag = document.querySelector('meta[name="csrf-token"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      document.head.appendChild(metaTag);
    }
    metaTag.content = token;
  },

  // Get CSRF token from meta tag
  getToken: () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : null;
  }
};

// Content Security Policy helpers
export const cspHelpers = {
  // Check if current origin is allowed
  isOriginAllowed: (url) => {
    try {
      const urlObj = new URL(url);
      const allowedOrigins = [
        window.location.origin,
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net'
      ];
      
      return allowedOrigins.includes(urlObj.origin);
    } catch {
      return false;
    }
  },

  // Sanitize inline styles (remove potentially dangerous properties)
  sanitizeInlineStyles: (styleString) => {
    if (typeof styleString !== 'string') return '';
    
    const dangerousProperties = [
      'javascript:',
      'expression',
      'vbscript:',
      'data:',
      'behavior',
      '-moz-binding',
      '@import'
    ];
    
    let sanitized = styleString;
    dangerousProperties.forEach(prop => {
      const regex = new RegExp(prop, 'gi');
      sanitized = sanitized.replace(regex, '');
    });
    
    return sanitized;
  }
};

// Rate limiting for API calls
export const rateLimiter = {
  requests: new Map(),
  
  // Check if request is within rate limit
  checkLimit: (endpoint, limit = 10, windowMs = 60000) => {
    const now = Date.now();
    const key = endpoint;
    
    if (!rateLimiter.requests.has(key)) {
      rateLimiter.requests.set(key, []);
    }
    
    const timestamps = rateLimiter.requests.get(key);
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(time => now - time < windowMs);
    
    if (validTimestamps.length >= limit) {
      return false;
    }
    
    validTimestamps.push(now);
    rateLimiter.requests.set(key, validTimestamps);
    
    return true;
  }
};

// Secure form helpers
export const secureFormHelpers = {
  // Create secure form data
  createSecureFormData: (formData) => {
    const secureData = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        secureData[key] = inputValidation.sanitizeAndValidateText(value);
      } else {
        secureData[key] = value;
      }
    }
    
    return secureData;
  },

  // Validate form data structure
  validateFormStructure: (formData, expectedFields) => {
    const errors = [];
    
    // Check for unexpected fields
    for (const field in formData) {
      if (!expectedFields.includes(field)) {
        errors.push(`Unexpected field: ${field}`);
      }
    }
    
    // Check for missing required fields
    for (const field of expectedFields) {
      if (!(field in formData)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Secure storage helpers
export const secureStorage = {
  // Encrypt data before storing (simple base64 encoding for now)
  setSecureItem: (key, data) => {
    try {
      const jsonString = JSON.stringify(data);
      const encoded = btoa(unescape(encodeURIComponent(jsonString)));
      localStorage.setItem(key, encoded);
      return true;
    } catch (error) {
      console.error('Error storing secure item:', error);
      return false;
    }
  },

  // Decrypt data after retrieving
  getSecureItem: (key) => {
    try {
      const encoded = localStorage.getItem(key);
      if (!encoded) return null;
      
      const jsonString = decodeURIComponent(escape(atob(encoded)));
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      return null;
    }
  },

  // Remove secure item
  removeSecureItem: (key) => {
    localStorage.removeItem(key);
  }
};

// Security middleware for React components
export const securityMiddleware = {
  // HOC for securing component props
  withSecurityValidation: (WrappedComponent, validation = {}) => {
    return function SecurityValidatedComponent(props) {
      const secureProps = {};
      
      for (const [key, value] of Object.entries(props)) {
        if (validation[key]) {
          secureProps[key] = validation[key](value);
        } else if (typeof value === 'string') {
          secureProps[key] = xssProtection.sanitizeInput(value);
        } else {
          secureProps[key] = value;
        }
      }
      
      return <WrappedComponent {...secureProps} />;
    };
  }
};

export default {
  xssProtection,
  inputValidation,
  csrfProtection,
  cspHelpers,
  rateLimiter,
  secureFormHelpers,
  secureStorage,
  securityMiddleware
}; 