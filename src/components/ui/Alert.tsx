import type { ComponentPropsWithRef } from "react";
import styles from "./Alert.module.css";

type AlertProps = ComponentPropsWithRef<"div">;

// Error alert (handoff spec §6.16). role="alert" makes screen readers read it out when it appears.
// The warning style comes with the screen that needs it.
export function Alert({ className, children, ...rest }: AlertProps) {
  return (
    <div
      role="alert"
      className={[styles.alert, styles.error, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
