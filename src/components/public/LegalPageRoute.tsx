import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { themeStyleVars } from "@/lib/theme";
import { LegalView } from "./LegalView";

export async function legalMetadata(slug: string): Promise<Metadata> {
  const page = await prisma.legalPage.findUnique({ where: { slug } });
  return {
    title: page?.title ?? "Rechtliches",
    alternates: { canonical: `/${slug}` },
  };
}

/** Shared async server component: loads a legal page by slug and renders it. */
export async function LegalPageRoute({ slug }: { slug: string }) {
  const [page, profile] = await Promise.all([
    prisma.legalPage.findUnique({ where: { slug } }),
    prisma.profile.findFirst({ select: { theme: true } }),
  ]);
  if (!page) notFound();
  return (
    <LegalView
      title={page.title}
      content={page.content}
      themeVars={themeStyleVars(profile?.theme)}
    />
  );
}
