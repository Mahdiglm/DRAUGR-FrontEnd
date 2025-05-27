/**
 * Animation Helper Utilities
 * 
 * Provides utilities for optimizing animations based on device performance
 * and reducing resource consumption.
 */

/**
 * Creates a safe blur filter string that ensures the blur value is never negative
 * @param {number} pixels - The blur amount in pixels
 * @returns {string} A valid CSS blur filter string
 */
export const safeBlur = (pixels) => {
  // Ensure the blur value is never negative
  const safePixels = Math.max(0, pixels);
  return `blur(${safePixels}px)`;
};

/**
 * Creates safe filter transitions for Framer Motion
 * @param {Object} options - Options for the transition
 * @returns {Object} A safe transition configuration
 */
export const safeFilterTransition = (options = {}) => {
  return {
    // Use a simple tween instead of spring to avoid negative values
    type: "tween",
    ease: "linear",
    ...options
  };
};

/**
 * Utility function to use in Framer Motion animate variants
 * to create non-negative blur animations
 * @param {number[]} blurValues - An array of blur amounts [from, to]
 * @returns {Array} An array of safe blur filter strings
 */
export const safeBlurAnimation = (blurValues) => {
  return blurValues.map(val => safeBlur(val));
};

/**
 * Detects if the current device is likely a mobile or low-performance device
 * @returns {boolean} True if the device is mobile or likely low-performance
 */
export const isLowPerformanceDevice = () => {
  // Check if running in a browser environment
  if (typeof window === 'undefined') return false;
  
  // Check if it's a mobile device (generally lower performance)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
  
  // Check for low memory (if available)
  const hasLowMemory = 
    navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
  
  // Check for low number of logical processors (if available)
  const hasLowCPU = 
    navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4;
  
  // Check if the device is low-end Android
  const isLowEndAndroid = 
    /Android/.test(navigator.userAgent) && 
    (/Android [1-5]\./.test(navigator.userAgent) || 
     /Android.*Mobile/.test(navigator.userAgent));
  
  return isMobile && (hasLowMemory || hasLowCPU || isLowEndAndroid);
};

/**
 * Check if the browser supports requestAnimationFrame at 60fps
 * @returns {boolean} True if the browser supports requestAnimationFrame at 60fps
 */
export const hasReducedMotion = () => {
  // Check if running in a browser environment
  if (typeof window === 'undefined') return false;
  
  // Check if the user has enabled reduced motion preference
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Provides optimized animation settings based on device capability
 * @param {Object} highPerformanceSettings - The default animation settings
 * @param {Object} lowPerformanceSettings - The optimized settings for low-performance devices
 * @returns {Object} The appropriate settings for the current device
 */
export const getOptimizedAnimationSettings = (
  highPerformanceSettings = {}, 
  lowPerformanceSettings = {}
) => {
  // Default settings for high-performance devices
  const defaultHighPerformance = {
    speed: 1.0,               // Normal speed
    complexity: 1.0,          // Full visual complexity
    particleCount: 100,       // Full number of particles
    frameSkip: 0,             // No frames skipped
    enableBlur: true,         // Enable blur effects
    enableShadows: true,      // Enable shadow effects
    enableTrails: true,       // Enable trail effects
    trailLength: 10,          // Full trail length
  };
  
  // Default settings for low-performance devices
  const defaultLowPerformance = {
    speed: 0.7,               // 70% of normal speed
    complexity: 0.5,          // 50% visual complexity 
    particleCount: 30,        // Reduced particles
    frameSkip: 1,             // Skip every other frame
    enableBlur: false,        // Disable blur effects
    enableShadows: false,     // Disable shadow effects
    enableTrails: false,      // Disable trail effects
    trailLength: 3,           // Reduced trail length
  };
  
  // Merge provided settings with defaults
  const highSettings = { ...defaultHighPerformance, ...highPerformanceSettings };
  const lowSettings = { ...defaultLowPerformance, ...lowPerformanceSettings };
  
  // Choose settings based on device performance and user preferences
  const isLowPerformance = isLowPerformanceDevice();
  const reduceMotion = hasReducedMotion();
  
  // If user prefers reduced motion, use minimal settings regardless of device
  if (reduceMotion) {
    return {
      ...lowSettings,
      speed: 0.5,             // Further reduced speed
      particleCount: 0,       // No particles
      enableTrails: false,    // No trails
      enableBlur: false,      // No blur
      enableShadows: false    // No shadows
    };
  }
  
  return isLowPerformance ? lowSettings : highSettings;
};

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} fn - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} The debounced function
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} fn - The function to throttle
 * @param {number} limit - The maximum frequency in milliseconds
 * @returns {Function} The throttled function
 */
export const throttle = (fn, limit = 16) => { // 16ms = ~60fps
  let inThrottle;
  let lastTime = 0;
  
  return (...args) => {
    const now = Date.now();
    
    if (!inThrottle) {
      fn(...args);
      lastTime = now;
      inThrottle = true;
    } else if (now - lastTime >= limit) {
      fn(...args);
      lastTime = now;
    }
  };
};

/**
 * Batch animation updates to optimize performance
 * @param {Function} callback - The function to batch
 * @param {number} threshold - The maximum number of updates before processing
 * @returns {Function} The batched function
 */
export const batchAnimationUpdates = (callback, threshold = 5) => {
  // Store update requests
  const updates = [];
  let timeoutId = null;
  
  const processUpdates = () => {
    if (updates.length > 0) {
      // Process all updates in a single batch
      callback(updates);
      updates.length = 0;
    }
    timeoutId = null;
  };
  
  // Return a function that collects updates
  return (update) => {
    updates.push(update);
    
    // If we've reached the threshold, process immediately
    if (updates.length >= threshold) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(processUpdates);
    } else if (timeoutId === null) {
      // Schedule processing on the next animation frame
      timeoutId = requestAnimationFrame(processUpdates);
    }
  };
};

export default {
  getOptimizedAnimationSettings,
  debounce,
  throttle,
  batchAnimationUpdates,
  isLowPerformanceDevice,
  hasReducedMotion
}; 