"use client";

import { useState } from "react";
import type { SizeUnit } from "@/types";
import toolCardStyles from "@/components/ToolCard.module.css";
import formStyles from "@/components/FormField.module.css";
import styles from "./Resize.module.css";

interface ExportSettingsProps {
  targetSize: string;
  targetUnit: SizeUnit;
  exportFormat: string;
  onTargetSizeChange: (value: string) => void;
  onTargetUnitChange: (value: SizeUnit) => void;
  onExportFormatChange: (value: string) => void;
}

export default function ExportSettings({
  targetSize,
  targetUnit,
  exportFormat,
  onTargetSizeChange,
  onTargetUnitChange,
  onExportFormatChange,
}: ExportSettingsProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`${toolCardStyles["settings-block"]} ${styles["export-block"]}`}>
      <button
        type="button"
        className={`${styles["export-toggle"]}${open ? "" : ` ${styles["collapsed"]}`}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>Export Settings</span>
        <svg className={styles["chevron"]} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className={styles["export-body"]}>
          <div className={formStyles["field"]}>
            <label htmlFor="target_size">
              Target File Size <span className={formStyles["optional"]}>(optional)</span>
            </label>
            <div className={formStyles["input-with-select"]}>
              <input
                type="number"
                id="target_size"
                min="0.01"
                step="any"
                placeholder="e.g. 200"
                value={targetSize}
                onChange={(e) => onTargetSizeChange(e.target.value)}
              />
              <select id="target_unit" value={targetUnit} onChange={(e) => onTargetUnitChange(e.target.value as SizeUnit)}>
                <option value="KB">KB</option>
                <option value="MB">MB</option>
              </select>
            </div>
            <p className={formStyles["hint-text"]}>Set a max output file size. Best results with JPG / WebP.</p>
          </div>

          <div className={formStyles["field"]}>
            <label htmlFor="export_format">Save Image As</label>
            <select id="export_format" className={formStyles["full-select"]} value={exportFormat} onChange={(e) => onExportFormatChange(e.target.value)}>
              <option value="original">Original</option>
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
