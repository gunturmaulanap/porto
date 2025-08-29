import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  motion as Motion,
} from "framer-motion";

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2, // hanya untuk status selesai; spring tetap fisik
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
  cubic = true,
}) {
  const wrapperRef = useRef(null);

  // mulai dari 'from' (atau 'to' kalau direction "down")
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const [displayText, setDisplayText] = useState(
    String(direction === "down" ? to : from)
  );
  const [digits, setDigits] = useState([]);
  const [isCounting, setIsCounting] = useState(false);

  // spring params (heuristik biar responsif thd duration)
  const damping = 25 + 40 * (1 / Math.max(0.0001, duration));
  const stiffness = 120 * (1 / Math.max(0.0001, duration));

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
    // catatan: useSpring nggak pakai 'ease'
  });

  const isInView = useInView(wrapperRef, { once: true, margin: "0px" });

  const getDecimalPlaces = (num) => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals, 10) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  // set tampilan awal kalau prop berubah
  useEffect(() => {
    const startVal = String(direction === "down" ? to : from);
    setDisplayText(startVal);
    setDigits(startVal.split(""));
  }, [from, to, direction]);

  // trigger animasi saat in-view & startWhen
  useEffect(() => {
    if (isInView && startWhen) {
      onStart?.();
      setIsCounting(true);

      const target = direction === "down" ? from : to;

      const startId = setTimeout(() => {
        motionValue.set(target);
      }, delay * 1000);

      const endId = setTimeout(() => {
        setIsCounting(false);
        onEnd?.();
      }, (delay + duration) * 1000);

      return () => {
        clearTimeout(startId);
        clearTimeout(endId);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    duration,
  ]);

  // update tampilan setiap spring berubah
  useEffect(() => {
    const unsub = springValue.on("change", (latest) => {
      const hasDecimals = maxDecimals > 0;
      const options = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };

      // jangan Math.abs — biarin minus kalau ada
      const formattedNumber = Intl.NumberFormat("en-US", options).format(
        latest
      );

      const formattedText = separator
        ? formattedNumber.replace(/,/g, separator)
        : formattedNumber;

      setDisplayText(formattedText);
      if (cubic) setDigits(formattedText.split(""));
    });

    return () => unsub();
  }, [springValue, separator, maxDecimals, cubic]);

  // Selalu pasang ref di wrapper supaya useInView jalan
  return (
    <span
      ref={wrapperRef}
      className={`${className}`}
      style={{ display: "inline-flex" }}
    >
      {cubic && digits.length > 0 && isCounting ? (
        digits.map((digit, index) => (
          <Motion.span
            key={`digit-${index}-${digit}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: [90, 0],
              scale: [0.8, 1.2, 1],
            }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            style={{
              display: "inline-block",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {digit}
          </Motion.span>
        ))
      ) : (
        <span>{displayText}</span>
      )}
    </span>
  );
}
