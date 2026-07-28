import Reveal from "@/components/about/Reveal";
import aboutStyles from "@/components/about/About.module.css";
import toolCardStyles from "@/components/ToolCard.module.css";
import styles from "@/components/contact/Contact.module.css";

export default function ContactHero() {
  return (
    <section className={styles["contact-hero"]}>
      <div className={styles["contact-hero-glow"]} aria-hidden="true" />
      <div className={styles["contact-hero-inner"]}>
        <Reveal>
          <span className={aboutStyles["about-eyebrow"]}>
            <span className={toolCardStyles["badge-dot"]}></span> GET IN TOUCH
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className={styles["contact-hero-title"]}>Contact Us</h1>
        </Reveal>
        <Reveal delay={160}>
          <p className={styles["contact-hero-subtitle"]}>
            Have a question, some feedback, or a feature you&apos;d like to see? Send us a message and tell us what&apos;s on your mind.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
