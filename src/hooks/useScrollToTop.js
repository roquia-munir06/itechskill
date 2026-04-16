// hooks/useScrollToTop.js
import { useEffect } from 'react';

export const useScrollToTop = () => {
  useEffect(() => {
    console.log('Scrolling to top...');
    
    // Multiple methods to ensure scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // For modern browsers
    if (window.scrollY > 0) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, []);
};