"use client";

import type { ChangeEvent, DragEvent, ReactNode, RefObject } from "react";
import styles from "@/components/Upload.module.css";

interface UploadZoneProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  fileName?: string;
  dragOver: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onOpenPicker: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadZone({
  icon,
  title,
  subtitle,
  fileName,
  dragOver,
  inputRef,
  onOpenPicker,
  onDrop,
  onDragOver,
  onDragLeave,
  onInputChange,
}: UploadZoneProps) {
  return (
    <div
      className={`${styles["upload-zone"]}${dragOver ? ` ${styles["dragover"]}` : ""}${fileName ? ` ${styles["has-file"]}` : ""}`}
      onClick={onOpenPicker}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpenPicker();
      }}
      aria-label={title}
    >
      <input type="file" ref={inputRef} accept="image/*" hidden onChange={onInputChange} aria-hidden="true" tabIndex={-1} />
      <div className={styles["upload-icon"]}>{icon}</div>
      <p className={styles["upload-title"]}>{title}</p>
      <p className={styles["upload-subtitle"]}>{subtitle}</p>
      {fileName ? <p className={styles["file-name"]}>{fileName}</p> : null}
    </div>
  );
}
