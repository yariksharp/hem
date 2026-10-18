import { useId, type ComponentPropsWithRef } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = ComponentPropsWithRef<"input"> & {
  label: string;
  /** Hint under the field. Hidden while there is an error. */
  help?: string;
  /** Error under the field. Also marks the input as invalid. */
  error?: string;
};

// Label above, input, then help or error text below (handoff spec §6.2).
export function TextField({
  label,
  help,
  error,
  id,
  className,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const noteId = `${inputId}-note`;
  const note = error ?? help;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={note ? noteId : undefined}
        {...rest}
      />
      {note && (
        <p id={noteId} className={error ? styles.error : styles.help}>
          {note}
        </p>
      )}
    </div>
  );
}
