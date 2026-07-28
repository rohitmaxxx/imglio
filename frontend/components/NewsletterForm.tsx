"use client";

import { useState } from "react";
import { useRipple } from "@/hooks/useRipple";
import styles from "@/components/Newsletter.module.css";

/** UI-only for now — no backend/email service wired up yet. */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { onPointerDown, rippleElements } = useRipple();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <p className={styles["newsletter-success"]}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        You&apos;re on the list — thanks!
      </p>
    );
  }

  return (
    <form className={styles["newsletter-form"]} onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address for product updates"
      />
      <button type="submit" onPointerDown={onPointerDown} aria-label="Subscribe">
        {rippleElements}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </form>
  );
}
