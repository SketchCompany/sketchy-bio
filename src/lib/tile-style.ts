import type { CSSProperties } from "react";
import { z } from "zod";

const hex = z.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

// Per-tile text styling for TEXT and HEADER tiles.
export const tileStyleSchema = z.object({
  size: z.enum(["sm", "md", "lg", "xl"]).optional(),
  align: z.enum(["left", "center", "right"]).optional(),
  color: hex.optional(),
});

export type TileStyle = z.infer<typeof tileStyleSchema>;

export const SIZE_LABELS: Record<NonNullable<TileStyle["size"]>, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
  xl: "Extra large",
};

const FONT_SIZE: Record<NonNullable<TileStyle["size"]>, string> = {
  sm: "clamp(13px, 2.4vw, 16px)",
  md: "clamp(17px, 3vw, 23px)",
  lg: "clamp(23px, 3.6vw, 34px)",
  xl: "clamp(30px, 5vw, 48px)",
};

export function resolveTileStyle(stored: unknown): TileStyle {
  const parsed = tileStyleSchema.safeParse(stored ?? {});
  return parsed.success ? parsed.data : {};
}

/** Map a resolved tile style to inline CSS for the text element. */
export function tileTextStyle(style: TileStyle): CSSProperties {
  const css: CSSProperties = {};
  if (style.size) css.fontSize = FONT_SIZE[style.size];
  if (style.align) css.textAlign = style.align;
  if (style.color) css.color = style.color;
  return css;
}
