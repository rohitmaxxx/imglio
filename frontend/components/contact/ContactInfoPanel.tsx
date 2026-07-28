import Reveal from "@/components/about/Reveal";
import styles from "@/components/contact/Contact.module.css";

const TOPICS = [
  { title: "Feature requests", desc: "Tell us what tool or option you wish pixanzo had." },
  { title: "Bug reports", desc: "Something not resizing, cropping, or downloading right? Let us know." },
  { title: "General feedback", desc: "Good or bad, we read every message that comes through." },
];

export default function ContactInfoPanel() {
  return (
    <Reveal delay={120} className={styles["contact-info-panel"]}>
      <h2>What can we help with?</h2>
      <ul className={styles["contact-topic-list"]}>
        {TOPICS.map((topic) => (
          <li key={topic.title}>
            <span className={styles["contact-topic-dot"]} aria-hidden="true" />
            <div>
              <strong>{topic.title}</strong>
              <p>{topic.desc}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles["contact-info-note"]}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p>Your details are only used to get back to you about this message — nothing else.</p>
      </div>
    </Reveal>
  );
}
