"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/services/api";
import buttonStyles from "@/components/Button.module.css";
import navStyles from "@/components/Navbar.module.css";
import type { User } from "@/types";

export default function HeaderAuthActions({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.refresh();
  }

  if (user) {
    return (
      <>
        <span className={navStyles["nav-user"]}>Hi, {user.name}</span>
        <button type="button" onClick={handleLogout} className={buttonStyles["btn-login"]}>
          Logout
        </button>
      </>
    );
  }

  return (
    <>
      <Link href="/login" className={buttonStyles["btn-login"]}>
        Login
      </Link>
      <Link href="/signup" className={buttonStyles["btn-signup"]}>
        Signup
      </Link>
    </>
  );
}
