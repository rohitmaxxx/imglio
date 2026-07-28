import Reveal from "@/components/about/Reveal";
import AnimatedCounter from "@/components/about/AnimatedCounter";
import styles from "@/components/about/About.module.css";

const STATS = [
  { value: 100, suffix: "%", label: "Free, always" },
  { value: 99, suffix: "%", label: "Target file size accuracy" },
  { value: 6, suffix: "", label: "Image formats supported" },
  { value: 7, suffix: "", label: "Social media presets" },
];

export default function StatsSection() {
  return (
    <section className={`${styles["about-section"]} ${styles["stats-section"]}`}>
      <div className={styles["stats-grid"]}>
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 90} className={styles["stat-card"]}>
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <p className={styles["stat-label"]}>{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
