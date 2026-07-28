"use client";

import type { CSSProperties, ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "@/components/Reveal.module.css";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Fades and slides an element up into place the first time it scrolls into view. */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const style: CSSProperties = { transitionDelay: `${delay}ms` };

  return (
    <div
      ref={ref}
      className={`${styles["reveal"]}${isVisible ? ` ${styles["reveal-visible"]}` : ""}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
