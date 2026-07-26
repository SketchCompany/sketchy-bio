import type { BentoGridItem, TileType } from "@prisma/client";
import Image from "next/image";
import { Icon } from "./Icon";
import { EmbedFacade } from "./EmbedFacade";
import { TrackedLink } from "./TrackedLink";
import { embedSrc } from "@/lib/embeds";
import { resolveTileStyle, tileTextStyle } from "@/lib/tile-style";

const EMBED_TYPES: TileType[] = ["SPOTIFY", "APPLE_MUSIC", "SOUNDCLOUD", "YOUTUBE", "EMBED"];

const EMBED_META: Record<string, { icon: string; label: string }> = {
  SPOTIFY: { icon: "spotify", label: "Spotify" },
  APPLE_MUSIC: { icon: "apple", label: "Apple Music" },
  SOUNDCLOUD: { icon: "soundcloud", label: "SoundCloud" },
  YOUTUBE: { icon: "youtube", label: "YouTube" },
  EMBED: { icon: "link", label: "Embed" },
};

/** Pick a link icon from the tile's title/url. */
function linkIcon(title: string, url: string | null): string {
  const s = `${title} ${url ?? ""}`.toLowerCase();
  if (/instagram/.test(s)) return "instagram";
  if (/tiktok/.test(s)) return "tiktok";
  if (/apple/.test(s)) return "apple";
  if (/spotify/.test(s)) return "spotify";
  if (/soundcloud/.test(s)) return "soundcloud";
  if (/bandcamp/.test(s)) return "bandcamp";
  if (/discord/.test(s)) return "discord";
  if (/(merch|shop|store)/.test(s)) return "bag";
  if (/(tour|live|show|ticket|date)/.test(s)) return "calendar";
  if (/mail|email|@/.test(s)) return "mail";
  return "link";
}

const spanStyle = (t: BentoGridItem) =>
  ({ "--sw": t.w, "--sh": t.h }) as React.CSSProperties;

function ArrowBtn() {
  return (
    <span className="sk-arrow">
      <Icon name="arrow" width={14} height={14} />
    </span>
  );
}

function LinkTile({ t }: { t: BentoGridItem }) {
  const icon = linkIcon(t.title, t.url);
  return (
    <TrackedLink
      tileId={t.id}
      href={t.url ?? "#"}
      className="sk-tile"
      style={spanStyle(t)}
      aria-label={t.title}
    >
      <div className="sk-kicker">
        <Icon name={icon} /> {t.tag || (icon === "bag" ? "Shop" : icon === "calendar" ? "Live" : "Open")}
      </div>
      <h3 style={{ fontSize: 26 }}>{t.title}</h3>
      <div className="sk-foot">
        <span className="sk-sub">{t.content}</span>
        <ArrowBtn />
      </div>
    </TrackedLink>
  );
}

function TextTile({ t }: { t: BentoGridItem }) {
  return (
    <div className="sk-tile sk-bio" style={spanStyle(t)}>
      <svg
        className="sk-doodle"
        style={{ top: 14, right: 14, width: 62, transform: "rotate(-6deg)" }}
        viewBox="0 0 90 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M4 30 C 22 6, 40 34, 60 14 S 84 8, 86 22" />
      </svg>
      <div className="sk-kicker">
        <Icon name="bolt" /> {t.tag || "About"}
      </div>
      <p style={tileTextStyle(resolveTileStyle(t.style))}>{t.content}</p>
    </div>
  );
}

function HeaderTile({ t }: { t: BentoGridItem }) {
  return (
    <div className="sk-tile sk-headtile" style={spanStyle(t)}>
      <h3 style={tileTextStyle(resolveTileStyle(t.style))}>{t.title}</h3>
      <div className="sk-rule" aria-hidden="true" />
    </div>
  );
}

function ImageTile({ t }: { t: BentoGridItem }) {
  const inner = (
    <>
      {t.mediaUrl ? (
        <Image src={t.mediaUrl} alt={t.title} fill sizes="320px" style={{ objectFit: "cover" }} />
      ) : (
        <div className="sk-pic" aria-hidden="true" />
      )}
      {(t.content === "GIF" || /\.gif(\?|$)/i.test(t.mediaUrl ?? "")) && (
        <span className="sk-badge">GIF</span>
      )}
      <span className="sk-tag">{t.title}</span>
    </>
  );
  return t.url ? (
    <TrackedLink tileId={t.id} href={t.url} className="sk-tile sk-imgtile" style={spanStyle(t)} aria-label={t.title}>
      {inner}
    </TrackedLink>
  ) : (
    <div className="sk-tile sk-imgtile" style={spanStyle(t)}>
      {inner}
    </div>
  );
}

function VideoTile({ t }: { t: BentoGridItem }) {
  // Uploaded file or a direct video URL → play inline; a platform link → lazy embed.
  const direct = t.mediaUrl ?? (/\.(mp4|webm|mov)(\?|$)/i.test(t.url ?? "") ? t.url : null);
  if (direct) {
    return (
      <div className="sk-tile sk-video" style={spanStyle(t)}>
        <video
          src={direct}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="sk-kicker" style={{ color: "rgba(255,255,255,.85)" }}>
          <Icon name="play" /> {t.tag || t.title}
        </div>
      </div>
    );
  }
  const src = embedSrc("YOUTUBE", t.url);
  return (
    <div className="sk-tile sk-video" style={spanStyle(t)}>
      {src ? (
        <EmbedFacade src={src} title={t.title} kicker={t.tag || t.title} icon="youtube" />
      ) : (
        <div className="sk-kicker">
          <Icon name="play" /> {t.tag || t.title}
        </div>
      )}
    </div>
  );
}

function EmbedTile({ t }: { t: BentoGridItem }) {
  const src = embedSrc(t.type, t.url);
  const meta = EMBED_META[t.type] ?? EMBED_META.EMBED;
  if (!src) {
    // Bad/missing embed url → behave like a normal link.
    return <LinkTile t={t} />;
  }
  // The embed url itself carries the intent, so autoplay stays editable in the
  // admin without a schema change.
  const wantsAutoPlay = /[?&]auto_play=true/.test(src);
  return (
    <div className="sk-tile" style={{ ...spanStyle(t), padding: 0 }}>
      <EmbedFacade
        src={src}
        title={t.title}
        kicker={t.tag || `${meta.label} · ${t.title}`}
        icon={meta.icon}
        autoPlay={wantsAutoPlay}
      />
    </div>
  );
}

function Tile({ t }: { t: BentoGridItem }) {
  if (EMBED_TYPES.includes(t.type)) return <EmbedTile t={t} />;
  switch (t.type) {
    case "TEXT":
      return <TextTile t={t} />;
    case "HEADER":
      return <HeaderTile t={t} />;
    case "IMAGE":
      return <ImageTile t={t} />;
    case "VIDEO":
      return <VideoTile t={t} />;
    default:
      return <LinkTile t={t} />;
  }
}

export function BentoGrid({ tiles }: { tiles: BentoGridItem[] }) {
  return (
    <section className="sk-grid" aria-label="Links and media">
      {tiles.map((t) => (
        <Tile key={t.id} t={t} />
      ))}
    </section>
  );
}
