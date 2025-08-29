import { useState, useEffect } from 'react';

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

// Utility function to get motion-safe duration
export const getMotionDuration = (duration, prefersReducedMotion = false) => {
  return prefersReducedMotion ? 0.01 : duration;
};

// Utility function to get motion-safe config for GSAP
export const getMotionConfig = (config = {}, prefersReducedMotion = false) => {
  if (prefersReducedMotion) {
    return {
      ...config,
      duration: 0.01,
      ease: 'none'
    };
  }
  return config;
};