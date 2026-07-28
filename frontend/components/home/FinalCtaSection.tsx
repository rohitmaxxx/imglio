import Reveal from "@/components/about/Reveal";
import styles from "@/components/home/FinalCta.module.css";

export default function FinalCtaSection() {
  return (
    <section aria-labelledby="final-cta-heading" className={styles["final-cta-section"]}>
      <Reveal className={styles["final-cta-box"]}>
        <h2 id="final-cta-heading" className={styles["final-cta-title"]}>
          Ready to fix that image in the next 10 seconds?
        </h2>
        <p className={styles["final-cta-desc"]}>No signup, no watermark, no catch — just upload and go.</p>
        <a href="#upload-zone" className={styles["final-cta-btn"]}>
          Start Resizing — It&apos;s Free
        </a>
      </Reveal>
    </section>
  );
}
