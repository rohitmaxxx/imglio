import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
import aboutStyles from "@/components/about/About.module.css";
import styles from "@/components/contact/Contact.module.css";

const description = "Have a question, feedback, or a feature request for pixanzo? Send us a message and let us know what's on your mind.";

export const metadata: Metadata = {
  title: "Contact Us",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact pixanzo",
    description,
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact pixanzo",
    description,
  },
};

export default function ContactPage() {
  return (
    <div className={aboutStyles["about-page"]}>
      <ContactHero />
      <section className={`${aboutStyles["about-section"]} ${styles["contact-section"]}`}>
        <div className={styles["contact-layout"]}>
          <ContactForm />
          <ContactInfoPanel />
        </div>
      </section>
    </div>
  );
}
