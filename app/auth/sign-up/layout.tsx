import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Sign up",
  "Create a Kollabs account and start collaborating with other creators.",
  { path: "/auth/sign-up" },
);

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
