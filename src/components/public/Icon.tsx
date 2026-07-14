import type { SVGProps } from "react";

// Small hand-built glyph set (Lucide-style stroke) plus brand-ish marks that
// Lucide no longer ships. Monochrome, currentColor, so they inherit the token.
const PATHS: Record<string, React.ReactNode> = {
  spotify: (
    <>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 10.5c3-.8 6.5-.5 9 1M7.5 13.5c2.4-.6 5-.4 7 .9M8 16c1.8-.4 3.8-.3 5.3.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </>
  ),
  apple: (
    <path d="M16 13c0-2 1.5-2.6 1.6-2.7-0.9-1.3-2.3-1.4-2.8-1.5-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.7-2.5-.6-1.3 0-2.5.7-3.1 1.9-1.3 2.3-.3 5.7 1 7.5.6.9 1.4 1.9 2.4 1.8.9 0 1.3-.6 2.5-.6 1.1 0 1.5.6 2.5.6 1 0 1.7-.9 2.3-1.8.7-1 1-2 1-2.1-.1 0-2-.8-2-3zM14.3 7.3c.5-.6.9-1.5.8-2.3-.8 0-1.7.5-2.2 1.1-.5.5-.9 1.4-.8 2.2.9.1 1.7-.4 2.2-1z" fill="currentColor" />
  ),
  soundcloud: (
    <>
      <path d="M3 15v-3M6 16v-6M9 16.5V8M12 16.5V7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 16.5V9c3-1 6 1 6 4 0 2-1.5 3.5-3.5 3.5H14z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  tiktok: (
    <path d="M14 4c.4 2.4 2 4 4.5 4.3V11c-1.7 0-3.2-.5-4.5-1.4V15a5 5 0 11-5-5c.3 0 .7 0 1 .1v2.7A2.3 2.3 0 1011.5 15V4H14z" fill="currentColor" />
  ),
  bandcamp: <path d="M4 8h16l-4 8H4z" fill="currentColor" />,
  discord: (
    <>
      <path d="M8 7c1.2-.5 2.6-.7 4-.7s2.8.2 4 .7c2 3 2.6 6 2.4 9-1.2 1-2.6 1.6-4 2l-.8-1.4M8 7c-2 3-2.6 6-2.4 9 1.2 1 2.6 1.6 4 2l.8-1.4M8 7l-.6-1M16 7l.6-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="13" r="1.1" fill="currentColor" />
      <circle cx="14.5" cy="13" r="1.1" fill="currentColor" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l-1 11H7z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 016 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  play: <path d="M8 5v14l11-7z" fill="currentColor" />,
  arrow: <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  bolt: <path d="M13 3L5 13h5l-1 8 8-10h-5z" fill="currentColor" />,
  link: (
    <path d="M9 15l6-6M8 12l-1.5 1.5a3 3 0 004 4L12 16m0-8l1.5-1.5a3 3 0 014 4L16 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  ),
  music: (
    <>
      <path d="M9 18V6l10-2v11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="15" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="9.5" r="1.6" fill="currentColor" />
      <path d="M4 17l5-4 4 3 3-2 4 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  const path = PATHS[name] ?? PATHS.link;
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      {path}
    </svg>
  );
}
