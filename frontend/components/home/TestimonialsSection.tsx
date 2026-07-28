import Reveal from "@/components/about/Reveal";
import styles from "@/components/home/Testimonials.module.css";

const TESTIMONIALS = [
  {
    initials: "AR",
    name: "Alex R.",
    role: "Freelance Designer",
    avatar: "primary" as const,
    quote: "I use this every week for client deliverables. No account, no waiting — just drop the file and it's done.",
  },
  {
    initials: "MP",
    name: "Maria P.",
    role: "Content Creator",
    avatar: "accent" as const,
    quote: "The social media presets alone save me so much time. Exactly the sizes I need, every time.",
  },
  {
    initials: "JK",
    name: "Jordan K.",
    role: "Small Business Owner",
    avatar: "primary" as const,
    quote: "Simple, fast, and it just works. I don't need anything fancier for resizing product photos.",
  },
];

export default function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-heading" className={styles["testimonials-section"]}>
      <Reveal className={styles["testimonials-heading-wrap"]}>
        <span className={styles["testimonials-kicker"]}>What People Say</span>
        <h2 id="testimonials-heading" className={styles["testimonials-title"]}>
          Loved by people who just need it done
        </h2>
      </Reveal>
      <div className={styles["testimonials-grid"]}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 90} className={styles["testimonial-card"]}>
            <figure className={styles["testimonial-figure"]}>
              <span className={styles["testimonial-stars"]} aria-label="5 out of 5 stars">
                <span aria-hidden="true">★★★★★</span>
              </span>
              <blockquote className={styles["testimonial-quote"]}>{t.quote}</blockquote>
              <figcaption className={styles["testimonial-author"]}>
                <span className={`${styles["testimonial-avatar"]} ${styles[`testimonial-avatar-${t.avatar}`]}`} aria-hidden="true">
                  {t.initials}
                </span>
                <span>
                  <span className={styles["testimonial-name"]}>{t.name}</span>
                  <span className={styles["testimonial-role"]}>{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
