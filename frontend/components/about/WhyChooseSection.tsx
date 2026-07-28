import Reveal from "@/components/about/Reveal";
import styles from "@/components/about/About.module.css";

const REASONS = [
  {
    title: "No signup, ever",
    desc: "Every core tool works the moment you land on the page. Create an account only if you want to.",
    icon: (
      <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    ),
  },
  {
    title: "Nothing is stored",
    desc: "Images are processed in memory and streamed straight back to you — never written to disk.",
    icon: <path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" />,
  },
  {
    title: "Precise by design",
    desc: "Set an exact target file size in KB or MB and get within a percent or two of it, automatically.",
    icon: <path d="M12 20V10M18 20V4M6 20v-4" />,
  },
  {
    title: "Fast on any device",
    desc: "A lightweight, responsive interface that feels the same on a phone as it does on a desktop.",
    icon: <path d="M4 4h16v12H4zM8 20h8M12 16v4" />,
  },
];

export default function WhyChooseSection() {
  return (
    <section className={styles["about-section"]}>
      <Reveal className={styles["about-section-heading"]}>
        <span className={styles["about-kicker"]}>Why Choose Us</span>
        <h2 className={styles["about-section-title"]}>Everything you&apos;d want, nothing you wouldn&apos;t</h2>
      </Reveal>
      <div className={styles["why-choose-grid"]}>
        {REASONS.map((reason, i) => (
          <Reveal key={reason.title} delay={i * 90} className={styles["why-choose-card"]}>
            <span className={styles["why-choose-icon"]}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {reason.icon}
              </svg>
            </span>
            <h3>{reason.title}</h3>
            <p>{reason.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
