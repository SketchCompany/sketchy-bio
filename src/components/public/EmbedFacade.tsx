"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * Renders a lightweight placeholder and only mounts the real <iframe> once the
 * tile scrolls near the viewport (or the visitor clicks). This keeps embed
 * scripts off the main thread at load — important on a Raspberry Pi.
 *
 * With `autoPlay`, the scroll trigger is skipped and the iframe waits for the
 * first interaction anywhere on the page instead. Browsers block sound that
 * starts without a user gesture, so mounting during one is what actually lets
 * an `auto_play=true` embed play. Mounting on scroll would spend the embed's
 * one chance before any gesture exists.
 */
export function EmbedFacade({
  src,
  title,
  kicker,
  icon,
  autoPlay = false,
}: {
  src: string;
  title: string;
  kicker: string;
  icon: string;
  autoPlay?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;

    if (autoPlay) {
      const events = ["pointerdown", "touchstart", "keydown"] as const;
      const onGesture = () => {
        setShow(true);
        for (const e of events) document.removeEventListener(e, onGesture, true);
      };
      for (const e of events) {
        document.addEventListener(e, onGesture, { capture: true, passive: true });
      }
      return () => {
        for (const e of events) document.removeEventListener(e, onGesture, true);
      };
    }

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
  }, [show, autoPlay]);

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
