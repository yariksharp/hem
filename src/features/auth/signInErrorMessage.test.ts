import { describe, expect, it } from "vitest";
import { signInErrorMessage } from "./signInErrorMessage";

describe("signInErrorMessage", () => {
  it("explains a wrong email or password", () => {
    expect(signInErrorMessage("invalid_credentials")).toBe(
      "That email and password don't match. Check them and try again.",
    );
  });

  it("asks to confirm the email first", () => {
    expect(signInErrorMessage("email_not_confirmed")).toMatch(/Confirm/);
  });

  it("falls back to a general message for unknown or missing codes", () => {
    const fallback = "We couldn't sign you in just now. Try again in a minute.";
    expect(signInErrorMessage("unexpected_failure")).toBe(fallback);
    expect(signInErrorMessage(undefined)).toBe(fallback);
  });
});
