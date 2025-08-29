import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTheme } from '../../hooks/useTheme';
import { useReducedMotion, getMotionConfig } from '../../hooks/useReducedMotion';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const iconRef = useRef(null);

  const handleToggle = () => {
    // Animate the toggle
    if (!prefersReducedMotion && iconRef.current) {
      const motionConfig = getMotionConfig({
        duration: 0.6,
        ease: 'power2.inOut'
      }, prefersReducedMotion);

      gsap.to(iconRef.current, {
        rotateY: 180,
        scale: 0.8,
        ...motionConfig,
        onComplete: () => {
          toggleTheme();
          gsap.set(iconRef.current, { rotateY: 0 });
          gsap.to(iconRef.current, {
            scale: 1,
            duration: motionConfig.duration * 0.5,
            ease: 'back.out(1.7)'
          });
        }
      });
    } else {
      toggleTheme();
    }
  };

  useGSAP(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    // Floating animation
    gsap.to(containerRef.current, {
      y: -2,
      duration: 2,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });
  }, { scope: containerRef });

  return (
    <button
      ref={containerRef}
      onClick={handleToggle}
      className={`
        relative p-3 rounded-full glass btn-3d
        hover:glow-primary focus:glow-primary
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary/50
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        color: 'var(--text)'
      }}
    >
      <div
        ref={iconRef}
        className="w-5 h-5 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {isDark ? <FiMoon /> : <FiSun />}
      </div>
    </button>
  );
};

export default ThemeToggle;