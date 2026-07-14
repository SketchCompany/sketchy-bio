"use client";

import type { AnchorHTMLAttributes } from "react";

/**
 * External link that fires a fire-and-forget click beacon (for the admin's
 * per-tile click counts) without delaying navigation.
 */
export function TrackedLink({
  tileId,
  children,
  ...props
}: { tileId: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        try {
          navigator.sendBeacon?.(`/api/tiles/${tileId}/click`);
        } catch {
          /* non-critical */
        }
      }}
    >
      {children}
    </a>
  );
}
