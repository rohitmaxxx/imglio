import Reveal from "@/components/about/Reveal";
import styles from "@/components/about/About.module.css";

const STEPS = [
  {
    step: "01",
    title: "Upload your image",
    desc: "Drag and drop, or click to browse. Works with PNG, JPG, GIF, WebP, BMP, and TIFF.",
  },
  {
    step: "02",
    title: "Choose your tool & settings",
    desc: "Pick resize, compress, crop, or rotate, then fine-tune with a live preview as you go.",
  },
  {
    step: "03",
    title: "Download instantly",
    desc: "Your finished image streams straight to your device — nothing is kept on our servers.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className={styles["about-section"]}>
      <Reveal className={styles["about-section-heading"]}>
        <span className={styles["about-kicker"]}>How It Works</span>
        <h2 className={styles["about-section-title"]}>From upload to download in three steps</h2>
      </Reveal>
      <div className={styles["steps-track"]}>
        {STEPS.map((item, i) => (
          <Reveal key={item.step} delay={i * 110} className={styles["step-card"]}>
            <span className={styles["step-number"]}>{item.step}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
