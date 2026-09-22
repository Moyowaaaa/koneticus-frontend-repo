import type { Metadata } from "next";

export const SITE_NAME = "Kollabs";
export const SITE_TAGLINE = "Collaborate with creative talent";
export const SITE_DESCRIPTION =
  "Kollabs is a collaboration platform for creators. Post ideas, find collaborators, send requests, chat, and ship projects together.";

export const getSiteUrl = () => {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  return raw.replace(/\/$/, "");
};

export const pageMetadata = (
  title: string,
  description = SITE_DESCRIPTION,
  options?: { path?: string; index?: boolean },
): Metadata => {
  const index = options?.index ?? true;
  const url = options?.path
    ? new URL(options.path, `${getSiteUrl()}/`).toString()
    : undefined;

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    robots: {
      index,
      follow: index,
      googleBot: { index, follow: index },
    },
  };
};
