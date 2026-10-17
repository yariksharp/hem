import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.wordmark}>
        hem<span className={styles.dot}>.</span>
      </h1>
      <p className={styles.note}>Coming soon.</p>
      <p className={styles.env}>
        Environment: {process.env.NEXT_PUBLIC_APP_ENV}
      </p>
    </main>
  );
}
