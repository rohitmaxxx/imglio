"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import UploadZone from "@/components/UploadZone";
import ModeTabs from "@/components/resize/ModeTabs";
import SocialPresetGrid from "@/components/resize/SocialPresetGrid";
import ExportSettings from "@/components/resize/ExportSettings";
import ProcessResult from "@/components/ProcessResult";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { useUpload } from "@/hooks/useUpload";
import { useToolSubmit } from "@/hooks/useToolSubmit";
import { useToastEffect } from "@/hooks/useToastEffect";
import { useRipple } from "@/hooks/useRipple";
import { estimateBytesForDims, estimateDimsForTarget } from "@/utils/estimate";
import { formatBytes } from "@/utils/format";
import { resize as resizeApi } from "@/services/api";
import type { OriginalImageInfo, ResizeDefaults, ResizeMode, SizeUnit, SocialPresetTuple } from "@/types";
import toolCardStyles from "@/components/ToolCard.module.css";
import formStyles from "@/components/FormField.module.css";
import buttonStyles from "@/components/Button.module.css";
import styles from "@/components/resize/Resize.module.css";

interface SizeModeState {
  width: number;
  height: number;
  lockAspect: boolean;
  targetSize: string;
  targetUnit: SizeUnit;
}

interface PercentModeState {
  percent: number;
  targetSize: string;
  targetUnit: SizeUnit;
}

function freshSizeState(defaults: ResizeDefaults, original: OriginalImageInfo): SizeModeState {
  return {
    width: original.w || defaults.width,
    height: original.h || defaults.height,
    lockAspect: defaults.lock_aspect,
    targetSize: "",
    targetUnit: "KB",
  };
}

function freshPercentState(defaults: ResizeDefaults): PercentModeState {
  return { percent: defaults.percent, targetSize: "", targetUnit: "KB" };
}

function bytesFor(value: string, unit: SizeUnit): number {
  const v = Number(value) || 0;
  return unit === "MB" ? Math.round(v * 1024 * 1024) : Math.round(v * 1024);
}

