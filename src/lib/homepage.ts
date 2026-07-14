import { z } from "zod";

// The scrolling "live" bar on the public homepage.
export const tickerSchema = z.object({
  enabled: z.boolean().default(true),
  speedSec: z.number().min(5).max(180).default(26),
  items: z.array(z.string().max(140)).max(24).default([]),
});

export type Ticker = z.infer<typeof tickerSchema>;

export const DEFAULT_TICKER: Ticker = { enabled: true, speedSec: 26, items: [] };

/** Merge stored ticker JSON with defaults (tolerant of missing/invalid fields). */
export function resolveTicker(stored: unknown): Ticker {
  const parsed = tickerSchema.safeParse(stored ?? {});
  return parsed.success ? parsed.data : DEFAULT_TICKER;
}
