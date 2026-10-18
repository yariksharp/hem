import { expect, test, type Locator, type Page } from "@playwright/test";

// The test account's details come from env variables (.env.local or GitHub secrets),
// never from this file. Use a separate test account, not your own.
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

if (process.env.CI && (!email || !password)) {
  throw new Error("E2E_EMAIL and E2E_PASSWORD must be set as GitHub secrets.");
}

function controls(page: Page) {
  return {
    email: page.getByLabel("Email", { exact: true }),
    password: page.getByLabel("Password", { exact: true }),
    showHide: page.getByRole("button", { name: /^(Show|Hide) password$/ }),
    signIn: page.getByRole("button", { name: "Sign in" }),
    // Inside the form: Next.js adds its own hidden role="alert" route announcer.
    alert: page.locator("form").getByRole("alert"),
  };
}

// The focus ring must be 2px solid --hem-focus with a 2px offset (handoff spec §2.8).
async function expectFocusRing(control: Locator) {
  const ring = await control.evaluate((element) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--hem-focus)";
    document.body.append(probe);
    const focusColour = getComputedStyle(probe).color;
    probe.remove();

    const style = getComputedStyle(element);
    return {
      style: style.outlineStyle,
      width: style.outlineWidth,
      offset: style.outlineOffset,
      matchesToken: style.outlineColor === focusColour,
    };
  });
  expect(ring).toEqual({
    style: "solid",
    width: "2px",
    offset: "2px",
    matchesToken: true,
  });
}

test("a signed-out visitor is sent to sign-in", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
});

test.describe("keyboard check", () => {
  test("Tab reaches every control in order, with a visible focus ring", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    const c = controls(page);

    for (const control of [c.email, c.password, c.showHide, c.signIn]) {
      await page.keyboard.press("Tab");
      await expect(control).toBeFocused();
      await expectFocusRing(control);
    }
  });

  test("Enter submits from the email field and from the password field", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    const c = controls(page);

    await c.email.focus();
    await page.keyboard.press("Enter");
    await expect(c.alert).toHaveText(
      "Enter your email and password to continue.",
    );

    await c.password.focus();
    await page.keyboard.press("Enter");
    await expect(c.alert).toHaveText(
      "Enter your email and password to continue.",
    );
  });

  test("Show / Hide works from the keyboard", async ({ page }) => {
    await page.goto("/sign-in");
    const c = controls(page);

    await c.showHide.focus();
    await page.keyboard.press("Enter");
    await expect(c.password).toHaveAttribute("type", "text");
    await expect(c.showHide).toHaveAccessibleName("Hide password");

    await page.keyboard.press("Enter");
    await expect(c.password).toHaveAttribute("type", "password");
  });
});

test.describe("before JavaScript has loaded", () => {
  test.use({ javaScriptEnabled: false });

  test("the form posts to the server and never puts the password in the URL", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    const c = controls(page);

    // Email left empty, so the server answers with the empty-form error.
    await c.password.fill("typed-before-js-loaded");
    await c.password.press("Enter");

    await expect(c.alert).toHaveText(
      "Enter your email and password to continue.",
    );
    expect(page.url()).not.toContain("typed-before-js-loaded");
    expect(page.url()).not.toContain("password");
  });
});

test.describe("with the test account", () => {
  test.skip(
    !email || !password,
    "Set E2E_EMAIL and E2E_PASSWORD in .env.local to run these tests.",
  );

  test("a wrong password shows a calm error", async ({ page }) => {
    await page.goto("/sign-in");
    const c = controls(page);

    await c.email.fill(email!);
    await c.password.fill("not-the-right-password");
    await page.keyboard.press("Enter");

    await expect(c.alert).toHaveText(
      "That email and password don't match. Check them and try again.",
    );
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test("sign in → home → sign out", async ({ page }) => {
    await page.goto("/sign-in");
    const c = controls(page);

    await c.email.fill(email!);
    await c.password.fill(password!);
    await c.signIn.click();

    // Signed in: lands on home and stays signed in after a reload.
    const signOut = page.getByRole("button", { name: "Sign out" });
    await expect(page).toHaveURL(/\/$/);
    await expect(signOut).toBeVisible();
    await page.reload();
    await expect(signOut).toBeVisible();

    // A signed-in user who opens /sign-in goes back to home.
    await page.goto("/sign-in");
    await expect(page).toHaveURL(/\/$/);

    // Sign out returns to sign-in, and home is protected again.
    await signOut.click();
    await expect(page).toHaveURL(/\/sign-in$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/sign-in$/);
  });
});
