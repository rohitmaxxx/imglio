import Reveal from "@/components/about/Reveal";
// import toolCardStyles from "@/components/ToolCard.module.css";
// import buttonStyles from "@/components/Button.module.css";
import styles from "@/components/home/HomeHero.module.css";

export default function HomeHero() {
  return (
    <section className={styles["home-hero"]}>
      <div className={styles["home-hero-dotgrid"]} aria-hidden="true" />
      <div className={`${styles["home-hero-blob"]} ${styles["home-hero-blob-1"]}`} aria-hidden="true" />
      <div className={`${styles["home-hero-blob"]} ${styles["home-hero-blob-2"]}`} aria-hidden="true" />
      <div className={`${styles["home-hero-blob"]} ${styles["home-hero-blob-3"]}`} aria-hidden="true" />
      <div className={styles["home-hero-inner"]}>
        {/* <Reveal>
          <span className={styles["home-hero-eyebrow"]}>
            <span className={toolCardStyles["badge-dot"]}></span> PREMIUM IMAGE TOOLKIT
          </span>
        </Reveal> */}
        <Reveal delay={80}>
          <h1 className={styles["home-hero-title"]}>
            Resize, compress &amp; perfect your images <span className={styles["home-hero-gradient-text"]}>instantly.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className={styles["home-hero-subtitle"]}>
            A free, browser-based toolkit for resizing, compressing, cropping, and converting images — no signup, no watermark, nothing ever stored.
          </p>
        </Reveal>
        {/* <Reveal delay={240}>
          <div className={styles["home-hero-actions"]}>
            <a href="#upload-zone" className={`${buttonStyles["btn-resize"]} ${styles["home-hero-cta"]}`}>
              Start Resizing — It&apos;s Free ↓
            </a>
            <a href="#tools" className={styles["home-hero-secondary"]}>
              Explore all tools ↓
            </a>
          </div>
        </Reveal> */}
        {/* <Reveal delay={320}>
          <ul className={styles["home-hero-trust"]}>
            <li>No signup required</li>
            <li>Nothing ever stored</li>
            <li>100% free</li>
          </ul>
        </Reveal> */}
      </div>
    </section>
  );
}
