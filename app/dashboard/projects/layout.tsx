import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Projects", undefined, { index: false });

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
