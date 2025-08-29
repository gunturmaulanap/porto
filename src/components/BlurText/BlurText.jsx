import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion, getMotionConfig } from '../../hooks/useReducedMotion';
import { SplitText } from '../../utils/splitText';

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  onAnimationComplete,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useGSAP(() => {
    if (!ref.current || !inView) return;

    const splitter = new SplitText(ref.current, {
      type: animateBy,
      wordsClass: 'blur-word',
      charsClass: 'blur-char'
    });

    const elements = animateBy === 'words' ? splitter.words : splitter.chars;
    
    const motionConfig = getMotionConfig({
      duration: 0.8,
      ease: 'power3.out',
      stagger: delay / 1000
    }, prefersReducedMotion);

    const fromVars = {
      filter: 'blur(8px)',
      opacity: 0,
      y: direction === 'top' ? -16 : 16,
      z: -20
    };

    const toVars = {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      z: 0
    };

    gsap.set(elements, fromVars);
    gsap.to(elements, {
      ...toVars,
      ...motionConfig,
      onComplete: onAnimationComplete
    });

    return () => {
      splitter.revert();
    };
  }, { dependencies: [inView], scope: ref });

  return (
    <p
      ref={ref}
      className={className}
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        transformStyle: 'preserve-3d'
      }}
    >
      {text}
    </p>
  );
};

export default BlurText;