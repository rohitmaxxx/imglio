import Reveal from "@/components/about/Reveal";
import AnimatedCounter from "@/components/about/AnimatedCounter";
import styles from "@/components/home/HomeStats.module.css";

const STATS = [
  { value: 50, suffix: "K+", label: "Images Processed" },
  { value: 99, suffix: "%", label: "Uptime" },
  { value: 6, suffix: "", label: "Formats Supported" },
  { value: 10, prefix: "<", suffix: "s", label: "Avg. Processing Time" },
];

export default function HomeStats() {
  return (
    <section aria-labelledby="stats-heading" className={styles["stats-section"]}>
      <div className={styles["stats-inner"]}>
        <h2 id="stats-heading" className={styles["stats-heading"]}>
          Built for real workloads
        </h2>
        <div className={styles["stats-grid"]}>
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90} className={styles["stat-card"]}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <p className={styles["stat-label"]}>{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
