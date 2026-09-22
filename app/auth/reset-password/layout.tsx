import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Reset password",
  "Choose a new password for your Kollabs account.",
  { path: "/auth/reset-password", index: false },
);

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
