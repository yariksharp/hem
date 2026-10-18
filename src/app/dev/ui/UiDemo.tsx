"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import styles from "./page.module.css";

// The sign-in form here is a look-alike only: nothing is sent anywhere.
export function UiDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>UI components</h1>
        <p className={styles.lead}>
          Test page for Button, TextField and Alert. Press Tab to move through
          it.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="demo-signin">
        <h2 id="demo-signin" className={styles.sectionTitle}>
          Sign-in form (demo)
        </h2>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <Alert>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            loading={loading}
            loadingLabel="Signing in…"
          >
            Sign in
          </Button>
        </form>
        <p className={styles.note}>
          Submit empty to see the error. Fill both fields to see the loading
          state. Enter in either field submits.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="demo-buttons">
        <h2 id="demo-buttons" className={styles.sectionTitle}>
          Button
        </h2>
        <div className={styles.row}>
          <Button>Save</Button>
          <Button loading loadingLabel="Saving…">
            Save
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        <Button fullWidth>Full width</Button>
      </section>

      <section className={styles.section} aria-labelledby="demo-fields">
        <h2 id="demo-fields" className={styles.sectionTitle}>
          TextField
        </h2>
        <TextField
          label="Job title"
          placeholder="Project manager"
          help="As it appears on the job ad."
        />
        <TextField
          label="Email"
          type="email"
          defaultValue="not-an-email"
          error="Enter an email address like name@example.com."
        />
        <TextField label="Disabled" disabled defaultValue="Read only" />
      </section>

      <section className={styles.section} aria-labelledby="demo-alert">
        <h2 id="demo-alert" className={styles.sectionTitle}>
          Alert
        </h2>
        <Alert>Something went wrong. Try again in a minute.</Alert>
      </section>
    </main>
  );
}
