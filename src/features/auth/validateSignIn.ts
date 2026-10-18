export const EMPTY_SIGN_IN_ERROR = "Enter your email and password to continue.";

// Returns the message to show, or null when the form can be sent.
// The password is not trimmed: spaces can be part of a real password.
export function validateSignIn(email: string, password: string): string | null {
  if (!email.trim() || !password) {
    return EMPTY_SIGN_IN_ERROR;
  }
  return null;
}
