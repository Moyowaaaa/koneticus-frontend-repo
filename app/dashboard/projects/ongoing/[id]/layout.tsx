import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Project", undefined, { index: false });

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
