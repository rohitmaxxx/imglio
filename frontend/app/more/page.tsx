import type { Metadata } from "next";
import Link from "next/link";
import toolCardStyles from "@/components/ToolCard.module.css";
import styles from "@/app/StaticPage.module.css";

export const metadata: Metadata = {
  title: "More Tools",
  description: "Explore additional image utilities like meme generation, color picking, and advanced edits.",
  alternates: { canonical: "/more" },
};

export default function MorePage() {
  return (
    <main className={toolCardStyles["main-content"]}>
      <div className={toolCardStyles["tool-card"]}>
        <nav className={toolCardStyles["breadcrumbs"]}>
          <Link href="/">HOME</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <a href="#">IMAGE TOOLS</a>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <span className={toolCardStyles["current"]}>MORE TOOLS</span>
        </nav>

        <div className={toolCardStyles["tool-badge"]}>
          <span className={toolCardStyles["badge-dot"]}></span> TOOL
        </div>
        <h1 className={toolCardStyles["tool-title"]}>More Image Tools</h1>
        <p className={toolCardStyles["tool-desc"]}>Explore additional image utilities like meme generation, color picking, and advanced edits.</p>

        <div className={styles["feature-grid"]}>
          <a className={styles["feature-card"]} href="#">
            Meme Generator
          </a>
          <a className={styles["feature-card"]} href="#">
            Color Picker
          </a>
          <Link className={styles["feature-card"]} href="/rotate">
            Rotate Image
          </Link>
          <a className={styles["feature-card"]} href="#">
            Image Enlarger
          </a>
        </div>
      </div>
    </main>
  );
}
