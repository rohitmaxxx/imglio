"use client";

import { useEffect, useRef } from "react";
import { useToast, type ToastType } from "@/components/ToastProvider";

/** Fires a toast whenever `message` transitions from empty to a new non-empty value. */
export function useToastEffect(message: string | null | undefined, type: ToastType = "error") {
  const { showToast } = useToast();
  const lastRef = useRef<string | null>(null);

  useEffect(() => {
    if (message && message !== lastRef.current) {
      showToast(type, message);
    }
    lastRef.current = message ?? null;
  }, [message, type, showToast]);
}