export default function ResizeForm({ defaults, socialPresets }: { defaults: ResizeDefaults; socialPresets: SocialPresetTuple[] }) {
  const upload = useUpload();
  const { status, error: submitError, result, submit, reset } = useToolSubmit();
  const { onPointerDown, rippleElements } = useRipple();
  useToastEffect(upload.error);
  useToastEffect(submitError);

  const [mode, setMode] = useState<ResizeMode>(defaults.mode);

  // "By Size" owns width/height/lockAspect; "As Percentage" owns percent. Each also
  // has its own target size, saved/restored as a whole on every mode switch below —
  // that's what keeps the two modes from bleeding into each other.
  const [width, setWidth] = useState(defaults.width);
  const [height, setHeight] = useState(defaults.height);
  const [lockAspect, setLockAspect] = useState(defaults.lock_aspect);
  const [percent, setPercent] = useState(defaults.percent);
  const [targetSize, setTargetSize] = useState("");
  const [targetUnit, setTargetUnit] = useState<SizeUnit>("KB");

  const [selectedSocial, setSelectedSocial] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<string>(defaults.export_format);

  const savedSize = useRef<SizeModeState>(freshSizeState(defaults, { w: 0, h: 0, size: 0, ext: "" }));
  const savedPercent = useRef<PercentModeState>(freshPercentState(defaults));
  const lastOriginalKey = useRef<string>("");

  // New file selected — start each mode fresh against the new image, so no state
  // (dimensions, percent, or target size) survives across unrelated uploads.
  const originalKey = upload.original.w ? `${upload.original.w}x${upload.original.h}x${upload.original.size}` : "";
  if (originalKey && originalKey !== lastOriginalKey.current) {
    lastOriginalKey.current = originalKey;
    const freshSize = freshSizeState(defaults, upload.original);
    savedSize.current = freshSize;
    savedPercent.current = freshPercentState(defaults);
    setSelectedSocial(null);
    if (status !== "idle") reset();
    if (mode === "percent") {
      setPercent(savedPercent.current.percent);
      setTargetSize(savedPercent.current.targetSize);
      setTargetUnit(savedPercent.current.targetUnit);
    } else {
      setWidth(freshSize.width);
      setHeight(freshSize.height);
      setLockAspect(freshSize.lockAspect);
      setTargetSize(freshSize.targetSize);
      setTargetUnit(freshSize.targetUnit);
    }
  }

  function estimateAndSetTarget(w: number, h: number) {
    const bytes = estimateBytesForDims(w, h, exportFormat, upload.original);
    if (!bytes) return;
    if (bytes >= 1024 * 1024) {
      setTargetUnit("MB");
      setTargetSize((bytes / (1024 * 1024)).toFixed(2));
    } else {
      setTargetUnit("KB");
      setTargetSize(String(Math.max(1, Math.round(bytes / 1024))));
    }
  }

  function handleModeChange(newMode: ResizeMode) {
    if (mode === newMode) return;

    // Snapshot the whole mode we're leaving — dims/percent *and* target together —
    // so returning to it later restores exactly what it had, untouched by the other mode.
    if (mode === "size") {
      savedSize.current = { width, height, lockAspect, targetSize, targetUnit };
    } else if (mode === "percent") {
      savedPercent.current = { percent, targetSize, targetUnit };
    }

    setMode(newMode);

    if (newMode === "size") {
      const saved = savedSize.current;
      setWidth(saved.width);
      setHeight(saved.height);
      setLockAspect(saved.lockAspect);
      setTargetSize(saved.targetSize);
      setTargetUnit(saved.targetUnit);
      if (!saved.targetSize) estimateAndSetTarget(saved.width, saved.height);
    } else if (newMode === "percent") {
      const saved = savedPercent.current;
      setPercent(saved.percent);
      setTargetSize(saved.targetSize);
      setTargetUnit(saved.targetUnit);
      if (!saved.targetSize && upload.original.w) {
        const w = Math.max(1, Math.round((upload.original.w * saved.percent) / 100));
        const h = Math.max(1, Math.round((upload.original.h * saved.percent) / 100));
        estimateAndSetTarget(w, h);
      }
    }
  }

  // ── By Size: width/height <-> target size, bidirectional ──────────
  function handleWidthChange(value: string) {
    const w = Number(value) || 0;
    setWidth(w);
    let h = height;
    if (lockAspect && upload.original.w) {
      h = Math.round((w * upload.original.h) / upload.original.w) || 1;
      setHeight(h);
    }
    estimateAndSetTarget(w, h);
  }

  function handleHeightChange(value: string) {
    const h = Number(value) || 0;
    setHeight(h);
    let w = width;
    if (lockAspect && upload.original.h) {
      w = Math.round((h * upload.original.w) / upload.original.h) || 1;
      setWidth(w);
    }
    estimateAndSetTarget(w, h);
  }

  // ── As Percentage: percent <-> target size, bidirectional ─────────
  function handlePercentChange(value: string) {
    const p = Number(value) || 1;
    setPercent(p);
    if (upload.original.w) {
      const w = Math.max(1, Math.round((upload.original.w * p) / 100));
      const h = Math.max(1, Math.round((upload.original.h * p) / 100));
      estimateAndSetTarget(w, h);
    }
  }

  function handleSocialSelect(label: string, w: number, h: number) {
    setSelectedSocial(label);
    setWidth(w);
    setHeight(h);
    setLockAspect(true);
  }

  function handleExportFormatChange(value: string) {
    setExportFormat(value);
    if (mode === "size") {
      estimateAndSetTarget(width, height);
    } else if (mode === "percent" && upload.original.w) {
      estimateAndSetTarget(Math.round((upload.original.w * percent) / 100), Math.round((upload.original.h * percent) / 100));
    }
  }

  // Target size -> dims/percent, reverse direction, scoped to the active mode only.
  function applyTargetToActiveMode(value: string, unit: SizeUnit) {
    const bytes = bytesFor(value, unit);
    const dims = estimateDimsForTarget(bytes, exportFormat, upload.original);
    if (!dims) return;
    if (mode === "size") {
      setWidth(dims.w);
      setHeight(dims.h);
    } else if (mode === "percent" && upload.original.w) {
      setPercent(Math.max(1, Math.round((dims.w / upload.original.w) * 100)));
    }
  }

  function handleTargetSizeChange(value: string) {
    setTargetSize(value);
    applyTargetToActiveMode(value, targetUnit);
  }

  function handleTargetUnitChange(unit: SizeUnit) {
    setTargetUnit(unit);
    applyTargetToActiveMode(targetSize, unit);
  }

  const percentDims = useMemo(() => {
    if (!upload.original.w) return { w: width, h: height };
    return {
      w: Math.max(1, Math.round((upload.original.w * percent) / 100)),
      h: Math.max(1, Math.round((upload.original.h * percent) / 100)),
    };
  }, [upload.original.w, upload.original.h, percent, width, height]);

  const previewMeta = useMemo(() => {
    if (!upload.original.w) return "";
    const tw = mode === "percent" ? percentDims.w : width || upload.original.w;
    const th = mode === "percent" ? percentDims.h : height || upload.original.h;
    let meta = `· ${upload.original.w}×${upload.original.h} → ${tw}×${th}`;
    const estBytes = estimateBytesForDims(tw, th, exportFormat, upload.original);
    if (estBytes) meta += ` · est ${formatBytes(estBytes)}`;
    return meta;
  }, [upload.original, width, height, percentDims, mode, exportFormat]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!upload.file) return;

    const fallbackW = mode === "percent" ? percentDims.w : width;
    const fallbackH = mode === "percent" ? percentDims.h : height;

    submit(
      () =>
        resizeApi({
          file: upload.file as File,
          mode,
          width,
          height,
          percent,
          lockAspect,
          exportFormat,
          targetSize,
          targetUnit,
        }),
      `resized_${fallbackW}x${fallbackH}.${exportFormat === "original" ? upload.original.ext || "jpg" : exportFormat}`
    );
  }

  return (
    <section id="upload-zone" aria-labelledby="resize-tool-heading" className={toolCardStyles["main-content"]}>
      <div className={toolCardStyles["tool-card"]}>
        <nav className={toolCardStyles["breadcrumbs"]}>
          <Link href="/">HOME</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <Link href="/#tools">IMAGE TOOLS</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <span className={toolCardStyles["current"]}>IMAGE RESIZER</span>
        </nav>

        <div className={toolCardStyles["tool-badge"]}>
          <span className={toolCardStyles["badge-dot"]}></span> TOOL
        </div>
        <h2 id="resize-tool-heading" className={toolCardStyles["tool-title"]}>
          Image Resizer
        </h2>
        <p className={toolCardStyles["tool-desc"]}>Resize by exact size, percentage, or social presets. Export with target KB/MB.</p>

        <form onSubmit={handleSubmit}>
          <UploadZone
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            }
            title="Select files"
            subtitle="or drop files here · Max 16 MB"
            fileName={upload.file ? `${upload.file.name} · ${formatBytes(upload.file.size)}` : undefined}
            dragOver={upload.dragOver}
            inputRef={upload.inputRef}
            onOpenPicker={upload.openPicker}
            onDrop={upload.onDrop}
            onDragOver={upload.onDragOver}
            onDragLeave={upload.onDragLeave}
            onInputChange={upload.onInputChange}
          />

          {upload.file && status !== "success" && (
            <div className={toolCardStyles["settings-panel"]}>
              <div className={toolCardStyles["settings-block"]}>
                <h3 className={toolCardStyles["settings-heading"]}>Resize Settings</h3>
                <ModeTabs mode={mode} onChange={handleModeChange} />

                {mode === "size" && (
                  <div className={styles["mode-panel"]}>
                    <div className={styles["dim-row"]}>
                      <div className={formStyles["field"]}>
                        <label htmlFor="width">Width</label>
                        <div className={formStyles["input-with-unit"]}>
                          <input type="number" id="width" min="1" max="10000" value={width} onChange={(e) => handleWidthChange(e.target.value)} />
                          <span className={formStyles["unit-tag"]}>px</span>
                        </div>
                      </div>
                      <div className={formStyles["field"]}>
                        <label htmlFor="height">Height</label>
                        <div className={formStyles["input-with-unit"]}>
                          <input type="number" id="height" min="1" max="10000" value={height} onChange={(e) => handleHeightChange(e.target.value)} />
                          <span className={formStyles["unit-tag"]}>px</span>
                        </div>
                      </div>
                    </div>
                    <label className={formStyles["check-row"]}>
                      <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} />
                      <span>Lock Aspect Ratio</span>
                    </label>
                  </div>
                )}

                {mode === "percent" && (
                  <div className={styles["mode-panel"]}>
                    <div className={styles["percent-row"]}>
                      <label htmlFor="percent">Size</label>
                      <div className={styles["percent-slider-wrap"]}>
                        <input
                          type="range"
                          id="percent"
                          min="1"
                          max="500"
                          value={percent}
                          className={formStyles["range-input"]}
                          onChange={(e) => handlePercentChange(e.target.value)}
                        />
                        <strong>{percent}%</strong>
                      </div>
                      <p className={styles["percent-hint"]}>Make my image {percent}% of original size.</p>
                    </div>
                  </div>
                )}

                {mode === "social" && (
                  <div className={styles["mode-panel"]}>
                    <SocialPresetGrid presets={socialPresets} selected={selectedSocial} onSelect={handleSocialSelect} />
                  </div>
                )}
              </div>

              <ExportSettings
                targetSize={targetSize}
                targetUnit={targetUnit}
                exportFormat={exportFormat}
                onTargetSizeChange={handleTargetSizeChange}
                onTargetUnitChange={handleTargetUnitChange}
                onExportFormatChange={handleExportFormatChange}
              />

              <button type="submit" className={buttonStyles["btn-resize"]} disabled={status === "loading"} onPointerDown={onPointerDown}>
                {rippleElements}
                {status === "loading" ? "Resizing…" : "Resize & Download"}
              </button>
            </div>
          )}
        </form>

        {status === "loading" && (
          <div className={toolCardStyles["processing-panel"]}>
            <div className={toolCardStyles["processing-spinner"]} />
            <p>Resizing your image…</p>
          </div>
        )}

        {status === "success" && result && (
          <ProcessResult result={result} originalSizeBytes={upload.original.size} title="Your resized image is ready" onReset={reset}>
            {upload.previewUrl && <BeforeAfterSlider beforeSrc={upload.previewUrl} afterSrc={result.url} />}
          </ProcessResult>
        )}

        {status !== "success" && upload.previewUrl && (
          <div className={formStyles["preview-section"]}>
            <h3>
              Preview <span className={formStyles["preview-meta"]}>{previewMeta}</span>
            </h3>
            {/* Data-URL preview of a user-selected local file — next/image requires a static/remote loader, so a plain img is correct here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={upload.previewUrl} alt="Preview of the selected image" />
          </div>
        )}
      </div>
    </section>
  );
}
