"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "@/components/about/About.module.css";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

/** Counts up from 0 to `value` once it scrolls into view. Respects prefers-reduced-motion. */
export default function AnimatedCounter({ value, suffix = "", prefix = "", duration = 1500 }: AnimatedCounterProps) {
  const { ref, isVisible } = useScrollReveal<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let start: number | null = null;
    let frame: number;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, value, duration]);

  return (
    <span ref={ref} className={styles["stat-number"]}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
