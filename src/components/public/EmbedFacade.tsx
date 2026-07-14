"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * Renders a lightweight placeholder and only mounts the real <iframe> once the
 * tile scrolls near the viewport (or the visitor clicks). This keeps embed
 * scripts off the main thread at load — important on a Raspberry Pi.
 */
export function EmbedFacade({
  src,
  title,
  kicker,
  icon,
}: {
  src: string;
  title: string;
  kicker: string;
  icon: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref} style={{ position: "absolute", inset: 0 }}>
      {show ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShow(true)}
          aria-label={`Load ${title}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            border: 0,
            background: "transparent",
            cursor: "pointer",
            padding: 17,
            textAlign: "left",
          }}
        >
          <div className="sk-skel" />
          <div style={{ position: "relative", zIndex: 1 }} className="sk-kicker">
            <Icon name={icon} /> {kicker}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              zIndex: 1,
            }}
          >
            <span className="sk-vplay">
              <Icon name="play" width={16} height={16} />
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
