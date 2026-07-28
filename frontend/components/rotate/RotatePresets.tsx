"use client";

import formStyles from "@/components/FormField.module.css";
import styles from "@/components/rotate/Rotate.module.css";

const PRESETS = [
  { angle: 90, label: "↻ 90°" },
  { angle: 180, label: "↻ 180°" },
  { angle: 270, label: "↻ 270°" },
  { angle: -90, label: "↺ -90°" },
];

function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export default function RotatePresets({ angle, onChange }: { angle: number; onChange: (angle: number) => void }) {
  const normalizedAngle = normalize(angle);

  return (
    <>
      <div className={styles["rotate-presets"]}>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={`${styles["rotate-btn"]}${normalize(preset.angle) === normalizedAngle ? ` ${styles["active"]}` : ""}`}
            onClick={() => onChange(normalize(preset.angle))}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className={formStyles["option-group"]}>
        <label htmlFor="custom-angle">
          Custom angle: <strong>{normalizedAngle}</strong>°
        </label>
        <input
          type="range"
          id="custom-angle"
          min="0"
          max="360"
          value={normalizedAngle}
          className={formStyles["range-input"]}
          onChange={(e) => onChange(normalize(Number(e.target.value)))}
        />
      </div>
    </>
  );
}
