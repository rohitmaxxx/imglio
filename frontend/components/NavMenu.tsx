"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderAuthActions from "@/components/HeaderAuthActions";
import buttonStyles from "@/components/Button.module.css";
import styles from "@/components/Navbar.module.css";
import type { User } from "@/types";

const NAV_SECTIONS = [
  {
    label: "Resize",
    href: "/",
    items: [
      { label: "Image Resizer", href: "/" },
      { label: "Bulk Resize", href: "/" },
      { label: "Resize PNG", href: "/" },
      { label: "Resize JPG", href: "/" },
      { label: "Resize WebP", href: "/" },
    ],
  },
  {
    label: "Crop",
    href: "/crop",
    items: [
      { label: "Crop Image", href: "/crop" },
      { label: "Crop PNG", href: "/crop" },
      { label: "Crop WebP", href: "/crop" },
      { label: "Crop JPG", href: "/crop" },
    ],
  },
  {
    label: "Compress",
    href: "/compress",
    items: [
      { label: "Image Compressor", href: "/compress" },
      { label: "Compress JPEG", href: "/compress" },
      { label: "PNG Compressor", href: "/compress" },
      { label: "GIF Compressor", href: "/compress" },
    ],
  },
  {
    label: "Convert",
    href: "/convert",
    items: [
      { label: "Image Converter", href: "/convert" },
      { label: "HEIC to JPG", href: "/convert" },
      { label: "WebP to PNG", href: "/convert" },
      { label: "PNG to JPG", href: "/convert" },
    ],
  },
  {
    label: "More",
    href: "/more",
    items: [
      { label: "Meme Generator", href: "/more" },
      { label: "Color Picker", href: "/more" },
      { label: "Rotate Image", href: "/rotate" },
      { label: "Image Enlarger", href: "/more" },
    ],
  },
];

const MOBILE_LINKS = [
  { label: "Resize", href: "/" },
  { label: "Compress", href: "/compress" },
  { label: "Crop", href: "/crop" },
  { label: "Rotate", href: "/rotate" },
  { label: "Convert", href: "/convert" },
  { label: "More", href: "/more" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function NavMenu({ user }: { user: User | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const pathname = usePathname();

  // The mobile panel portals to <body> (see below) so it can size itself against the real
  // viewport instead of the <header>, which has backdrop-filter — that establishes a
  // containing block for position:fixed descendants and would otherwise collapse the
  // panel/backdrop to the header's own (short) box instead of the full screen.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on route change, Escape, or resize past the mobile breakpoint; lock body scroll while open.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function measure() {
      const header = document.querySelector("header");
      if (header) setHeaderHeight(header.getBoundingClientRect().height);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    function handleResize() {
      if (window.innerWidth > 768) setMobileOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className={styles["nav-links"]} aria-label="Primary">
        {NAV_SECTIONS.map((section) => (
          <div className={styles["nav-item"]} key={section.label}>
            <Link href={section.href} className={pathname === section.href ? styles["active"] : undefined} aria-current={pathname === section.href ? "page" : undefined}>
              {section.label} <span className={styles["dropdown-caret"]}>▾</span>
            </Link>
            <div className={styles["dropdown-menu"]}>
              {section.items.map((item) => (
                <Link href={item.href} key={item.label}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Link href="/pricing" className={pathname === "/pricing" ? styles["active"] : undefined} aria-current={pathname === "/pricing" ? "page" : undefined}>
          Pricing
        </Link>
      </nav>

      <div className={styles["header-actions"]}>
        <span className={styles["desktop-auth"]}>
          <HeaderAuthActions user={user} />
        </span>
        <button
          type="button"
          className={`${styles["mobile-nav-toggle"]}${mobileOpen ? ` ${styles["open"]}` : ""}`}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className={styles["hamburger-line"]} />
          <span className={styles["hamburger-line"]} />
          <span className={styles["hamburger-line"]} />
        </button>
      </div>

      {mounted &&
        createPortal(
          <>
            <div
              className={`${styles["mobile-nav-backdrop"]}${mobileOpen ? ` ${styles["open"]}` : ""}`}
              style={{ top: headerHeight }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <div
              id="mobile-nav-panel"
              className={`${styles["mobile-nav-panel"]}${mobileOpen ? ` ${styles["open"]}` : ""}`}
              style={{ top: headerHeight, maxHeight: `calc(100vh - ${headerHeight}px)` }}
              aria-hidden={!mobileOpen}
            >
              <nav aria-label="Mobile primary">
                {MOBILE_LINKS.map((link) => (
                  <Link
                    href={link.href}
                    key={link.label}
                    tabIndex={mobileOpen ? 0 : -1}
                    className={pathname === link.href ? styles["active"] : undefined}
                    aria-current={pathname === link.href ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {!user && (
                <div className={styles["mobile-nav-auth"]}>
                  <Link href="/login" className={buttonStyles["btn-login"]} tabIndex={mobileOpen ? 0 : -1} onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                  <Link href="/signup" className={buttonStyles["btn-signup"]} tabIndex={mobileOpen ? 0 : -1} onClick={() => setMobileOpen(false)}>
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
