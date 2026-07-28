import type { Metadata } from "next";
import Link from "next/link";
import toolCardStyles from "@/components/ToolCard.module.css";
import styles from "@/app/StaticPage.module.css";

export const metadata: Metadata = {
  title: "Image Converter",
  description: "Convert images to JPG, PNG, WebP and more with a single upload.",
  alternates: { canonical: "/convert" },
};

export default function ConvertPage() {
  return (
    <main className={toolCardStyles["main-content"]}>
      <div className={toolCardStyles["tool-card"]}>
        <nav className={toolCardStyles["breadcrumbs"]}>
          <Link href="/">HOME</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <a href="#">IMAGE TOOLS</a>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <span className={toolCardStyles["current"]}>IMAGE CONVERTER</span>
        </nav>

        <div className={toolCardStyles["tool-badge"]}>
          <span className={toolCardStyles["badge-dot"]}></span> TOOL
        </div>
        <h1 className={toolCardStyles["tool-title"]}>Image Converter</h1>
        <p className={toolCardStyles["tool-desc"]}>Convert images to JPG, PNG, WebP and more with a single upload.</p>

        <div className={styles["feature-grid"]}>
          <a className={styles["feature-card"]} href="#">
            HEIC to JPG
          </a>
          <a className={styles["feature-card"]} href="#">
            WebP to PNG
          </a>
          <a className={styles["feature-card"]} href="#">
            PNG to JPG
          </a>
          <a className={styles["feature-card"]} href="#">
            JPG to WebP
          </a>
        </div>
      </div>
    </main>
  );
}
