import Reveal from "@/components/about/Reveal";
import FaqAccordion from "@/components/about/FaqAccordion";
import styles from "@/components/about/About.module.css";

const FAQS = [
  {
    question: "Is pixanzo really free?",
    answer: "Yes. Resize, compress, crop, and rotate are free to use with no limits on how often you use them and no account required.",
  },
  {
    question: "Do you store my uploaded images?",
    answer:
      "No. Images are processed in memory and streamed straight back to you as a download — they are never written to disk or kept after your request completes.",
  },
  {
    question: "What image formats are supported?",
    answer: "PNG, JPG/JPEG, GIF, WebP, BMP, and TIFF are all supported for upload, with JPG, PNG, and WebP available as export formats.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No — every image tool works immediately without signing up. An account is only needed for optional future features.",
  },
  {
    question: "Is there a file size limit?",
    answer: "There's no artificial cap on upload size. Very large images simply take a little longer to process.",
  },
  {
    question: "Can I use pixanzo on my phone?",
    answer: "Yes. The entire interface is fully responsive and works the same way on mobile, tablet, and desktop browsers.",
  },
];

export default function FaqSection() {
  return (
    <section className={styles["about-section"]}>
      <Reveal className={styles["about-section-heading"]}>
        <span className={styles["about-kicker"]}>FAQ</span>
        <h2 className={styles["about-section-title"]}>Frequently asked questions</h2>
      </Reveal>
      <Reveal delay={100} className={styles["faq-wrap"]}>
        <FaqAccordion items={FAQS} />
      </Reveal>
    </section>
  );
}
