export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ResizeParams {
  file: File;
  mode: "size" | "percent" | "social";
  width: number;
  height: number;
  percent: number;
  lockAspect: boolean;
  exportFormat: string;
  targetSize: string;
  targetUnit: string;
}

export function resize(params: ResizeParams): Promise<Response> {
  const form = new FormData();
  form.append("file", params.file);
  form.append("mode", params.mode);
  form.append("width", String(params.width));
  form.append("height", String(params.height));
  form.append("percent", String(params.percent));
  if (params.lockAspect) form.append("lock_aspect", "on");
  form.append("export_format", params.exportFormat);
  form.append("target_size", params.targetSize);
  form.append("target_unit", params.targetUnit);
  return fetch(`${API_URL}/api/resize`, { method: "POST", body: form });
}

export interface CompressParams {
  file: File;
  quality: number;
  targetSize: string;
  targetUnit: string;
}

export function compress(params: CompressParams): Promise<Response> {
  const form = new FormData();
  form.append("file", params.file);
  form.append("quality", String(params.quality));
  form.append("target_size", params.targetSize);
  form.append("target_unit", params.targetUnit);
  return fetch(`${API_URL}/api/compress`, { method: "POST", body: form });
}

export interface CropParams {
  file: File;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function crop(params: CropParams): Promise<Response> {
  const form = new FormData();
  form.append("file", params.file);
  form.append("x", String(params.x));
  form.append("y", String(params.y));
  form.append("width", String(params.width));
  form.append("height", String(params.height));
  return fetch(`${API_URL}/api/crop`, { method: "POST", body: form });
}

export interface RotateParams {
  file: File;
  angle: number;
}

export function rotate(params: RotateParams): Promise<Response> {
  const form = new FormData();
  form.append("file", params.file);
  form.append("angle", String(params.angle));
  return fetch(`${API_URL}/api/rotate`, { method: "POST", body: form });
}

export async function sendOtp(name: string, email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.detail || "Failed to send OTP.");
  return body;
}

/** Goes through the Next.js route handler (same-origin) so it can set the auth cookie. */
export async function verifyOtp(email: string, otp: string): Promise<{ user: { name: string; email: string } }> {
  const res = await fetch(`/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.detail || "Invalid OTP.");
  return body;
}

/** Goes through the Next.js route handler (same-origin) so it can clear the auth cookie. */
export async function logout(): Promise<void> {
  await fetch(`/api/auth/logout`, { method: "POST" });
}

export async function getConfig() {
  const res = await fetch(`${API_URL}/api/config`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load config.");
  return res.json();
}
