export function parseFilenameFromDisposition(disposition: string | null, fallback: string): string {
  if (!disposition) return fallback;
  const match = disposition.match(/filename="?([^";]+)"?/);
  return match ? match[1] : fallback;
}

/** Triggers a save-as for an already-created object URL — the caller owns the URL's lifetime. */
export function triggerBlobDownload(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
