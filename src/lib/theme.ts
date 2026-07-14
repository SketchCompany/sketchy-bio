import type { CSSProperties } from "react";
import { z } from "zod";

// Backend-adjustable colour tokens. The public layout emits these as CSS
// custom properties, so editing them in the admin restyles the whole site.
// Defaults are sampled from the artist logo (dark magenta / violet on black).

export const THEME_TOKENS = [
  { key: "background", label: "Background", default: "#000000" },
  { key: "surface", label: "Tile surface", default: "#17131E" },
  { key: "text", label: "Text", default: "#F4EEF9" },
  { key: "muted", label: "Muted text", default: "#AA9FB8" },
  { key: "pink", label: "Pink / magenta", default: "#C21A83" },
  { key: "pinkDeep", label: "Deep magenta", default: "#7E1257" },
  { key: "violet", label: "Violet", default: "#7C33E0" },
  { key: "edge", label: "Indigo edge", default: "#40308F" },
] as const;

export type ThemeKey = (typeof THEME_TOKENS)[number]["key"];

const hex = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex colour like #C21A83");

// Every token optional on input; missing ones fall back to the default.
export const themeSchema = z.object(
  Object.fromEntries(THEME_TOKENS.map((t) => [t.key, hex.optional()])),
) as z.ZodType<Partial<Record<ThemeKey, string>>>;

export type Theme = Record<ThemeKey, string>;

export const DEFAULT_THEME: Theme = Object.fromEntries(
  THEME_TOKENS.map((t) => [t.key, t.default]),
) as Theme;

/** Merge stored (possibly partial/invalid) theme JSON with the defaults. */
export function resolveTheme(stored: unknown): Theme {
  const parsed = themeSchema.safeParse(stored ?? {});
  const overrides = parsed.success ? parsed.data : {};
  return { ...DEFAULT_THEME, ...overrides };
}

/** Turn a theme into `--sk-<token>: <hex>;` CSS custom-property declarations. */
export function themeToCssVars(theme: Theme): string {
  return THEME_TOKENS.map((t) => `--sk-${t.key}:${theme[t.key]};`).join("");
}

/** Resolve stored theme JSON into an inline style object of `--sk-*` CSS vars. */
export function themeStyleVars(stored: unknown): CSSProperties {
  const theme = resolveTheme(stored);
  return Object.fromEntries(
    THEME_TOKENS.map((t) => [`--sk-${t.key}`, theme[t.key]]),
  ) as CSSProperties;
}
