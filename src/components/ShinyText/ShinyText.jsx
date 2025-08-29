import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion, getMotionConfig } from '../../hooks/useReducedMotion';
import './ShinyText.css';

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!ref.current || disabled || prefersReducedMotion) return;

    const motionConfig = getMotionConfig({
      duration: speed,
      ease: 'none',
      repeat: -1
    }, prefersReducedMotion);

    gsap.to(ref.current, {
      backgroundPosition: '-200% 0',
      ...motionConfig
    });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{ 
        transformStyle: 'preserve-3d',
        willChange: disabled || prefersReducedMotion ? 'auto' : 'background-position'
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
