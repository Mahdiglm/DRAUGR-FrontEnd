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