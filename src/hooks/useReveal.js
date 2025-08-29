import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion, getMotionConfig } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const useReveal = (options = {}) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  const {
    direction = 'up', // 'up', 'down', 'left', 'right', 'scale', 'depth'
    distance = 40,
    duration = 0.8,
    delay = 0,
    stagger = 0.1,
    once = true,
    threshold = 0.1,
    childSelector = null,
    ease = 'power3.out'
  } = options;

  useGSAP(() => {
    if (!ref.current) return;

    const element = ref.current;
    const children = childSelector ? element.querySelectorAll(childSelector) : [element];
    
    // Initial state based on direction
    let fromVars = { opacity: 0 };
    let toVars = { opacity: 1 };
    
    switch (direction) {
      case 'up':
        fromVars.y = distance;
        fromVars.z = -20;
        toVars.y = 0;
        toVars.z = 0;
        break;
      case 'down':
        fromVars.y = -distance;
        fromVars.z = -20;
        toVars.y = 0;
        toVars.z = 0;
        break;
      case 'left':
        fromVars.x = distance;
        fromVars.z = -20;
        toVars.x = 0;
        toVars.z = 0;
        break;
      case 'right':
        fromVars.x = -distance;
        fromVars.z = -20;
        toVars.x = 0;
        toVars.z = 0;
        break;
      case 'scale':
        fromVars.scale = 0.8;
        fromVars.z = -40;
        toVars.scale = 1;
        toVars.z = 0;
        break;
      case 'depth':
        fromVars.z = -60;
        fromVars.rotateX = 15;
        toVars.z = 0;
        toVars.rotateX = 0;
        break;
    }

    // Apply motion config
    const motionConfig = getMotionConfig({
      duration,
      ease,
      delay,
      stagger: children.length > 1 ? stagger : 0
    }, prefersReducedMotion);

    // Set initial state
    gsap.set(children, fromVars);

    // Create reveal animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: `top ${100 - (threshold * 100)}%`,
        toggleActions: once ? 'play none none none' : 'play none none reverse',
        once
      }
    });

    if (children.length > 1) {
      tl.to(children, {
        ...toVars,
        ...motionConfig,
        stagger: motionConfig.stagger
      });
    } else {
      tl.to(element, {
        ...toVars,
        ...motionConfig
      });
    }

  }, { scope: ref });

  return ref;
};

// Specialized hooks for common patterns
export const useStaggerReveal = (options = {}) => {
  return useReveal({
    childSelector: '.stagger-item',
    stagger: 0.08,
    direction: 'up',
    ...options
  });
};

export const useDepthReveal = (options = {}) => {
  return useReveal({
    direction: 'depth',
    duration: 1.2,
    ease: 'power2.out',
    ...options
  });
};