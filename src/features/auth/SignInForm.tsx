"use client";

import {
  startTransition,
  useActionState,
  useState,
  type FormEvent,
} from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { signIn, type SignInState } from "./actions";
import { validateSignIn } from "./validateSignIn";
import styles from "./SignInForm.module.css";

const initialState: SignInState = { error: "" };

// Sign-in form (handoff spec S01). The empty check runs here first, then the
// signIn Server Function talks to Supabase Auth and goes to / on success.
export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emptyError, setEmptyError] = useState("");
  const [shake, setShake] = useState(false);
  const [state, signInAction, pending] = useActionState(signIn, initialState);

  // A <form> with a submit button, so Enter in either field submits.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const message = validateSignIn(email, password);
    if (message) {
      setEmptyError(message);
      setShake(true);
      return;
    }
    setEmptyError("");

    // Called by hand instead of <form action>, so React doesn't reset the fields after an error.
    const formData = new FormData(event.currentTarget);
    startTransition(() => signInAction(formData));
  }

  const error = emptyError || (pending ? "" : state.error);

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
        disabled={pending}
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={pending}
        action={
          <Button
            variant="ghost"
            size="sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((shown) => !shown)}
            disabled={pending}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        }
      />
      {error && <Alert>{error}</Alert>}
      <Button
        type="submit"
        fullWidth
        loading={pending}
        loadingLabel="Signing in…"
        className={styles.submit}
      >
        Sign in
      </Button>
    </form>
  );
}
