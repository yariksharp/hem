"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { validateSignIn } from "./validateSignIn";
import styles from "./SignInForm.module.css";

// Sign-in form (handoff spec S01). Not connected to Supabase yet: that is HEM-57.
export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  // A <form> with a submit button, so Enter in either field submits.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateSignIn(email, password);
    if (message) {
      setError(message);
      setShake(true);
      return;
    }
    setError("");
  }

  return (
    <form
      className={[styles.form, shake && styles.shake].filter(Boolean).join(" ")}
      onSubmit={handleSubmit}
      // Remove the class when the shake ends, so the next empty submit shakes again.
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) setShake(false);
      }}
      noValidate
    >
      <div className={styles.intro}>
        <h1 className={styles.title}>Welcome back.</h1>
        <p className={styles.lead}>Sign in to tailor your next CV.</p>
      </div>
      <TextField
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        action={
          <Button
            variant="ghost"
            size="sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((shown) => !shown)}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        }
      />
      {error && <Alert>{error}</Alert>}
      <Button type="submit" fullWidth className={styles.submit}>
        Sign in
      </Button>
    </form>
  );
}
