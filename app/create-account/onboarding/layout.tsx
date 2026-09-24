import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Set up your profile",
  "Add your name, roles, and profile details to start collaborating on Koneticus.",
  { path: "/create-account/onboarding", index: false },
);

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
