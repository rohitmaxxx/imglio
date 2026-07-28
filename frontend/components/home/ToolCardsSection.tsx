import Link from "next/link";
import Reveal from "@/components/about/Reveal";
import styles from "@/components/home/ToolCards.module.css";

const TOOLS = [
  {
    name: "Resize Image",
    href: "#upload-zone",
    desc: "Exact dimensions, percentage scaling, or social media presets.",
    accent: "blue",
    icon: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </>
    ),
  },
  {
    name: "Compress Image",
    href: "/compress",
    desc: "Shrink file size while keeping the quality you need.",
    accent: "green",
    icon: <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />,
  },
  {
    name: "Crop Image",
    href: "/crop",
    desc: "Select any area and crop your photo in one click.",
    accent: "amber",
    icon: (
      <>
        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
        <path d="M18 22V8a2 2 0 0 0-2-2H2" />
      </>
    ),
  },
  {
    name: "Rotate Image",
    href: "/rotate",
    desc: "Turn images left, right, or flip to any angle you need.",
    accent: "purple",
    icon: (
      <>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <polyline points="21 3 21 9 15 9" />
      </>
    ),
  },
];

export default function ToolCardsSection() {
  return (
    <section id="tools" aria-labelledby="tools-heading" className={styles["tools-section"]}>
      <Reveal className={styles["tools-heading-wrap"]}>
        <span className={styles["tools-kicker"]}>Everything In One Place</span>
        <h2 id="tools-heading" className={styles["tools-title"]}>
          Every image tool you need, free
        </h2>
      </Reveal>
      <div className={styles["tools-grid"]}>
        {TOOLS.map((tool, i) => (
          <Reveal key={tool.name} delay={i * 70}>
            <Link href={tool.href} className={styles["tool-card-link"]} aria-label={`Try ${tool.name}`}>
              <div className={`${styles["tool-card-icon"]} ${styles[`tool-card-icon-${tool.accent}`]}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  {tool.icon}
                </svg>
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.desc}</p>
              <span className={styles["tool-card-cta"]} aria-hidden="true">
                Try it →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
