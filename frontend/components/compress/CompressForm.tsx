"use client";

import Link from "next/link";
import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ProcessResult from "@/components/ProcessResult";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { useUpload } from "@/hooks/useUpload";
import { useToolSubmit } from "@/hooks/useToolSubmit";
import { useToastEffect } from "@/hooks/useToastEffect";
import { useRipple } from "@/hooks/useRipple";
import { formatBytes } from "@/utils/format";
import { compress as compressApi } from "@/services/api";
import toolCardStyles from "@/components/ToolCard.module.css";
import formStyles from "@/components/FormField.module.css";
import buttonStyles from "@/components/Button.module.css";
import styles from "@/components/compress/Compress.module.css";

export default function CompressForm() {
  const upload = useUpload();
  const { status, error: submitError, result, submit, reset } = useToolSubmit();
  const { onPointerDown, rippleElements } = useRipple();
  const [quality, setQuality] = useState(70);
  useToastEffect(upload.error);
  useToastEffect(submitError);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!upload.file) return;
    submit(() => compressApi({ file: upload.file as File, quality, targetSize: "", targetUnit: "KB" }), `compressed_q${quality}.jpg`);
  }

  return (
    <main className={toolCardStyles["main-content"]}>
      <div className={toolCardStyles["tool-card"]}>
        <nav className={toolCardStyles["breadcrumbs"]}>
          <Link href="/">HOME</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <a href="#">IMAGE TOOLS</a>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <span className={toolCardStyles["current"]}>IMAGE COMPRESSOR</span>
        </nav>

        <div className={toolCardStyles["tool-badge"]}>
          <span className={toolCardStyles["badge-dot"]}></span> TOOL
        </div>
        <h1 className={toolCardStyles["tool-title"]}>Image Compressor</h1>
        <p className={toolCardStyles["tool-desc"]}>Reduce image file size without losing much quality. Free and instant.</p>

        <form onSubmit={handleSubmit}>
          <UploadZone
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" aria-hidden="true">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            }
            title="Select image to compress"
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
              <div className={formStyles["option-group"]}>
                <label htmlFor="quality">
                  Quality: <strong>{quality}</strong>%
                </label>
                <input
                  type="range"
                  id="quality"
                  min="10"
                  max="95"
                  value={quality}
                  className={formStyles["range-input"]}
                  onChange={(e) => setQuality(Number(e.target.value))}
                />
                <p className={formStyles["hint-text"]}>Lower quality = smaller file size</p>
              </div>
              <div className={styles["size-compare"]}>
                <span>
                  Original: <strong>{formatBytes(upload.original.size)}</strong>
                </span>
              </div>
              <button type="submit" className={buttonStyles["btn-resize"]} disabled={status === "loading"} onPointerDown={onPointerDown}>
                {rippleElements}
                {status === "loading" ? "Compressing…" : "Compress & Download"}
              </button>
            </div>
          )}
        </form>

        {status === "loading" && (
          <div className={toolCardStyles["processing-panel"]}>
            <div className={toolCardStyles["processing-spinner"]} />
            <p>Compressing your image…</p>
          </div>
        )}

        {status === "success" && result && (
          <ProcessResult result={result} originalSizeBytes={upload.original.size} title="Your compressed image is ready" onReset={reset}>
            {upload.previewUrl && <BeforeAfterSlider beforeSrc={upload.previewUrl} afterSrc={result.url} />}
          </ProcessResult>
        )}

        {status !== "success" && upload.previewUrl && (
          <div className={formStyles["preview-section"]}>
            <h3>Preview</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={upload.previewUrl} alt="Preview of the selected image" />
          </div>
        )}
      </div>
    </main>
  );
}
