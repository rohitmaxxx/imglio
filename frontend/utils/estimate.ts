import type { OriginalImageInfo } from "@/types";

/**
 * Rough compression-factor heuristic per output format, relative to the
 * original file's bytes-per-pixel. Ported verbatim from the old resize.js
 * client-side estimate — not a precise prediction, just a live UI hint.
 */
function compressionFactor(format: string, originalExt: string): number {
  const f = (format || "original").toLowerCase();
  if (f === "jpg" || f === "jpeg") return 0.35;
  if (f === "webp") return 0.28;
  if (f === "png") return 1.0;
  if (["jpg", "jpeg", "webp"].includes(originalExt)) return 0.35;
  return 1.0;
}

/**
 * Reverse of compressionFactor, deliberately larger (assumes weaker
 * compression than the optimistic forward estimate), so
 * estimateDimsForTarget guesses dimensions with headroom to spare. The
 * backend's own quality search (services/__init__.py) only ever downscales
 * to fit a target — it never upscales — so a guess that runs a bit big is
 * self-correcting (the search just picks a lower quality), while a guess
 * that runs small caps the achievable output size with no way back.
 */
function reverseCompressionFactor(format: string, originalExt: string): number {
  const f = (format || "original").toLowerCase();
  if (f === "jpg" || f === "jpeg") return 0.45;
  if (f === "webp") return 0.38;
  if (f === "png") return 1.0;
  if (["jpg", "jpeg", "webp"].includes(originalExt)) return 0.45;
  return 1.0;
}

export function estimateBytesForDims(width: number, height: number, format: string, original: OriginalImageInfo): number {
  if (!original.w || !original.h || !original.size) return 0;
  const areaRatio = (width * height) / (original.w * original.h);
  const factor = compressionFactor(format, original.ext);
  return Math.max(1, Math.round(original.size * areaRatio * factor));
}

export function estimateDimsForTarget(targetBytes: number, format: string, original: OriginalImageInfo): { w: number; h: number } | null {
  if (!targetBytes || !original.w || !original.h || !original.size) return null;
  const factor = reverseCompressionFactor(format, original.ext);
  const desiredAreaRatio = targetBytes / (original.size * factor);
  const scale = Math.sqrt(Math.max(0.01, desiredAreaRatio));
  return { w: Math.max(1, Math.round(original.w * scale)), h: Math.max(1, Math.round(original.h * scale)) };
}
