import { describe, expect, it } from "vitest";
import { EMPTY_SIGN_IN_ERROR, validateSignIn } from "./validateSignIn";

describe("validateSignIn", () => {
  it("asks for both fields when both are empty", () => {
    expect(validateSignIn("", "")).toBe(EMPTY_SIGN_IN_ERROR);
  });

  it("treats an email of only spaces as empty", () => {
    expect(validateSignIn("   ", "secret")).toBe(EMPTY_SIGN_IN_ERROR);
  });

  it("asks for the password when it is missing", () => {
    expect(validateSignIn("test@example.com", "")).toBe(EMPTY_SIGN_IN_ERROR);
  });

  it("passes when both fields are filled", () => {
    expect(validateSignIn("test@example.com", "secret")).toBeNull();
  });
});
