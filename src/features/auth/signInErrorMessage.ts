// Turns a Supabase Auth error code into a calm message that says what happened
// and what to do (handoff spec §2.7). Codes: @supabase/auth-js ErrorCode.
export function signInErrorMessage(code: string | undefined): string {
  switch (code) {
    case "invalid_credentials":
      return "That email and password don't match. Check them and try again.";
    case "email_not_confirmed":
      return "Confirm your email first. Open the link we sent you, then sign in.";
    case "over_request_rate_limit":
      return "Too many tries in a row. Wait a few minutes, then try again.";
    default:
      return "We couldn't sign you in just now. Try again in a minute.";
  }
}
