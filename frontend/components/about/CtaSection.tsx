import Link from "next/link";
import Reveal from "@/components/about/Reveal";
import styles from "@/components/about/About.module.css";

export default function CtaSection() {
  return (
    <section className={styles["about-section"]}>
      <Reveal className={styles["about-final-cta"]}>
        <h2>Ready to fix that image in the next 10 seconds?</h2>
        <p>No account, no watermark, no catch — just upload and go.</p>
        <Link href="/" className={styles["about-final-cta-btn"]}>
          Open the Resizer
        </Link>
      </Reveal>
    </section>
  );
}
