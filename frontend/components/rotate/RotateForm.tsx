"use client";

import { useState } from "react";
import Link from "next/link";
import UploadZone from "@/components/UploadZone";
import RotatePresets from "@/components/rotate/RotatePresets";
import ProcessResult from "@/components/ProcessResult";
import { useUpload } from "@/hooks/useUpload";
import { useToolSubmit } from "@/hooks/useToolSubmit";
import { useToastEffect } from "@/hooks/useToastEffect";
import { useRipple } from "@/hooks/useRipple";
import { rotate as rotateApi } from "@/services/api";
import toolCardStyles from "@/components/ToolCard.module.css";
import formStyles from "@/components/FormField.module.css";
import buttonStyles from "@/components/Button.module.css";
import compareStyles from "@/components/CompareSlider.module.css";
import styles from "@/components/rotate/Rotate.module.css";

export default function RotateForm() {
  const upload = useUpload();
  const { status, error: submitError, result, submit, reset } = useToolSubmit();
  const { onPointerDown, rippleElements } = useRipple();
  const [angle, setAngle] = useState(90);
  useToastEffect(upload.error);
  useToastEffect(submitError);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!upload.file) return;
    submit(() => rotateApi({ file: upload.file as File, angle }), `rotated_${angle}.jpg`);
  }

  return (
    <main className={toolCardStyles["main-content"]}>
      <div className={toolCardStyles["tool-card"]}>
        <nav className={toolCardStyles["breadcrumbs"]}>
          <Link href="/">HOME</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <Link href="/#tools">IMAGE TOOLS</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <span className={toolCardStyles["current"]}>ROTATE IMAGE</span>
        </nav>

        <div className={toolCardStyles["tool-badge"]}>
          <span className={toolCardStyles["badge-dot"]}></span> TOOL
        </div>
        <h1 className={toolCardStyles["tool-title"]}>Rotate Image</h1>
        <p className={toolCardStyles["tool-desc"]}>Rotate your image left or right, or set a custom angle.</p>

        <form onSubmit={handleSubmit}>
          <UploadZone
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-3-6.7" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
            }
            title="Select image to rotate"
            subtitle="or drop files here"
            fileName={upload.file?.name}
            dragOver={upload.dragOver}
            inputRef={upload.inputRef}
            onOpenPicker={upload.openPicker}
            onDrop={upload.onDrop}
            onDragOver={upload.onDragOver}
            onDragLeave={upload.onDragLeave}
            onInputChange={upload.onInputChange}
          />

          {upload.file && status !== "success" && (
            <div className={formStyles["resize-options"]}>
              <RotatePresets angle={angle} onChange={setAngle} />
              <button type="submit" className={buttonStyles["btn-resize"]} disabled={status === "loading"} onPointerDown={onPointerDown}>
                {rippleElements}
                {status === "loading" ? "Rotating…" : "Rotate & Download"}
              </button>
            </div>
          )}
        </form>

        {status === "loading" && (
          <div className={toolCardStyles["processing-panel"]}>
            <div className={toolCardStyles["processing-spinner"]} />
            <p>Rotating your image…</p>
          </div>
        )}

        {status === "success" && result && (
          <ProcessResult result={result} originalSizeBytes={upload.original.size} title="Your rotated image is ready" onReset={reset}>
            {upload.previewUrl && (
              <div className={compareStyles["compare-sidebyside"]}>
                <div className={compareStyles["compare-pane"]}>
                  <span className={compareStyles["compare-pane-label"]}>Before</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={upload.previewUrl} alt="Original, before rotating" />
                </div>
                <div className={compareStyles["compare-pane"]}>
                  <span className={compareStyles["compare-pane-label"]}>After</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.url} alt="Rotated result" />
                </div>
              </div>
            )}
          </ProcessResult>
        )}

        {status !== "success" && upload.previewUrl && (
          <div className={formStyles["preview-section"]}>
            <h2>Live Preview</h2>
            <div className={styles["rotate-preview-wrap"]}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={upload.previewUrl} alt="Live rotation preview" style={{ transform: `rotate(${angle}deg)` }} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
