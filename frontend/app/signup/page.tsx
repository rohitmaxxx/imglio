import type { Metadata } from "next";
import SignupForm from "./SignupForm";
import styles from "@/components/Auth.module.css";

export const metadata: Metadata = {
  title: "Signup",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return (
    <section className={styles["auth-panel"]}>
      <h2>Signup</h2>
      <SignupForm />
    </section>
  );
}
