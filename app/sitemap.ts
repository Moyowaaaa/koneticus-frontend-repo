import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: `${siteUrl}/auth/log-in`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/auth/sign-up`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/auth/forgot-password`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
