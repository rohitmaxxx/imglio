"use client";

import type { ReactNode } from "react";
import { formatBytes } from "@/utils/format";
import { triggerBlobDownload } from "@/utils/download";
import { useRipple } from "@/hooks/useRipple";
import type { ToolResult } from "@/hooks/useToolSubmit";
import buttonStyles from "@/components/Button.module.css";
import styles from "@/components/ProcessResult.module.css";

interface ProcessResultProps {
  result: ToolResult;
  originalSizeBytes: number;
  title?: string;
  onReset: () => void;
  children?: ReactNode;
}

export default function ProcessResult({ result, originalSizeBytes, title = "Your image is ready", onReset, children }: ProcessResultProps) {
  const { onPointerDown, rippleElements } = useRipple();

  const delta = originalSizeBytes > 0 ? Math.round(((originalSizeBytes - result.sizeBytes) / originalSizeBytes) * 100) : 0;
  const isSmaller = delta > 0;
  const isLarger = delta < 0;

  function handleDownload() {
    triggerBlobDownload(result.url, result.filename);
  }

  return (
    <div className={styles["result-panel"]}>
      <div className={styles["result-header"]}>
        <span className={styles["result-success-icon"]} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <div>
          <h3>{title}</h3>
          <p className={styles["result-filename"]}>{result.filename}</p>
        </div>
      </div>

      {children}

      <div className={styles["result-stats"]}>
        <div className={styles["result-stat"]}>
          <span className={styles["result-stat-label"]}>Original</span>
          <strong>{formatBytes(originalSizeBytes)}</strong>
        </div>
        <div className={styles["result-stat-arrow"]} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
        <div className={styles["result-stat"]}>
          <span className={styles["result-stat-label"]}>New size</span>
          <strong>{formatBytes(result.sizeBytes)}</strong>
        </div>
        {(isSmaller || isLarger) && (
          <span className={`${styles["result-delta-badge"]}${isSmaller ? ` ${styles["smaller"]}` : ` ${styles["larger"]}`}`}>
            {isSmaller ? `${delta}% smaller` : `${Math.abs(delta)}% larger`}
          </span>
        )}
      </div>

      <div className={styles["result-actions"]}>
        <button
          type="button"
          className={`${buttonStyles["btn-resize"]} ${styles["result-download-btn"]}`}
          onPointerDown={onPointerDown}
          onClick={handleDownload}
        >
          {rippleElements}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
        <button type="button" className={styles["result-reset-btn"]} onClick={onReset}>
          Process Another Image
        </button>
      </div>
    </div>
  );
}
