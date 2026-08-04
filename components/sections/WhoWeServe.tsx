"use client";

// WhoWeServe — "Who we serve" section, redesigned.
//
// The prior version was a one-at-a-time, auto-advancing left-rail
// carousel: only one persona was visible, so a visitor whose category
// sat at position 5 (Health Plans, Underserved, …) could scan the whole
// section and never realise their tab existed. This redesign borrows a
// two-column pattern — an anchored editorial left column beside a
// vertical list on the right — so EVERY persona is on screen at once.
//
// Interaction model (locked with the client):
//   • Brokers & Vendors have live deep-dive pages AND narrated audio
//     tracks. Their rows carry an inline audio player plus a direct link
//     to the sub-page. Audio is a taste; the link is the deep-dive.
//   • The other four (Employers, Health Plans, Wellness Platforms,
//     Underserved) have no sub-page, so their rows open a popup carrying
//     the persona's full detail (headline, description, metrics/signals).
//
// The persona data, glyph tiles, and detail popup all live in
// components/personas/personaData.tsx so this section and the Nav's
// Solutions mega-menu stay in lockstep.
//
// Two left-column visuals, chosen per page via the `variant` prop:
//   • "portrait"  (V1) — a warm human portrait, the person behind the buyer.
//   • "abstract"  (V4) — a designed warm motif: one core, every audience
//                        rippling outward from it.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  GlyphTile,
  PERSONAS,
  PersonaDetailPopup,
  type LinkPersona,
  type Persona,
  type PopupPersona,
} from "@/components/personas/personaData";

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy / persona data so the section renders identically when
// WordPress is unavailable or a field is empty.
export type WhoWeServeContent = {
  srHeading?: string;
  eyebrow?: string;
  headingLead?: string;
  headingMuted?: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  portraitImage?: string;
  portraitAlt?: string;
  personas?: Persona[];
};

const DEFAULTS = {
  srHeading: "The Markets We Serve",
  eyebrow: "The Markets We Serve",
  headingLead: "One platform.",
  headingMuted: "Every side of the system.",
  body: "Employers, brokers, health plans, product vendors, and wellness platforms each get a different return from the same engine — and the people who’d otherwise go unreached get a way in.",
  ctaLabel: "Talk to our team",
  ctaUrl: "#book-a-demo",
  portraitImage: "/who-we-serve.png",
  portraitAlt:
    "Two people in unhurried conversation in a warm, light-filled space.",
  personas: PERSONAS,
} satisfies Required<WhoWeServeContent>;

// ── Section ──────────────────────────────────────────────────────────

