import type { Metadata } from "next";
import { SignInForm } from "@/features/auth/SignInForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sign in · Hem",
};

// S01 Sign in: form on the left, brand panel on the right (desktop only).
// The needle animation in the panel comes later.
export default function SignInPage() {
  return (
    <main className={styles.page}>
      <div className={styles.formSide}>
        <span className={styles.wordmark}>
          hem<span className={styles.dot}>.</span>
        </span>
        <SignInForm />
        <p className={styles.footer}>
          Your CV stays yours. Hem never invents experience.
        </p>
      </div>

      <aside className={styles.panel} aria-label="About Hem">
        <div className={styles.panelText}>
          <p className={styles.tagline}>
            Tailor your CV. <span className={styles.iri}>Keep it true.</span>
          </p>
          <p className={styles.panelLead}>
            Every change marked, explained and reversible.
          </p>
        </div>
      </aside>
    </main>
  );
}
