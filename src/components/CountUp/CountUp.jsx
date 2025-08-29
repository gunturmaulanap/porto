import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion, getMotionConfig } from "../../hooks/useReducedMotion";

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
  cubic = true
}) {
  const ref = useRef(null);
  const numberRef = useRef({ value: direction === "down" ? to : from });
  const [displayText, setDisplayText] = useState(String(direction === "down" ? to : from));
  const [digits, setDigits] = useState([]);
  const [isCounting, setIsCounting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const [isInView, setIsInView] = useState(false);

  const getDecimalPlaces = (num) => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals, 10) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  // Intersection Observer for triggering animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // GSAP Animation
  useGSAP(() => {
    if (!ref.current || !isInView || !startWhen) return;

    const motionConfig = getMotionConfig({
      duration,
      ease: 'power2.out',
      delay
    }, prefersReducedMotion);

    onStart?.();
    setIsCounting(true);

    const target = direction === "down" ? from : to;
    
    gsap.to(numberRef.current, {
      value: target,
      ...motionConfig,
      roundProps: "value",
      onUpdate: () => {
        const latest = numberRef.current.value;
        
        const hasDecimals = maxDecimals > 0;
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: hasDecimals ? maxDecimals : 0,
          maximumFractionDigits: hasDecimals ? maxDecimals : 0,
        };

        const formattedNumber = Intl.NumberFormat("en-US", options).format(latest);
        const formattedText = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;

        setDisplayText(formattedText);
        if (cubic) setDigits(formattedText.split(""));
      },
      onComplete: () => {
        setIsCounting(false);
        onEnd?.();
      }
    });
  }, { dependencies: [isInView, startWhen], scope: ref });

  // Set initial display
  useEffect(() => {
    const startVal = String(direction === "down" ? to : from);
    setDisplayText(startVal);
    setDigits(startVal.split(""));
  }, [from, to, direction]);

  return (
    <span
      ref={ref}
      className={`${className}`}
      style={{ display: "inline-flex" }}
    >
      {cubic && digits.length > 0 && isCounting ? (
        digits.map((digit, index) => (
          <span
            key={`digit-${index}-${digit}`}
            className="digit-animation"
            style={{
              display: "inline-block",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden"
            }}
          >
            {digit}
          </span>
        ))
      ) : (
        <span>{displayText}</span>
      )}
    </span>
  );
}