export function WhoWeServe({
  variant = "portrait",
  content,
}: {
  variant?: "portrait" | "abstract";
  content?: WhoWeServeContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const personas = content?.personas?.length
    ? content.personas
    : DEFAULTS.personas;

  const [openKey, setOpenKey] = useState<string | null>(null);
  const openPersona = personas.find(
    (p) => p.key === openKey && p.kind === "popup",
  ) as PopupPersona | undefined;

  // Audio personas (Brokers, Vendors) lead the list — they carry the
  // narrated tracks and the two live deep-dive pages. Popup personas
  // follow. Order is derived here so the data array can stay grouped by
  // definition without dictating display order.
  const orderedPersonas: Persona[] = [
    ...personas.filter((p) => p.kind === "link"),
    ...personas.filter((p) => p.kind === "popup"),
  ];

  return (
    <section
      id="who-we-serve"
      aria-labelledby="who-we-serve-label"
      className="relative bg-white lg:min-h-screen lg:overflow-hidden"
    >
      <h2 id="who-we-serve-label" className="sr-only">
        {c.srHeading}
      </h2>

      {/* Bottom fade only — softens the section's lower edge before the
          gap below. No top fade: the section above (Outcome) is the same
          paper-warm cream, so a white top veil had nothing to blend into
          and only hazed the heading and first rows. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
        style={{
          height: "min(180px, 18vh)",
          background:
            "linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)",
        }}
      />

      <div className="container-page flex flex-col justify-center py-16 md:py-24 lg:h-full lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-14 xl:gap-20">
          {/* Left — anchored editorial column. Fills the column height on
              desktop so the visual grows to meet the persona list. */}
          <div className="flex flex-col lg:h-full">
            <p className="eyebrow">{c.eyebrow}</p>
            <h3 className="mt-4 font-serif text-4xl font-normal leading-[1.05] text-ink md:text-5xl">
              {c.headingLead}{" "}
              <span className="text-ink-muted">{c.headingMuted}</span>
            </h3>
            <p className="mt-4 max-w-md body-prose">{c.body}</p>

            <a
              href={c.ctaUrl}
              className="group/cta btn-primary mt-6 w-fit"
            >
              {c.ctaLabel}
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
              >
                <ArrowRight />
              </span>
            </a>

            <div className="mt-7 lg:min-h-0 lg:flex-1">
              {variant === "abstract" ? (
                <AbstractVisual />
              ) : (
                <PortraitVisual image={c.portraitImage} alt={c.portraitAlt} />
              )}
            </div>
          </div>

          {/* Right — the full persona list, all visible at once. */}
          <ul className="min-w-0 divide-y divide-ink/10 lg:flex lg:h-full lg:flex-col">
            {orderedPersonas.map((persona) =>
              persona.kind === "link" ? (
                <LinkAudioRow key={persona.key} persona={persona} />
              ) : (
                <PopupRow
                  key={persona.key}
                  persona={persona}
                  onOpen={() => setOpenKey(persona.key)}
                />
              ),
            )}
          </ul>
        </div>
      </div>

      <PersonaDetailPopup
        persona={openPersona ?? null}
        onClose={() => setOpenKey(null)}
      />
    </section>
  );
}

// ── Left visuals ─────────────────────────────────────────────────────

function PortraitVisual({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative h-full overflow-hidden rounded-[24px] ring-1 ring-ink/8">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[320px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-[50%_45%]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"
        />
      </div>
    </div>
  );
}

// Abstract warm motif — one core, every audience rippling outward. Six
// soft nodes (the personas) sit on two concentric rings around a bright
// brand core, threaded by hairline spokes. Reads as "one engine, every
// side of the system" without a single stock illustration.
function AbstractVisual() {
  const nodes = [
    { x: 200, y: 60 },
    { x: 320, y: 150 },
    { x: 300, y: 300 },
    { x: 150, y: 330 },
    { x: 70, y: 220 },
    { x: 110, y: 110 },
  ];
  return (
    <div className="relative h-full overflow-hidden rounded-[24px] bg-paper-tint ring-1 ring-ink/8">
      <div className="relative aspect-[5/6] w-full lg:aspect-auto lg:h-full lg:min-h-[280px]">
        <svg
          viewBox="0 0 400 480"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <radialGradient id="wws-glow" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#FFCDA8" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#F9904D" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#F9904D" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wws-core" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFB088" />
              <stop offset="55%" stopColor="#FF7434" />
              <stop offset="100%" stopColor="#E45A1C" />
            </linearGradient>
          </defs>

          <rect width="400" height="480" fill="url(#wws-glow)" />

          {/* Concentric ripples emanating from the core. */}
          {[70, 120, 175, 230].map((r) => (
            <circle
              key={r}
              cx="200"
              cy="204"
              r={r}
              fill="none"
              stroke="#E45A1C"
              strokeOpacity={0.13 - r * 0.0003}
              strokeWidth="1"
            />
          ))}

          {/* Spokes from core to each node. */}
          {nodes.map((n, i) => (
            <line
              key={`s-${i}`}
              x1="200"
              y1="204"
              x2={n.x}
              y2={n.y + 84}
              stroke="#E45A1C"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
          ))}

          {/* Persona nodes. */}
          {nodes.map((n, i) => (
            <circle
              key={`n-${i}`}
              cx={n.x}
              cy={n.y + 84}
              r="7"
              fill="#FFFFFF"
              stroke="#FF7434"
              strokeWidth="1.6"
            />
          ))}

          {/* Bright brand core. */}
          <circle cx="200" cy="204" r="15" fill="url(#wws-core)" />
          <circle
            cx="200"
            cy="204"
            r="15"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

// ── Right-column rows ────────────────────────────────────────────────

function PopupRow({
  persona,
  onOpen,
}: {
  persona: PopupPersona;
  onOpen: () => void;
}) {
  return (
    <li className="lg:flex lg:min-h-[9rem] lg:flex-1">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`See details: ${persona.label}`}
        className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 py-4 text-left md:py-[1.15rem] lg:h-full"
      >
        <GlyphTile glyph={persona.glyph} variant={persona.iconVariant} />
        <span className="min-w-0">
          <span className="block text-lg font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-brand-700 md:text-xl">
            {persona.label}
          </span>
          <span className="mt-1.5 block max-w-xl body-quiet">
            {persona.hook}
          </span>
        </span>
        <span
          aria-hidden
          className="text-ink-subtle transition-all duration-200 group-hover:scale-110 group-hover:text-brand-600"
        >
          <Plus />
        </span>
      </button>
    </li>
  );
}

function LinkAudioRow({ persona }: { persona: LinkPersona }) {
  return (
    <li className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 py-4 md:py-[1.15rem] lg:min-h-[9rem] lg:flex-1">
      <GlyphTile glyph={persona.glyph} variant={persona.iconVariant} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <a
            href={persona.href}
            className="text-lg font-medium leading-snug text-ink transition-colors duration-200 hover:text-brand-700 md:text-xl"
          >
            {persona.label}
          </a>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-brand-700 ring-1 ring-brand-200/60">
            Listen
          </span>
        </div>
        <p className="mt-1.5 max-w-xl body-quiet">{persona.hook}</p>

        <div className="mt-3 max-w-sm">
          <InlineAudioPlayer
            src={persona.audio.src}
            title={persona.audio.title}
            durationHint={persona.audio.durationHint}
          />
        </div>
      </div>
      {/* Single affordance, top-right — the link to the deep-dive page. */}
      <a
        href={persona.href}
        aria-label={persona.linkLabel}
        className="text-ink-subtle transition-all duration-200 hover:translate-x-0.5 hover:text-brand-600"
      >
        <ArrowRight />
      </a>
    </li>
  );
}

// ── Inline audio player ──────────────────────────────────────────────

// Only one track should play at a time across the section. Each mounted
// player registers its <audio> here; when one starts, it pauses the rest.
const audioRegistry = new Set<HTMLAudioElement>();

function InlineAudioPlayer({
  src,
  title,
  durationHint,
}: {
  src: string;
  title: string;
  durationHint: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    audioRegistry.add(el);
    const onTime = () => setCurrentTime(el.currentTime);
    const onDur = () => setDuration(el.duration || 0);
    const onPlay = () => {
      // Pause every other registered track.
      audioRegistry.forEach((a) => {
        if (a !== el) a.pause();
      });
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onDur);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    return () => {
      audioRegistry.delete(el);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onDur);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }, []);

  const seek = useCallback(
    (clientX: number) => {
      const el = audioRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const dur = el.duration || durationHint;
      el.currentTime = ratio * dur;
      setCurrentTime(ratio * dur);
    },
    [durationHint],
  );

  const durSafe = duration || durationHint;
  const progress = Math.min(1, currentTime / durSafe);

  return (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? `Pause: ${title}` : `Play: ${title}`}
        className="group/play relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-300 hover:bg-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2"
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-full ring-2 ring-brand-accent/40 transition-opacity duration-300 ${
            isPlaying ? "animate-ping opacity-60" : "opacity-0"
          }`}
        />
        {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
      </button>

      <div
        ref={trackRef}
        role="slider"
        aria-label={`Seek: ${title}`}
        aria-valuemin={0}
        aria-valuemax={Math.round(durSafe)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        onClick={(e) => seek(e.clientX)}
        onKeyDown={(e) => {
          const el = audioRef.current;
          if (!el) return;
          if (e.key === "ArrowRight") el.currentTime = Math.min(durSafe, el.currentTime + 5);
          if (e.key === "ArrowLeft") el.currentTime = Math.max(0, el.currentTime - 5);
        }}
        className="group/scrub relative h-1.5 min-w-0 flex-1 cursor-pointer overflow-hidden rounded-full bg-ink/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-600"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
        {formatTime(currentTime)} / {formatTime(durSafe)}
      </span>
    </div>
  );
}

// ── Glyphs & helpers ─────────────────────────────────────────────────

function PlayGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden style={{ marginLeft: 1 }}>
      <path d="M6 4l10 6-10 6V4z" fill="currentColor" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden>
      <rect x="5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

// Popup personas (no subpage) use a plus — it reads as "expand for more"
// rather than "navigate away," which the arrow implies on the link rows.
function Plus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 2.5v9M2.5 7h9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Strip null/undefined/empty-string values so partial ACF payloads never blank
// out the section — the DEFAULTS show through instead.
function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
