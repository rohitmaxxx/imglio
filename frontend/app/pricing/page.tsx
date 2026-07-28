import type { Metadata } from "next";
import Link from "next/link";
import toolCardStyles from "@/components/ToolCard.module.css";
import styles from "@/app/StaticPage.module.css";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Everything you need for free today, with premium features coming soon.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main className={toolCardStyles["main-content"]}>
      <div className={toolCardStyles["tool-card"]}>
        <nav className={toolCardStyles["breadcrumbs"]}>
          <Link href="/">HOME</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <span className={toolCardStyles["current"]}>Pricing</span>
        </nav>

        <div className={toolCardStyles["tool-badge"]}>
          <span className={toolCardStyles["badge-dot"]}></span> INFO
        </div>
        <h1 className={toolCardStyles["tool-title"]}>Pricing Plans</h1>
        <p className={toolCardStyles["tool-desc"]}>Everything you need for free today, with premium features coming soon.</p>

        <div className={styles["plan-grid"]}>
          <div className={styles["plan-card"]}>
            <h3>Free</h3>
            <p>All basic resize, compress, crop, rotate tools at no cost.</p>
            <strong>Always free</strong>
          </div>
          <div className={`${styles["plan-card"]} ${styles["plan-card-highlight"]}`}>
            <h3>Pro</h3>
            <p>Coming soon — faster processing, larger uploads, and priority support.</p>
            <strong>Launch soon</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
