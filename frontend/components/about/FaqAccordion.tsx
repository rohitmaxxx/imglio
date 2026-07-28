"use client";

import { useState } from "react";
import styles from "@/components/about/About.module.css";

export interface FaqItemData {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItemData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div className={`${styles["faq-item"]}${open ? ` ${styles["open"]}` : ""}`} key={item.question}>
            <button
              type="button"
              className={styles["faq-question"]}
              aria-expanded={open}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span>{item.question}</span>
              <svg className={styles["faq-chevron"]} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div id={`faq-panel-${i}`} className={styles["faq-answer"]} role="region">
              <div className={styles["faq-answer-inner"]}>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
