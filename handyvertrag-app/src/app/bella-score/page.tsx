import { redirect } from "next/navigation";

// Canonical is /analyse/methodik — this alias redirects cleanly (301)
export default function BellaScorePage() {
  redirect("/analyse/methodik");
}
