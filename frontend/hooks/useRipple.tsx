"use client";

import { useCallback, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import styles from "@/components/Button.module.css";

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

/** Click-position ripple feedback for buttons — purely presentational, no effect on click behavior. */
export function useRipple() {
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const onPointerDown = useCallback((e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    setRipples((prev) => [...prev, { id: performance.now(), x, y, size }]);
  }, []);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const rippleElements: ReactNode = ripples.map((r) => (
    <span key={r.id} className={styles["ripple-dot"]} style={{ left: r.x, top: r.y, width: r.size, height: r.size }} onAnimationEnd={() => removeRipple(r.id)} />
  ));

  return { onPointerDown, rippleElements };
}
