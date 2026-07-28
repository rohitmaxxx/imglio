"use client";

import type { ResizeMode } from "@/types";
import styles from "./Resize.module.css";

const TABS: { mode: ResizeMode; label: string }[] = [
  { mode: "size", label: "By Size" },
  { mode: "percent", label: "As Percentage" },
  { mode: "social", label: "Social Media" },
];

export default function ModeTabs({ mode, onChange }: { mode: ResizeMode; onChange: (mode: ResizeMode) => void }) {
  return (
    <div className={styles["mode-tabs"]} role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.mode}
          type="button"
          role="tab"
          aria-selected={mode === tab.mode}
          className={`${styles["mode-tab"]}${mode === tab.mode ? ` ${styles["active"]}` : ""}`}
          onClick={() => onChange(tab.mode)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
