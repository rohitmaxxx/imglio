"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import styles from "@/components/ScrollProgress.module.css";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className={styles["scroll-progress-track"]}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div className={styles["scroll-progress-bar"]} style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}
