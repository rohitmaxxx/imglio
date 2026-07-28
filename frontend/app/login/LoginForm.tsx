"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { useRipple } from "@/hooks/useRipple";
import { sendOtp, verifyOtp } from "@/services/api";
import buttonStyles from "@/components/Button.module.css";
import styles from "@/components/Auth.module.css";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notice = searchParams.get("notice");
  const { showToast } = useToast();
  const { onPointerDown, rippleElements } = useRipple();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (notice) showToast("info", notice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast("error", "Please enter both name and email.");
      return;
    }
    setLoading(true);
    try {
      const result = await sendOtp(name.trim(), email.trim().toLowerCase());
      showToast("success", result.message);
      setStep("otp");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await verifyOtp(email.trim().toLowerCase(), otp);
      showToast("success", `Welcome, ${result.user.name}!`);
      router.push("/");
      router.refresh();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Incorrect OTP, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {step === "form" && (
        <div className={styles["auth-step"]}>
          <form className={styles["auth-form"]} onSubmit={handleSendOtp}>
            <label htmlFor="login-name">Name</label>
            <input id="login-name" type="text" className={styles["auth-input"]} value={name} onChange={(e) => setName(e.target.value)} required />
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" className={styles["auth-input"]} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" className={buttonStyles["auth-button"]} disabled={loading} onPointerDown={onPointerDown}>
              {rippleElements}
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </form>
        </div>
      )}

      {step === "otp" && (
        <div className={styles["auth-step"]}>
          <p className={styles["auth-step-hint"]}>Enter the OTP sent to your email.</p>
          <form className={styles["auth-form"]} onSubmit={handleVerifyOtp}>
            <label htmlFor="login-otp">OTP</label>
            <input id="login-otp" type="text" className={styles["auth-input"]} maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <button type="submit" className={buttonStyles["auth-button"]} disabled={loading} onPointerDown={onPointerDown}>
              {rippleElements}
              {loading ? "Verifying…" : "Verify & Login"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
