import Reveal from "@/components/about/Reveal";
import styles from "@/components/about/About.module.css";

const STACK = [
  { name: "Next.js", role: "Frontend framework" },
  { name: "React", role: "UI library" },
  { name: "TypeScript", role: "Type safety" },
  { name: "FastAPI", role: "Backend API" },
  { name: "Python", role: "Image processing" },
  { name: "Pillow", role: "Image engine" },
];

export default function TechStackSection() {
  return (
    <section className={styles["about-section"]}>
      <Reveal className={styles["about-section-heading"]}>
        <span className={styles["about-kicker"]}>Technologies We Use</span>
        <h2 className={styles["about-section-title"]}>Built on a modern, reliable stack</h2>
      </Reveal>
      <div className={styles["tech-grid"]}>
        {STACK.map((tech, i) => (
          <Reveal key={tech.name} delay={i * 60} className={styles["tech-chip"]}>
            <span className={styles["tech-chip-dot"]} aria-hidden="true" />
            <span>
              <strong>{tech.name}</strong>
              <small>{tech.role}</small>
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
