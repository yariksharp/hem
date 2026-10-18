"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInErrorMessage } from "./signInErrorMessage";
import { validateSignIn } from "./validateSignIn";

export type SignInState = { error: string };

// Server Function for the sign-in form. Runs on the server, so the Supabase
// session cookies are set in the response.
export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // Checked again here: the browser check can be skipped.
  const invalid = validateSignIn(email, password);
  if (invalid) {
    return { error: invalid };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Only the code and status: never the password, the email or the full error object.
    console.error("Sign-in failed:", error.code ?? "no_code", error.status);
    return { error: signInErrorMessage(error.code) };
  }

  // redirect() throws on purpose, so it must stay outside any try/catch.
  redirect("/");
}
