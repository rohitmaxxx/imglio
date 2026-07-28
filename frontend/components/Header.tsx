import Link from "next/link";
import { getServerUser } from "@/lib/auth";
import NavMenu from "@/components/NavMenu";
import logoStyles from "@/components/Logo.module.css";
import styles from "@/components/Navbar.module.css";

export default async function Header() {
  const user = await getServerUser();

  return (
    <header className={styles["header"]}>
      <div className={styles["header-inner"]}>
        <Link href="/" className={logoStyles["logo"]} style={{ textDecoration: "none" }}>
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
            <span className={logoStyles["logo-title"]}>pixanzo</span>
          </div>
        </Link>

        <div className={styles["search-bar"]}>
          <svg className={styles["search-icon"]} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search 150+ online tools..." disabled aria-label="Search tools (coming soon)" />
        </div>

        <NavMenu user={user} />
      </div>
    </header>
  );
}
