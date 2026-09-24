import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Verify email",
  "Confirm your email address to finish setting up Koneticus.",
  { path: "/auth/verify-email", index: false },
);

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
