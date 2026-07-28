import Reveal from "@/components/about/Reveal";
import styles from "@/components/about/About.module.css";

const FEATURES = [
  {
    name: "Resize",
    desc: "Exact pixel dimensions, percentage scaling, or one-tap social media presets — with aspect ratio locking.",
    accent: "blue",
    icon: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />,
  },
  {
    name: "Compress",
    desc: "A live quality slider paired with an optional target file size, so the output lands exactly where you need it.",
    accent: "green",
    icon: <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />,
  },
  {
    name: "Crop",
    desc: "Drag directly on the image to select the exact region you want — precise, visual, no guesswork.",
    accent: "purple",
    icon: <><path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M18 22V8a2 2 0 0 0-2-2H2" /></>,
  },
  {
    name: "Rotate",
    desc: "Quick 90° presets or a free-form angle slider, with a live preview before you commit.",
    accent: "amber",
    icon: <><path d="M21 12a9 9 0 1 1-3-6.7" /><polyline points="21 3 21 9 15 9" /></>,
  },
  {
    name: "Convert",
    desc: "Move between JPG, PNG, and WebP on export, whichever tool you're using.",
    accent: "blue",
    icon: <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />,
  },
  {
    name: "Target File Size",
    desc: "Tell it 800 KB or 2 MB and the resize/compress algorithms search for the closest real match — not a rough guess.",
    accent: "green",
    icon: <path d="M12 20V10M18 20V4M6 20v-4" />,
  },
];

export default function FeaturesSection() {
  return (
    <section className={styles["about-section"]} id="features">
      <Reveal className={styles["about-section-heading"]}>
        <span className={styles["about-kicker"]}>Key Features</span>
        <h2 className={styles["about-section-title"]}>One toolkit, every everyday image task</h2>
      </Reveal>
      <div className={styles["features-grid"]}>
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.name} delay={i * 70} className={`${styles["feature-tile"]} ${styles[`feature-tile-${feature.accent}`]}`}>
            <span className={styles["feature-tile-icon"]}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {feature.icon}
              </svg>
            </span>
            <h3>{feature.name}</h3>
            <p>{feature.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
