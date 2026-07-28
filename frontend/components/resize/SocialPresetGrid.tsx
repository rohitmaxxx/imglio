"use client";

import type { SocialPresetTuple } from "@/types";
import formStyles from "@/components/FormField.module.css";
import styles from "./Resize.module.css";

interface SocialPresetGridProps {
  presets: SocialPresetTuple[];
  selected: string | null;
  onSelect: (label: string, width: number, height: number) => void;
}

export default function SocialPresetGrid({ presets, selected, onSelect }: SocialPresetGridProps) {
  const activePreset = presets.find(([label]) => label === selected);

  return (
    <>
      <div className={styles["social-grid"]}>
        {presets.map(([label, width, height]) => (
          <button
            key={label}
            type="button"
            className={`${styles["social-card"]}${selected === label ? ` ${styles["active"]}` : ""}`}
            onClick={() => onSelect(label, width, height)}
          >
            <span className={styles["social-name"]}>{label}</span>
            <span className={styles["social-size"]}>
              {width} × {height}
            </span>
          </button>
        ))}
      </div>
      <p className={formStyles["hint-text"]}>{activePreset ? `Selected: ${activePreset[0]} (${activePreset[1]}×${activePreset[2]})` : "Pick a preset to set width & height."}</p>
    </>
  );
}
