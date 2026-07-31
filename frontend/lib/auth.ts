import { cookies } from "next/headers";
import type { User } from "@/types";

export const AUTH_COOKIE_NAME = "pixanzo_token";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** Server-only: resolves the logged-in user (if any) from the first-party HttpOnly cookie. */
export async function getServerUser(): Promise<User | null> {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
