"use client";

import { useState } from "react";
import Link from "next/link";
import UploadZone from "@/components/UploadZone";
import CropCanvas, { type CropRect } from "@/components/crop/CropCanvas";
import ProcessResult from "@/components/ProcessResult";
import { useUpload } from "@/hooks/useUpload";
import { useToolSubmit } from "@/hooks/useToolSubmit";
import { useToastEffect } from "@/hooks/useToastEffect";
import { useRipple } from "@/hooks/useRipple";
import { crop as cropApi } from "@/services/api";
import toolCardStyles from "@/components/ToolCard.module.css";
import formStyles from "@/components/FormField.module.css";
import buttonStyles from "@/components/Button.module.css";
import compareStyles from "@/components/CompareSlider.module.css";
import styles from "@/components/crop/Crop.module.css";

export default function CropForm() {
  const upload = useUpload();
  const { status, error: submitError, result, submit, reset } = useToolSubmit();
  const { onPointerDown, rippleElements } = useRipple();
  const [sel, setSel] = useState<CropRect>({ x: 0, y: 0, w: 1, h: 1 });
  const [hasSelection, setHasSelection] = useState(false);
  useToastEffect(upload.error);
  useToastEffect(submitError);

  function handleSelChange(rect: CropRect) {
    setSel(rect);
    setHasSelection(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!upload.file) return;
    submit(() => cropApi({ file: upload.file as File, x: sel.x, y: sel.y, width: sel.w, height: sel.h }), `cropped_${sel.w}x${sel.h}.jpg`);
  }

  return (
    <main className={toolCardStyles["main-content"]}>
      <div className={toolCardStyles["tool-card"]}>
        <nav className={toolCardStyles["breadcrumbs"]}>
          <Link href="/">HOME</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <Link href="/#tools">IMAGE TOOLS</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <span className={toolCardStyles["current"]}>CROP IMAGE</span>
        </nav>

        <div className={toolCardStyles["tool-badge"]}>
          <span className={toolCardStyles["badge-dot"]}></span> TOOL
        </div>
        <h1 className={toolCardStyles["tool-title"]}>Crop Image</h1>
        <p className={toolCardStyles["tool-desc"]}>Drag on the image to select an area, then crop and download.</p>

        <form onSubmit={handleSubmit}>
          {!upload.file && (
            <UploadZone
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" aria-hidden="true">
                  <path d="M6 2v14a2 2 0 0 0 2 2h14" />
                  <path d="M18 22V8a2 2 0 0 0-2-2H2" />
                </svg>
              }
              title="Select image to crop"
              subtitle="or drop files here"
              dragOver={upload.dragOver}
              inputRef={upload.inputRef}
              onOpenPicker={upload.openPicker}
              onDrop={upload.onDrop}
              onDragOver={upload.onDragOver}
              onDragLeave={upload.onDragLeave}
              onInputChange={upload.onInputChange}
            />
          )}

          {upload.file && status !== "success" && (
            <div>
              <p className={styles["crop-hint"]}>Click and drag on the image to select the crop area</p>
              <CropCanvas previewUrl={upload.previewUrl} onChange={handleSelChange} />

              <div className={`${formStyles["options-grid"]} ${styles["crop-dims"]}`}>
                <div className={formStyles["option-group"]}>
                  <label>X</label>
                  <input type="number" value={sel.x} readOnly />
                </div>
                <div className={formStyles["option-group"]}>
                  <label>Y</label>
                  <input type="number" value={sel.y} readOnly />
                </div>
                <div className={formStyles["option-group"]}>
                  <label>Width</label>
                  <input type="number" value={sel.w} readOnly />
                </div>
                <div className={formStyles["option-group"]}>
                  <label>Height</label>
                  <input type="number" value={sel.h} readOnly />
                </div>
              </div>

              <button type="submit" className={buttonStyles["btn-resize"]} disabled={!hasSelection || status === "loading"} onPointerDown={onPointerDown}>
                {rippleElements}
                {status === "loading" ? "Cropping…" : "Crop & Download"}
              </button>
            </div>
          )}
        </form>

        {status === "loading" && (
          <div className={toolCardStyles["processing-panel"]}>
            <div className={toolCardStyles["processing-spinner"]} />
            <p>Cropping your image…</p>
          </div>
        )}

        {status === "success" && result && (
          <ProcessResult result={result} originalSizeBytes={upload.original.size} title="Your cropped image is ready" onReset={reset}>
            {upload.previewUrl && (
              <div className={compareStyles["compare-sidebyside"]}>
                <div className={compareStyles["compare-pane"]}>
                  <span className={compareStyles["compare-pane-label"]}>Before</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={upload.previewUrl} alt="Original, before cropping" />
                </div>
                <div className={compareStyles["compare-pane"]}>
                  <span className={compareStyles["compare-pane-label"]}>After</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.url} alt="Cropped result" />
                </div>
              </div>
            )}
          </ProcessResult>
        )}
      </div>
    </main>
  );
}
