import Reveal from "@/components/about/Reveal";
import styles from "@/components/about/About.module.css";

export default function MissionVisionSection() {
  return (
    <section className={styles["about-section"]}>
      <div className={styles["mission-vision-grid"]}>
        <Reveal className={`${styles["mission-vision-card"]} ${styles["mission-card"]}`}>
          <span className={styles["mission-vision-icon"]}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </span>
          <h3>Our Mission</h3>
          <p>
            To make everyday image editing instant, accessible, and free for everyone — regardless of technical skill, device, or budget. If a task
            takes more than a few clicks, we&apos;ve failed at it.
          </p>
        </Reveal>
        <Reveal delay={120} className={`${styles["mission-vision-card"]} ${styles["vision-card"]}`}>
          <span className={styles["mission-vision-icon"]}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
          <h3>Our Vision</h3>
          <p>
            A web where basic creative tools are as frictionless as a search bar — no account walls, no dark patterns, no wondering what happens to
            the photo you just uploaded.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
