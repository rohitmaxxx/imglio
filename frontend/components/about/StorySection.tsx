import Reveal from "@/components/about/Reveal";
import styles from "@/components/about/About.module.css";

export default function StorySection() {
  return (
    <section className={styles["about-section"]}>
      <div className={styles["about-story-grid"]}>
        <Reveal className="about-story-copy">
          <span className={styles["about-kicker"]}>Our Story</span>
          <h2 className={styles["about-section-title"]}>Built out of frustration with bloated image tools</h2>
          <p className={styles["about-body"]}>
            Most online image editors bury a simple resize behind ten popup ads, a forced signup, and a watermark on the result. pixanzo exists
            because that shouldn&apos;t be the price of shrinking a photo before you email it.
          </p>
          <p className={styles["about-body"]}>
            We stripped the experience down to exactly what people actually need — upload, adjust, download — and made every tool fast enough to
            feel instant. No dashboards to learn, no account to babysit, no image library to opt out of.
          </p>
        </Reveal>
        <Reveal delay={120} className="about-story-visual">
          <div className={styles["about-story-card"]}>
            <div className={styles["about-story-row"]}>
              <span className={`${styles["about-story-icon"]} ${styles["about-story-icon-blue"]}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <div>
                <strong>Upload</strong>
                <p>Drag a file in — no account, no waiting room.</p>
              </div>
            </div>
            <div className={styles["about-story-row"]}>
              <span className={`${styles["about-story-icon"]} ${styles["about-story-icon-green"]}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
              <div>
                <strong>Adjust</strong>
                <p>Live preview while you dial in size, quality, or angle.</p>
              </div>
            </div>
            <div className={styles["about-story-row"]}>
              <span className={`${styles["about-story-icon"]} ${styles["about-story-icon-amber"]}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
              <div>
                <strong>Download</strong>
                <p>Your file, done — nothing kept on our end.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
