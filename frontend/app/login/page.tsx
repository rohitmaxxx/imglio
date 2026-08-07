import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import styles from "@/components/Auth.module.css";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Pixanzo account.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <section className={styles["auth-panel"]}>
      <h2>Login to pixanzo</h2>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
