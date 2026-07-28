"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseFilenameFromDisposition } from "@/utils/download";

export interface ToolResult {
  blob: Blob;
  filename: string;
  url: string;
  sizeBytes: number;
}

export type ToolStatus = "idle" | "loading" | "success" | "error";

/** Shared submit -> loading/result/error flow used by every tool page. The caller decides when (and whether) to actually save the file. */
export function useToolSubmit() {
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ToolResult | null>(null);
  const resultRef = useRef<ToolResult | null>(null);

  const submit = useCallback(async (request: () => Promise<Response>, fallbackName: string) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await request();
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: "Something went wrong." }));
        setError(body.detail || "Something went wrong.");
        setStatus("error");
        return;
      }
      const blob = await res.blob();
      const filename = parseFilenameFromDisposition(res.headers.get("content-disposition"), fallbackName);
      const url = URL.createObjectURL(blob);
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
      const next = { blob, filename, url, sizeBytes: blob.size };
      resultRef.current = next;
      setResult(next);
      setStatus("success");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    if (resultRef.current) {
      URL.revokeObjectURL(resultRef.current.url);
      resultRef.current = null;
    }
    setResult(null);
    setStatus("idle");
    setError(null);
  }, []);

  // Revoke the object URL when the component unmounts (e.g. navigating away mid-result).
  useEffect(() => {
    return () => {
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    };
  }, []);

  return { status, error, result, submit, reset };
}
