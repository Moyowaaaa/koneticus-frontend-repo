import AuthLayout from "@/components/auth/auth-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Account",
  "Sign in or create a Koneticus account to collaborate with other creators.",
);

export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
