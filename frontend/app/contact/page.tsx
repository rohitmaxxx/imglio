import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
import aboutStyles from "@/components/about/About.module.css";
import styles from "@/components/contact/Contact.module.css";

const description = "Have a question, feedback, or a feature request for Pixanzo? Send us a message and let us know what's on your mind.";

export const metadata: Metadata = {
  title: "Contact Pixanzo",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Pixanzo",
    description,
    url: "/contact",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Pixanzo",
    description,
    images: ["/og-image.png"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://pixanzo.com/" },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://pixanzo.com/contact" },
  ],
};

export default function ContactPage() {
  return (
    <div className={aboutStyles["about-page"]}>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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
