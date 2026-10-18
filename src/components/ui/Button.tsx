"use client";

import type { ComponentPropsWithRef } from "react";
import styles from "./Button.module.css";

type ButtonProps = ComponentPropsWithRef<"button"> & {
  /** "primary" = ink fill for main user actions; "ghost" = quiet text button (e.g. Show/Hide). */
  variant?: "primary" | "ghost";
  /** "sm" = 32px high, only inside dense spots like a field. */
  size?: "md" | "sm";
  /** Stretch to the width of the parent (e.g. "Sign in"). */
  fullWidth?: boolean;
  /** Show a spinner and ignore clicks while waiting. */
  loading?: boolean;
  /** Label shown while loading, e.g. "Signing in…". Defaults to the normal label. */
  loadingLabel?: string;
};

// Button (handoff spec §6.1). Other variants come with the screens that need them.
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  loadingLabel,
  type = "button",
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size === "sm" && styles.sm,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      // aria-disabled instead of disabled while loading, so keyboard focus stays on the button.
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        // Also stops a form submit (click or Enter in a field) while waiting.
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span>{loading && loadingLabel ? loadingLabel : children}</span>
    </button>
  );
}
