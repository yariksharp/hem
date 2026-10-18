import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = ComponentPropsWithRef<"input"> & {
  label: string;
  /** Hint under the field. Hidden while there is an error. */
  help?: string;
  /** Error under the field. Also marks the input as invalid. */
  error?: string;
  /** Small control inside the right edge of the input, e.g. a Show/Hide button. */
  action?: ReactNode;
};

// Label above, input, then help or error text below (handoff spec §6.2).
export function TextField({
  label,
  help,
  error,
  action,
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
      <div className={styles.control}>
        <input
          id={inputId}
          className={[styles.input, action && styles.withAction]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? noteId : undefined}
          {...rest}
        />
        {action && <span className={styles.action}>{action}</span>}
      </div>
      {note && (
        <p id={noteId} className={error ? styles.error : styles.help}>
          {note}
        </p>
      )}
    </div>
  );
}
