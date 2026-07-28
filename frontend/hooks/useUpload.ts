"use client";

import { useCallback, useRef, useState } from "react";
import type { OriginalImageInfo } from "@/types";

const EMPTY_ORIGINAL: OriginalImageInfo = { w: 0, h: 0, size: 0, ext: "" };

/** Shared upload-zone behavior: drag/drop + click-to-browse + reading dimensions for preview. */
export function useUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [original, setOriginal] = useState<OriginalImageInfo>(EMPTY_ORIGINAL);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        setFile(f);
        setPreviewUrl(dataUrl);
        setOriginal({ w: img.width, h: img.height, size: f.size, ext: (f.name.split(".").pop() || "").toLowerCase() });
      };
      img.onerror = () => setError("Could not read image.");
      img.src = dataUrl;
    };
    reader.onerror = () => setError("Could not read file.");
    reader.readAsDataURL(f);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
    },
    [loadFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) loadFile(e.target.files[0]);
    },
    [loadFile]
  );

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  return { file, previewUrl, original, dragOver, error, inputRef, openPicker, onDrop, onDragOver, onDragLeave, onInputChange };
}
