"use client";

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import styles from "@/components/CompareSlider.module.css";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeLabel = "Before", afterLabel = "After" }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
  }

  const containerStyle = { "--compare-pos": `${position}%` } as CSSProperties;

  return (
    <div className={styles["compare-slider"]} ref={containerRef} style={containerStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterSrc} alt={afterLabel} className={styles["compare-img"]} />
      <div className={styles["compare-before-clip"]}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeSrc} alt={beforeLabel} className={styles["compare-img"]} />
      </div>

      <span className={`${styles["compare-tag"]} ${styles["compare-tag-before"]}`}>{beforeLabel}</span>
      <span className={`${styles["compare-tag"]} ${styles["compare-tag-after"]}`}>{afterLabel}</span>

      <div
        className={styles["compare-handle"]}
        style={{ left: `${position}%` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="slider"
        aria-label="Drag to compare before and after"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <span className={styles["compare-handle-grip"]}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="14 6 8 12 14 18" />
          </svg>
        </span>
      </div>
    </div>
  );
}
