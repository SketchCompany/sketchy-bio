// Non-destructive: adds the 3 legal pages if missing and sets default ticker
// items on the existing profile only when it has none. Never overwrites edits.
import { PrismaClient } from "@prisma/client";
import { LEGAL_PAGES, DEFAULT_TICKER_ITEMS } from "./legal-content.mjs";

const prisma = new PrismaClient();

for (const page of LEGAL_PAGES) {
  await prisma.legalPage.upsert({
    where: { slug: page.slug },
    update: {}, // keep any existing edits
    create: page,
  });
}

const profile = await prisma.profile.findFirst();
if (profile) {
  const t = profile.ticker && typeof profile.ticker === "object" ? profile.ticker : {};
  if (!Array.isArray(t.items) || t.items.length === 0) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { ticker: { enabled: true, speedSec: 26, items: DEFAULT_TICKER_ITEMS } },
    });
    console.log("Set default ticker items on existing profile.");
  }
}

console.log("Legal pages ready:", LEGAL_PAGES.map((p) => p.slug).join(", "));
await prisma.$disconnect();
