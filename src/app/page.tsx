import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { resolveTheme, THEME_TOKENS } from "@/lib/theme";
import { resolveTicker } from "@/lib/homepage";
import { baseSiteMetadata } from "@/lib/seo";
import { BentoGrid } from "@/components/public/BentoGrid";
import { Icon } from "@/components/public/Icon";

type SocialLink = { label: string; url: string; icon?: string };

async function getData() {
  const [profile, tiles] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.bentoGridItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ]);
  return { profile, tiles };
}

export async function generateMetadata(): Promise<Metadata> {
  const base = await baseSiteMetadata();
  return { ...base, alternates: { canonical: "/" } };
}

// Public page is revalidated on admin edits via revalidatePath('/').
export const revalidate = 3600;

export default async function Home() {
  const { profile, tiles } = await getData();
  const theme = resolveTheme(profile?.theme);
  const social = (profile?.socialLinks as SocialLink[] | null) ?? [];

  // Inject the admin-adjustable palette as CSS custom properties.
  const themeVars = Object.fromEntries(
    THEME_TOKENS.map((t) => [`--sk-${t.key}`, theme[t.key]]),
  ) as React.CSSProperties;

  const ticker = resolveTicker(profile?.ticker);
  const tickerItems = ticker.items.length > 0 ? ticker.items : [profile?.tagline || "New music out now"];

  return (
    <div className="sk-page" style={themeVars}>
      <div className="sk-grain" aria-hidden="true" />
      <div className="sk-scan" aria-hidden="true" />

      <main className="sk-wrap">
        <div className="sk-top">
          <span>{profile?.topLeft || "Self-hosted"}</span>
          <span>{profile?.topRight || "Transmission 001"}</span>
        </div>

        <section className="sk-hero">
          {profile?.logoUrl ? (
            <div className="sk-logo-stage">
              <div className="sk-logo-inner">
                <Image
                  src={profile.logoUrl}
                  alt={profile.artistName}
                  width={1440}
                  height={899}
                  priority
                  sizes="(max-width: 1000px) 96vw, 1000px"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          ) : (
            <h1 style={{ fontFamily: "var(--sk-display)", fontSize: "clamp(48px,12vw,120px)" }}>
              {profile?.artistName ?? "Sketchy"}
            </h1>
          )}

          {profile?.heroKicker && <p className="sk-kick">{profile.heroKicker}</p>}
          {profile?.tagline && <h2 className="sk-tagline">{profile.tagline}</h2>}
          {profile?.bio && <p className="sk-subline">{profile.bio}</p>}
        </section>

        {ticker.enabled && (
          <div className="sk-ticker" aria-hidden="true">
            <div style={{ animationDuration: `${ticker.speedSec}s` }}>
              {[0, 1].map((rep) =>
                tickerItems.map((item, i) => (
                  <span key={`${rep}-${i}`}>
                    <b>{item}</b>
                    <i style={{ paddingLeft: 22 }}>✳</i>
                  </span>
                )),
              )}
            </div>
          </div>
        )}

        {tiles.length > 0 ? (
          <BentoGrid tiles={tiles} />
        ) : (
          <p className="sk-subline" style={{ textAlign: "center", margin: "40px auto" }}>
            No tiles yet. Add some in the admin dashboard.
          </p>
        )}

        {social.length > 0 && (
          <div className="sk-social" aria-label="Social links">
            <span className="sk-lbl">Elsewhere /</span>
            {social.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sk-chip"
              >
                {s.icon && <Icon name={s.icon} />} {s.label}
              </a>
            ))}
          </div>
        )}

        <footer className="sk-footer">
          <span>
            © {new Date().getFullYear()} {profile?.artistName ?? "Sketchy"}
          </span>
          <nav className="sk-legal-links" aria-label="Legal">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/agb">AGB</Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}
