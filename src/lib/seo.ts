import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

const FALLBACK_NAME = "Sketchy";
const FALLBACK_DESC = "Music, links and more — one link in bio.";
const FALLBACK_IMAGE = "/sketchy-logo.png";

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

/** Pull the SEO-relevant profile fields, with sensible fallbacks. */
export async function getSeoProfile() {
  const profile = await prisma.profile.findFirst({
    select: {
      artistName: true,
      tagline: true,
      bio: true,
      ogImageUrl: true,
      logoUrl: true,
      socialLinks: true,
    },
  });
  const name = profile?.artistName?.trim() || FALLBACK_NAME;
  const description = (profile?.tagline?.trim() || profile?.bio?.trim() || FALLBACK_DESC).slice(0, 200);
  const ogImage = profile?.ogImageUrl?.trim() || profile?.logoUrl?.trim() || FALLBACK_IMAGE;
  const icon = profile?.logoUrl?.trim() || FALLBACK_IMAGE;
  const socials = Array.isArray(profile?.socialLinks)
    ? (profile!.socialLinks as Array<{ label?: string }>).map((s) => s?.label?.trim()).filter(Boolean) as string[]
    : [];
  return { name, description, ogImage, icon, socials };
}

/**
 * Base site metadata driven entirely by the admin-entered profile. The root
 * layout applies this to every route; pages extend it (canonical, og:url, etc.).
 */
export async function baseSiteMetadata(): Promise<Metadata> {
  const { name, description, ogImage, icon, socials } = await getSeoProfile();
  const isImage = /\.(png|jpe?g|webp|svg|ico|gif|avif)(\?|$)/i.test(icon);
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: name, template: `%s · ${name}` },
    description,
    applicationName: name,
    authors: [{ name }],
    creator: name,
    publisher: name,
    keywords: Array.from(new Set([name, "music", "artist", "link in bio", ...socials])),
    icons: { icon: isImage ? icon : FALLBACK_IMAGE, apple: isImage ? icon : FALLBACK_IMAGE },
    openGraph: {
      type: "website",
      siteName: name,
      title: name,
      description,
      url: "/",
      locale: "de_DE",
      images: [{ url: ogImage, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}
