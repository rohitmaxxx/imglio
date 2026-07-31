import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import logoStyles from "@/components/Logo.module.css";
import styles from "@/components/Footer.module.css";

export default function Footer() {
  return (
    <>
      <section className={styles["related-section"]}>
        <div className="related-inner">
          <h2 className={styles["related-heading"]}>More Image Tools</h2>
          <div className={styles["related-grid"]}>
            <Link href="/compress" className={styles["related-card"]}>
              <div className={`${styles["related-icon"]} ${styles["related-icon-compress"]}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
              <h3>Image Compressor</h3>
              <p>Shrink image file size while keeping good visual quality.</p>
            </Link>
            <Link href="/crop" className={styles["related-card"]}>
              <div className={`${styles["related-icon"]} ${styles["related-icon-crop"]}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 2v14a2 2 0 0 0 2 2h14" />
                  <path d="M18 22V8a2 2 0 0 0-2-2H2" />
                </svg>
              </div>
              <h3>Crop Image</h3>
              <p>Select any area and crop your photo in one click.</p>
            </Link>
            <Link href="/rotate" className={styles["related-card"]}>
              <div className={`${styles["related-icon"]} ${styles["related-icon-rotate"]}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-3-6.7" />
                  <polyline points="21 3 21 9 15 9" />
                </svg>
              </div>
              <h3>Rotate Image</h3>
              <p>Turn images left, right, or flip to any angle you need.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles["cta-section"]}>
        <div className={styles["cta-box"]}>
          <h2 className={styles["cta-title"]}>Need the Perfect Image Size in Seconds?</h2>
          <p className={styles["cta-desc"]}>
            Upload your photo, set the width and height, and download instantly. Keep aspect ratio, preview changes live, and get clean results — free,
            private, and built for everyday use.
          </p>
          <div className={styles["cta-features"]}>
            <span className={styles["cta-chip"]}>✨ Crystal-clear quality</span>
            <span className={styles["cta-chip"]}>🔒 Private processing</span>
            <span className={styles["cta-chip"]}>⚡ Instant download</span>
            <span className={styles["cta-chip"]}>💯 Always free</span>
            <span className={styles["cta-chip"]}>📐 Exact dimensions</span>
          </div>
          <Link href="/#upload-zone" className={styles["cta-btn"]}>
            Start Resizing Now
          </Link>
        </div>
      </section>

      <footer className={styles["footer"]}>
        <div className={styles["footer-inner"]}>
          <div className="footer-brand">
            <div className={styles["footer-logo"]}>
              <div className={logoStyles["logo-icon"]}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect x="6" y="8" width="16" height="16" rx="3" fill="#10B981" />
                  <rect x="10" y="4" width="16" height="16" rx="3" stroke="#059669" strokeWidth="2" fill="white" />
                  <circle cx="14" cy="10" r="2" fill="#10B981" />
                  <path d="M10 18l4-3 3 2 5-6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 22h4v4M26 22l-4 4" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className={logoStyles["logo-text"]}>
                <span className={styles["footer-logo-title"]}>pixanzo</span>
                <span className={styles["footer-logo-tagline"]}>FAST · FREE · SECURE</span>
              </div>
            </div>
            <p className={styles["footer-desc"]}>Fast, free, and secure online tools to convert, edit, optimize, and generate files directly in your browser.</p>
            <div className={styles["footer-social"]}>
              <a href="#" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          <div className={styles["footer-col"]}>
            <h4>Stay Updated</h4>
            <p className={styles["footer-newsletter-desc"]}>New tools and improvements, occasionally. No spam.</p>
            <NewsletterForm />
          </div>
          <div className={styles["footer-col"]}>
            <h4>Popular Tools</h4>
            <ul>
              <li>
                <Link href="/">Image Resizer</Link>
              </li>
              <li>
                <Link href="/compress">Image Compressor</Link>
              </li>
              <li>
                <Link href="/crop">Crop Image</Link>
              </li>
              <li>
                <Link href="/rotate">Rotate Image</Link>
              </li>
            </ul>
          </div>
          <div className={styles["footer-col"]}>
            <h4>Categories</h4>
            <ul>
              <li>
                <Link href="/">Image Tools</Link>
              </li>
              <li>
                <Link href="/compress">Compress</Link>
              </li>
              <li>
                <Link href="/crop">Crop</Link>
              </li>
              <li>
                <Link href="/rotate">Rotate</Link>
              </li>
            </ul>
          </div>
          <div className={styles["footer-col"]}>
            <h4>Company</h4>
            <ul>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
