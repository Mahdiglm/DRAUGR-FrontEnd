/**
 * Animation helper functions to prevent common issues
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
  // Check if touch device (mobile/tablet)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check screen size (mobile is typically under 768px width)
  const isSmallScreen = window.innerWidth <= 768;
  
  // Check for hardware concurrency (CPU cores) - low-end devices have fewer cores
  const hasLowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  
  // Check for Android device which might have performance issues
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  return (isTouchDevice && isSmallScreen) || hasLowCPU || isAndroid;
};

/**
 * Provides optimized animation settings based on device capability
 * @param {Object} defaultSettings - The default animation settings
 * @param {Object} optimizedSettings - The optimized settings for low-performance devices
 * @returns {Object} The appropriate settings for the current device
 */
export const getOptimizedAnimationSettings = (defaultSettings, optimizedSettings) => {
  return isLowPerformanceDevice() ? optimizedSettings : defaultSettings;
}; 