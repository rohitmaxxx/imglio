import Link from "next/link";
import Reveal from "@/components/about/Reveal";
import FaqAccordion from "@/components/about/FaqAccordion";
import styles from "@/components/home/FaqPreview.module.css";

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
    question: "Do I need to create an account?",
    answer: "No — every image tool works immediately without signing up.",
  },
  {
    question: "Can I use pixanzo on my phone?",
    answer: "Yes. The entire interface is fully responsive and works the same way on mobile, tablet, and desktop browsers.",
  },
];

export default function FaqPreviewSection() {
  return (
    <section aria-labelledby="faq-heading" className={styles["faq-section"]}>
      <Reveal className={styles["faq-heading-wrap"]}>
        <span className={styles["faq-kicker"]}>FAQ</span>
        <h2 id="faq-heading" className={styles["faq-title"]}>
          Frequently asked questions
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <FaqAccordion items={FAQS} />
      </Reveal>
      <Link href="/about" className={styles["faq-more-link"]}>
        More questions? Visit our About page →
      </Link>
    </section>
  );
}
