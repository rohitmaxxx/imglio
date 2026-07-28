import Link from "next/link";
import Reveal from "@/components/about/Reveal";
import styles from "@/components/about/About.module.css";
import toolCardStyles from "@/components/ToolCard.module.css";
import buttonStyles from "@/components/Button.module.css";

export default function HeroSection() {
  return (
    <section className={styles["about-hero"]}>
      <div className={styles["about-hero-glow"]} aria-hidden="true" />
      <div className={styles["about-hero-inner"]}>
        <Reveal>
          <span className={styles["about-eyebrow"]}>
            <span className={toolCardStyles["badge-dot"]}></span> ABOUT PIXANZO
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className={styles["about-hero-title"]}>
            Image tools that get out of <span className={styles["about-gradient-text"]}>your way.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className={styles["about-hero-subtitle"]}>
            pixanzo is a free, browser-based toolkit for resizing, compressing, cropping, converting, and rotating images — built for people who just
            want the job done, without installing software, watching ads, or creating an account.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className={styles["about-hero-actions"]}>
            <Link href="/" className={`${buttonStyles["btn-resize"]} ${styles["about-hero-cta"]}`}>
              Start Resizing — It&apos;s Free
            </Link>
            <a href="#features" className={styles["about-hero-secondary"]}>
              Explore the tools ↓
            </a>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <ul className={styles["about-hero-trust"]}>
            <li>No signup required</li>
            <li>Nothing ever stored</li>
            <li>100% free</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
