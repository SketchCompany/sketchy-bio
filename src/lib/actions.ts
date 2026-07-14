"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { themeSchema } from "@/lib/theme";
import { tileStyleSchema } from "@/lib/tile-style";
import { tickerSchema } from "@/lib/homepage";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

const TILE_TYPES = [
  "LINK", "TEXT", "HEADER", "IMAGE", "VIDEO",
  "SPOTIFY", "APPLE_MUSIC", "SOUNDCLOUD", "YOUTUBE", "EMBED",
] as const;

// Content fields only. Grid position (x/y) is owned by drag + saveLayout, never
// touched here. No `.default()`s: on a partial update, missing keys must be left
// untouched, not reset (a stray x/y default was moving tiles to 0,0 on edit).
const tileContent = z.object({
  title: z.string().max(120),
  type: z.enum(TILE_TYPES),
  url: z.string().trim().max(2000).nullish(),
  content: z.string().max(4000).nullish(),
  mediaUrl: z.string().max(2000).nullish(),
  tag: z.string().max(60).nullish(),
  style: tileStyleSchema.optional(),
  w: z.number().int().min(1).max(4),
  h: z.number().int().min(1).max(4),
  isActive: z.boolean(),
});

export async function createTile(input: unknown) {
  await requireAuth();
  const data = tileContent.parse(input);
  const [agg, all] = await Promise.all([
    prisma.bentoGridItem.aggregate({ _max: { order: true } }),
    prisma.bentoGridItem.findMany({ select: { y: true, h: true } }),
  ]);
  // Drop the new tile in a fresh row below everything else so it never overlaps.
  const nextY = all.reduce((m, t) => Math.max(m, t.y + t.h), 0);
  const tile = await prisma.bentoGridItem.create({
    data: { ...data, x: 0, y: nextY, order: (agg._max.order ?? -1) + 1 },
  });
  revalidate();
  return tile.id;
}

export async function updateTile(id: string, input: unknown) {
  await requireAuth();
  const data = tileContent.partial().parse(input);
  await prisma.bentoGridItem.update({ where: { id }, data });
  revalidate();
}

export async function deleteTile(id: string) {
  await requireAuth();
  await prisma.bentoGridItem.delete({ where: { id } });
  revalidate();
}

export async function toggleTile(id: string, isActive: boolean) {
  await requireAuth();
  await prisma.bentoGridItem.update({ where: { id }, data: { isActive } });
  revalidate();
}

const layoutSchema = z.array(
  z.object({
    id: z.string(),
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    w: z.number().int().min(1).max(4),
    h: z.number().int().min(1).max(4),
  }),
);

/** Persist grid positions (and derive `order` from reading order top-left → bottom-right). */
export async function saveLayout(input: unknown) {
  await requireAuth();
  const items = layoutSchema.parse(input);
  const ordered = [...items].sort((a, b) => a.y - b.y || a.x - b.x);
  await prisma.$transaction(
    ordered.map((it, i) =>
      prisma.bentoGridItem.update({
        where: { id: it.id },
        data: { x: it.x, y: it.y, w: it.w, h: it.h, order: i },
      }),
    ),
  );
  revalidate();
}

const socialSchema = z.array(
  z.object({
    label: z.string().min(1).max(60),
    url: z.string().trim().min(1).max(2000),
    icon: z.string().max(40).optional(),
  }),
);

const profileSchema = z.object({
  artistName: z.string().min(1).max(120),
  heroKicker: z.string().max(120).default(""),
  tagline: z.string().max(300).default(""),
  bio: z.string().max(2000).default(""),
  avatarUrl: z.string().max(2000).optional().nullable(),
  logoUrl: z.string().max(2000).optional().nullable(),
  ogImageUrl: z.string().max(2000).optional().nullable(),
  topLeft: z.string().max(120).default("Self-hosted"),
  topRight: z.string().max(120).default("Transmission 001"),
  ticker: tickerSchema.default({ enabled: true, speedSec: 26, items: [] }),
  socialLinks: socialSchema.default([]),
});

export async function updateProfile(input: unknown) {
  await requireAuth();
  const data = profileSchema.parse(input);
  const existing = await prisma.profile.findFirst();
  if (existing) {
    await prisma.profile.update({ where: { id: existing.id }, data });
  } else {
    await prisma.profile.create({ data });
  }
  revalidate();
}

export async function updateTheme(input: unknown) {
  await requireAuth();
  const theme = themeSchema.parse(input);
  const existing = await prisma.profile.findFirst();
  if (!existing) throw new Error("No profile to update");
  await prisma.profile.update({ where: { id: existing.id }, data: { theme } });
  revalidate();
}

const LEGAL_SLUGS = ["impressum", "datenschutz", "agb"] as const;

const legalSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(60000),
});

export async function updateLegalPage(slug: string, input: unknown) {
  await requireAuth();
  const parsedSlug = z.enum(LEGAL_SLUGS).parse(slug);
  const data = legalSchema.parse(input);
  await prisma.legalPage.upsert({
    where: { slug: parsedSlug },
    update: data,
    create: { slug: parsedSlug, ...data },
  });
  revalidatePath(`/${parsedSlug}`);
  revalidatePath("/");
}
