"use client";

// CoachLauncher — bottom-right floating coach. The agent illustration
// doubles as a button: tap it (or fire the `open-coach-chat` window
// event from any CTA on the page) to expand a quiet chat panel above
// the avatar. The panel speaks in Roni's voice but the surface stays
// coach-agnostic so a section CTA can say "Talk to Coach" without
// promising a specific identity.

import { useEffect, useRef, useState } from "react";

export function CoachLauncher() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-coach-chat", onOpen);
    return () => window.removeEventListener("open-coach-chat", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Talk to Coach"
          className="pointer-events-auto relative w-[calc(100vw-2.5rem)] max-w-[320px] origin-bottom-right"
          style={{
            animation: "fadeUp 280ms cubic-bezier(0.22,1,0.36,1) forwards",
          }}
        >
          {/* The expanded coach surface is a single designed image — Roni
              on video with Voice Talk / Text Chat affordances. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/expanded-ai.png"
            alt="Talk to Roni AI — start a voice or text conversation"
            draggable={false}
            className="block h-auto w-full select-none rounded-[20px] shadow-[0_24px_60px_-20px_rgba(15,20,25,0.28),0_4px_12px_-4px_rgba(15,20,25,0.1)]"
          />
          {/* Functional close, sized to sit over the icon baked into the
              image's top-right corner so the visible affordance actually
              dismisses the panel. */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-2 top-2 h-9 w-9 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span className="sr-only">Close</span>
          </button>
        </div>
      )}

      {/* Collapsed launcher — only while closed. When the panel opens the
          expanded image REPLACES it (rather than stacking above it). The
          panel's own close button / Escape return to this launcher. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open coach chat"
          aria-expanded={open}
          className="pointer-events-auto block select-none rounded-full transition-transform duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/agent.png"
            alt="Talk to a Chronilogix coach"
            draggable={false}
            className="h-auto w-[110px] drop-shadow-[0_12px_28px_rgba(15,20,25,0.22)] md:w-[200px]"
          />
        </button>
      )}
    </div>
  );
}
