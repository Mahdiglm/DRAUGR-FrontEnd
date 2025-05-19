import React, { useState } from 'react';

/**
 * LazyImage Component
 * 
 * A reusable component for lazy loading images with loading and error states
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alternative text for the image
 * @param {string} className - CSS classes to apply to the image
 * @param {Object} imgProps - Additional props to pass to the img element
 */
const LazyImage = ({ src, alt, className = '', imgProps = {} }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
  };

  return (
    <div className={`${className} relative overflow-hidden`}>
      {/* Loading state */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-draugr-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-2 text-gray-400 text-sm">تصویر در دسترس نیست</p>
        </div>
      )}
      
      {/* Actual image */}
      <img 
        src={src} 
        alt={alt} 
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        {...imgProps}
      />
    </div>
  );
};

export default LazyImage; 