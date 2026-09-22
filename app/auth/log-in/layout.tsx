import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Log in",
  "Log in to Kollabs to post ideas, find collaborators, and manage your projects.",
  { path: "/auth/log-in" },
);

export default function LogInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
