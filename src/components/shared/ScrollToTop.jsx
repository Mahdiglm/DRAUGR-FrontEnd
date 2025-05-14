import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Set scroll behavior to auto to ensure immediate scrolling
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Multiple scroll methods for better browser compatibility
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    
    // Small delay to ensure all content has started rendering
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default ScrollToTop; 