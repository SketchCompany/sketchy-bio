import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { LEGAL_PAGES, DEFAULT_TICKER_ITEMS } from "./legal-content.mjs";

const prisma = new PrismaClient();

// Logo-derived defaults (mirror of src/lib/theme.ts DEFAULT_THEME).
const DEFAULT_THEME = {
  background: "#000000",
  surface: "#17131E",
  text: "#F4EEF9",
  muted: "#AA9FB8",
  pink: "#C21A83",
  pinkDeep: "#7E1257",
  violet: "#7C33E0",
  edge: "#40308F",
};

const SOCIAL = [
  { label: "TikTok", url: "https://tiktok.com/@sketchy", icon: "tiktok" },
  { label: "Bandcamp", url: "https://sketchy.bandcamp.com", icon: "bandcamp" },
  { label: "Discord", url: "https://discord.gg/sketchy", icon: "discord" },
  { label: "Email list", url: "mailto:hello@sketchy.fm", icon: "mail" },
];

// Placeholder tiles laid out on a 4-column grid (swap real content via admin).
const TILES: Prisma.BentoGridItemCreateManyInput[] = [
  { title: "Midnight Xerox", type: "SPOTIFY", url: "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3", content: "LP · 11 tracks · 2026", x: 0, y: 0, w: 2, h: 2, order: 0 },
  { title: "Static", type: "YOUTUBE", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "3:42", x: 2, y: 0, w: 2, h: 1, order: 1 },
  { title: "Instagram", type: "LINK", url: "https://instagram.com/sketchy", content: "@sketchy", x: 2, y: 1, w: 1, h: 1, order: 2 },
  { title: "Studio · 3am", type: "IMAGE", mediaUrl: null, content: "GIF", x: 3, y: 1, w: 1, h: 1, order: 3 },
  { title: "Listen everywhere", type: "HEADER", x: 0, y: 2, w: 4, h: 1, order: 4 },
  { title: "Unreleased loops", type: "SOUNDCLOUD", url: "https://soundcloud.com/sketchy/sets/loops", x: 0, y: 3, w: 2, h: 1, order: 5 },
  { title: "Apple Music", type: "APPLE_MUSIC", url: "https://music.apple.com/us/artist/sketchy/000000000", content: "Full catalog", x: 2, y: 3, w: 1, h: 1, order: 6 },
  { title: "Merch", type: "LINK", url: "https://sketchy.store", content: "Tapes · tees", x: 3, y: 3, w: 1, h: 1, order: 7 },
  { title: "About", type: "TEXT", content: "Berlin-based producer working in blown-out lo-fi and broken beats. Booking & demos welcome — hello@sketchy.fm", x: 0, y: 4, w: 2, h: 1, order: 8 },
  { title: "Tour dates", type: "LINK", url: "https://sketchy.fm/live", content: "4 shows this spring", x: 2, y: 4, w: 2, h: 1, order: 9 },
];

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "sketchy";
  const password = process.env.ADMIN_PASSWORD ?? "changeme-dev-123";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      artistName: "Sketchy",
      tagline: "Late-night beats, blown-out drums & tape hiss.",
      bio: "Everything Sketchy is making, dropping and playing — one link.",
      logoUrl: "/sketchy-logo.png",
      backgroundStyle: "black",
      topLeft: "Self-hosted",
      topRight: "Transmission 001",
      ticker: { enabled: true, speedSec: 26, items: DEFAULT_TICKER_ITEMS },
      theme: DEFAULT_THEME,
      socialLinks: SOCIAL,
    },
  });

  await prisma.bentoGridItem.deleteMany();
  await prisma.bentoGridItem.createMany({ data: TILES });

  for (const page of LEGAL_PAGES) {
    await prisma.legalPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }

  console.log(`Seeded admin "${username}", profile, ${TILES.length} tiles, ${LEGAL_PAGES.length} legal pages.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
