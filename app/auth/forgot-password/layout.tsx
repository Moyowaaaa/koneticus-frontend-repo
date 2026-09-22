import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Forgot password",
  "Reset your Kollabs password with a secure email link.",
  { path: "/auth/forgot-password" },
);

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
