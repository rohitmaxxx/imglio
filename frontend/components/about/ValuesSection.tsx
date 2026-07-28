import Reveal from "@/components/about/Reveal";
import styles from "@/components/about/About.module.css";

const VALUES = [
  { title: "Simplicity", desc: "Do a small number of things extremely well, instead of everything passably." },
  { title: "Privacy", desc: "Your images are yours. We process them and let them go — nothing is retained." },
  { title: "Speed", desc: "Every interaction should feel instant. Waiting is the enemy of a good tool." },
  { title: "Accessibility", desc: "The core tools stay free, forever, for anyone with a browser." },
];

export default function ValuesSection() {
  return (
    <section className={styles["about-section"]}>
      <Reveal className={styles["about-section-heading"]}>
        <span className={styles["about-kicker"]}>Our Values</span>
        <h2 className={styles["about-section-title"]}>The principles behind every decision</h2>
      </Reveal>
      <div className={styles["values-grid"]}>
        {VALUES.map((value, i) => (
          <Reveal key={value.title} delay={i * 80} className={styles["value-card"]}>
            <span className={styles["value-index"]}>{String(i + 1).padStart(2, "0")}</span>
            <h3>{value.title}</h3>
            <p>{value.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
