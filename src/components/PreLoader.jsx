import Aurora from "./Aurora/Aurora";
import { useState, useEffect } from "react";
import CountUp from "./CountUp/CountUp";
import { motion as Motion } from "framer-motion";

const PreLoader = () => {
  const [loading, setLoading] = useState(true);
  const [countDone, setCountDone] = useState(false);
  const [fadeText, setFadeText] = useState(false);
  const [fadeScreen, setFadeScreen] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // Show particles animation after a short delay
    const particlesTimer = setTimeout(() => setShowParticles(true), 500);

    if (countDone) {
      // Fade text with a longer delay for better visual effect
      const fadeTextTimer = setTimeout(() => setFadeText(true), 1500);

      // Fade entire screen
      const fadeScreenTimer = setTimeout(() => setFadeScreen(true), 2500);

      // Unmount preloader after fade animation completes
      const hideTimer = setTimeout(() => setLoading(false), 3500);

      return () => {
        clearTimeout(particlesTimer);
        clearTimeout(fadeTextTimer);
        clearTimeout(fadeScreenTimer);
        clearTimeout(hideTimer);
      };
    }

    return () => {
      clearTimeout(particlesTimer);
    };
  }, [countDone]);

  return (
    loading && (
      <div
        className={`w-screen h-screen fixed flex items-center justify-center bg-black z-[10000] overflow-hidden transition-opacity duration-1000 ${
          fadeScreen ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Enhanced Aurora background with more vibrant colors */}
        <Aurora
          colorStops={["#4A00E0", "#1F97A6", "#8E2DE2"]}
          blend={0.6}
          amplitude={1.2}
          speed={0.7}
        />

        {/* Animated particles background */}
        {showParticles && (
          <div className="absolute inset-0 z-0">
            {[...Array(20)].map((_, i) => (
              <Motion.div
                key={i}
                className="absolute rounded-full bg-white/20"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                }}
              />
            ))}
          </div>
        )}

        {/* Animated loading text container */}
        <Motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute text-white text-6xl font-bold transition-all duration-1000 ${
            fadeText ? "opacity-0 -translate-y-10" : "opacity-100 translate-y-0"
          }`}
        >
          <CountUp
            from={0}
            to={100}
            separator=","
            direction="up"
            duration={1.5}
            className="count-up-text relative"
            onEnd={() => setCountDone(true)}
          />
          <span className="absolute -right-8 top-0 text-2xl font-light opacity-80">
            %
          </span>
        </Motion.div>

        {/* Loading text below counter */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`absolute mt-24 text-white/70 text-xl font-light transition-all duration-1000 ${
            fadeText ? "opacity-0 translate-y-10" : "opacity-70 translate-y-0"
          }`}
        >
          Loading Experience
        </Motion.div>
      </div>
    )
  );
};

export default PreLoader;
