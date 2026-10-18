import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { signOut } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

// Placeholder home page. Only for signed-in users.
export default async function Home() {
  // The proxy already redirects signed-out visitors; this check is the
  // real guard, because a proxy alone is not enough for authorisation.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/sign-in");
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.wordmark}>
        hem<span className={styles.dot}>.</span>
      </h1>
      <p className={styles.note}>Coming soon.</p>
      <p className={styles.env}>
        Environment: {process.env.NEXT_PUBLIC_APP_ENV}
      </p>
      <form action={signOut}>
        <Button type="submit" variant="ghost">
          Sign out
        </Button>
      </form>
    </main>
  );
}
