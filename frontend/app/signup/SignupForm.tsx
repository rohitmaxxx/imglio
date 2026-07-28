"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRipple } from "@/hooks/useRipple";
import buttonStyles from "@/components/Button.module.css";
import styles from "@/components/Auth.module.css";

export default function SignupForm() {
  const router = useRouter();
  const { onPointerDown, rippleElements } = useRipple();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/login?notice=${encodeURIComponent("Signup is coming soon. Please try login for now.")}`);
  }

  return (
    <form className={styles["auth-form"]} onSubmit={handleSubmit}>
      <label htmlFor="signup-name">Name</label>
      <input id="signup-name" type="text" name="name" className={styles["auth-input"]} value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="signup-email">Email</label>
      <input id="signup-email" type="email" name="email" className={styles["auth-input"]} value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit" className={buttonStyles["auth-button"]} onPointerDown={onPointerDown}>
        {rippleElements}
        Signup
      </button>
    </form>
  );
}
