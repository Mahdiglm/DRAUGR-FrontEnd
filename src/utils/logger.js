// Logger utility to manage console output and prevent spam

const isDevelopment = import.meta.env.DEV;

// Throttling mechanism
const logThrottles = new Map();

const shouldLog = (key, throttleMs = 1000) => {
  if (!isDevelopment) return false;
  
  const now = Date.now();
  const lastTime = logThrottles.get(key) || 0;
  
  if (now - lastTime > throttleMs) {
    logThrottles.set(key, now);
    return true;
  }
  return false;
};

export const logger = {
  // Regular log with throttling
  log: (message, data = null, throttleKey = null, throttleMs = 1000) => {
    if (!isDevelopment) return;
    
    const key = throttleKey || message.substring(0, 50);
    if (shouldLog(key, throttleMs)) {
      data ? console.log(message, data) : console.log(message);
    }
  },
  
  // Error logs (always shown in dev)
  error: (message, error = null) => {
    if (!isDevelopment) return;
    error ? console.error(message, error) : console.error(message);
  },
  
  // Warning logs with throttling
  warn: (message, data = null, throttleMs = 2000) => {
    if (!isDevelopment) return;
    
    const key = message.substring(0, 50);
    if (shouldLog(key, throttleMs)) {
      data ? console.warn(message, data) : console.warn(message);
    }
  },
  
  // Debug logs (heavily throttled)
  debug: (message, data = null, throttleMs = 5000) => {
    if (!isDevelopment) return;
    
    const key = message.substring(0, 30);
    if (shouldLog(key, throttleMs)) {
      data ? console.debug(message, data) : console.debug(message);
    }
  },
  
  // One-time logs (only logs once per session)
  once: (key, message, data = null) => {
    if (!isDevelopment) return;
    
    if (!window.loggedOnce) window.loggedOnce = new Set();
    
    if (!window.loggedOnce.has(key)) {
      data ? console.log(message, data) : console.log(message);
      window.loggedOnce.add(key);
    }
  }
};

export default logger;