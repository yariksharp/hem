import type { Metadata } from "next";
import { UiDemo } from "./UiDemo";

// Test page for the shared UI components (HEM-55). Sample text only, no real data.
export const metadata: Metadata = {
  title: "UI components · Hem",
  robots: { index: false, follow: false },
};

export default function UiPage() {
  return <UiDemo />;
}
