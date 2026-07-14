import type { TileType } from "@prisma/client";

/** Extract a Spotify embed src from any open.spotify.com/<type>/<id> URL. */
export function spotifyEmbed(url: string): string | null {
  const m = url.match(/open\.spotify\.com\/(intl-[a-z]+\/)?(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]+)/);
  if (!m) return null;
  return `https://open.spotify.com/embed/${m[2]}/${m[3]}`;
}

/** Extract a YouTube video id from watch, youtu.be, shorts or embed URLs. */
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

export function youtubeEmbed(url: string): string | null {
  const id = youtubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

/** Apple Music pages embed by swapping the host. */
export function appleMusicEmbed(url: string): string | null {
  if (!/music\.apple\.com/.test(url)) return null;
  return url.replace(/^https?:\/\/music\.apple\.com/, "https://embed.music.apple.com");
}

/** SoundCloud uses its widget player wrapping the original URL. */
export function soundcloudEmbed(url: string): string | null {
  if (!/soundcloud\.com/.test(url)) return null;
  const params = new URLSearchParams({
    url,
    color: "%23C21A83",
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    visual: "true",
  });
  return `https://w.soundcloud.com/player/?${params.toString().replace("%2523", "%23")}`;
}

/**
 * Accept either a plain URL or a pasted `<iframe …>` snippet and return the
 * iframe's src. Non-iframe input is returned trimmed and unchanged.
 */
export function extractIframeSrc(input: string): string {
  const m = input.match(/<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i);
  return (m ? m[1] : input).trim();
}

/** Pull width/height off a pasted iframe to derive an aspect ratio (if present). */
export function iframeAspectRatio(input: string): number | null {
  const w = input.match(/\swidth\s*=\s*["']?(\d+)/i);
  const h = input.match(/\sheight\s*=\s*["']?(\d+)/i);
  if (w && h) {
    const ratio = Number(w[1]) / Number(h[1]);
    if (Number.isFinite(ratio) && ratio > 0) return ratio;
  }
  return null;
}

/** Resolve the iframe src for an embed tile from its stored url. */
export function embedSrc(type: TileType, url: string | null): string | null {
  if (!url) return null;
  switch (type) {
    case "SPOTIFY":
      return spotifyEmbed(url);
    case "YOUTUBE":
      return youtubeEmbed(url);
    case "APPLE_MUSIC":
      return appleMusicEmbed(url);
    case "SOUNDCLOUD":
      return soundcloudEmbed(url);
    case "EMBED":
      // Generic: stored value may be a ready src or a full iframe snippet.
      return extractIframeSrc(url);
    default:
      return null;
  }
}

/** Guess a tile type from a pasted URL or iframe snippet (used by the admin form). */
export function detectType(input: string): TileType {
  const isIframe = /<iframe/i.test(input);
  const url = extractIframeSrc(input);
  if (/open\.spotify\.com/.test(url)) return "SPOTIFY";
  if (/(youtube\.com|youtu\.be|youtube-nocookie\.com)/.test(url)) return "YOUTUBE";
  if (/music\.apple\.com/.test(url)) return "APPLE_MUSIC";
  if (/soundcloud\.com/.test(url)) return "SOUNDCLOUD";
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return "VIDEO";
  if (/\.(gif|png|jpe?g|webp|avif)(\?|$)/i.test(url)) return "IMAGE";
  if (isIframe) return "EMBED";
  return "LINK";
}
