"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Testimonial = {
  name: string;
  quote: string;
  avatar?: string;
};

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type TestimonialsContent = {
  heading?: string;
  items?: Array<{
    name?: string;
    quote?: string;
    avatar?: string;
  }>;
};

/* Real voices captured from the Chronilogix beta. Adrian C. leads the
   sequence because the line lands the section's single thesis — one small
   action, not a total reset — in one sentence. */
const DEFAULTS = {
  heading: "What members are saying about Chronilogix AI Coaching",
  items: [
    {
      name: "Adrian C.",
      quote:
        "You don’t need to fix everything at once. Just pick one small action you’ll actually do tomorrow. That really clicked because I’ve been overwhelmed trying to change too much at once. It was simple, but exactly what I needed to hear.",
    },
    {
      name: "David B.",
      quote:
        "Working with the AI Coach felt supportive, practical, and motivating. The conversations felt personalized, helped me create realistic SMART goals, and gave me encouragement without sounding judgmental. I left each session feeling clearer, more confident, and motivated to keep improving step by step.",
    },
    {
      name: "Carl D.",
      quote:
        "Using Chronilogix has helped me turn a vague intention to “sleep better” into a clear, structured routine with measurable steps. The coaching felt increasingly tailored over time, especially in how it adapted suggestions to my actual schedule, which made it easier to stay consistent.",
    },
    {
      name: "Henry Clay",
      quote:
        "The AI Coach told me about the 4-7-8 and box breathing techniques, walking me through how it’s done. That was the most helpful thing she did for me.",
    },
    {
      name: "Serena Cooper",
      quote:
        "The most helpful thing the AI Coach said was to focus on steady, realistic progress instead of trying to accomplish everything at once. That perspective made the goal feel more manageable and helped reduce pressure while still keeping me motivated.",
    },
    {
      name: "Waleed Smith",
      quote:
        "The AI Coach helped me set clear, realistic goals and made it easier to stay consistent by breaking things into simple steps. The guidance was structured and easy to follow.",
    },
    {
      name: "Muhammad F.",
      quote:
        "The most helpful thing the AI Coach said was breaking the larger goal into smaller, manageable steps and emphasizing consistency over perfection.",
    },
    {
      name: "J.S.",
      quote:
        "I just told the AI casually about thoughts of dying that come to my mind, and it did well. It insisted I call 988, or get to an emergency room, or go stay with someone before we proceed. I truly appreciated that sense of empathy.",
    },
  ] as Testimonial[],
} satisfies Required<TestimonialsContent>;

export function Testimonials({ content }: { content?: TestimonialsContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const testimonials: Testimonial[] = (
    content?.items?.length ? content.items : DEFAULTS.items
  ) as Testimonial[];
  const { ref: sectionRef, inView } = useInView<HTMLElement>(0.15);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  /* Active-slide tracking via scroll position. Each slide takes the full
     track width, so the index is round(scrollLeft / clientWidth). Using
     the native scroll position keeps the dots in sync with touch swipes,
     wheel scrolls, and keyboard arrows for free. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const w = track.clientWidth;
      if (!w) return;
      const idx = Math.round(track.scrollLeft / w);
      setActive((prev) => (prev === idx ? prev : idx));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToIndex = useCallback(
    (idx: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(testimonials.length - 1, idx));
      track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    },
    [testimonials.length],
  );

  const prev = () => scrollToIndex(active - 1);
  const next = () => scrollToIndex(active + 1);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-labelledby="testimonials-heading"
      data-revealed={inView}
      // Reduced top padding (overriding .section's py) so the member
      // voices sit closer to the Aetna field proof directly above —
      // the two now read as one continuous cream panel.
      className="section bg-paper-warm pt-12 md:pt-16 lg:pt-20"
    >
      {/* Decorative serif quote glyphs — one in the top-left, one mirrored
          in the bottom-right. Sit inside .section (which is relative +
          overflow-hidden) so they hug the rounded corner radius without
          bleeding. Pointer-events-none + aria-hidden so they're pure
          ornament — the carousel underneath stays fully interactive. The
          glyphs are sized large enough to read as illustration rather than
          text, and tinted brand-orange at low opacity so they sit behind
          the quote without competing with it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-2 select-none font-serif leading-none text-brand-600/15 md:left-8 md:top-4 lg:left-12 lg:top-6"
        style={{
          fontSize: "clamp(8rem, 14vw, 16rem)",
        }}
      >
        &ldquo;
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 right-4 select-none font-serif leading-none text-brand-600/15 md:bottom-4 md:right-8 lg:bottom-6 lg:right-12"
        style={{
          fontSize: "clamp(8rem, 14vw, 16rem)",
        }}
      >
        &rdquo;
      </span>

      <div className="container-page">
        {/* Header — a single sentence-case eyebrow, centered. Per design
            review the previous serif heading + intro pulled too much weight
            and threw off the section balance; this label just sets context
            and gets out of the carousel's way. The h2 stays in the DOM as
            sr-only so screen readers still announce the section. */}
        <h2 id="testimonials-heading" className="sr-only">
          {c.heading}
        </h2>
        <p className="eyebrow reveal-row text-center">{c.heading}</p>

        {/* Carousel — single slide at a time, native scroll-snap. Quote
            blocks are sized so the longest reflection still fits without
            the track stretching, so the next-slide hint never bleeds in. */}
        <div
          className="reveal-quote relative mt-14 md:mt-20"
          role="region"
          aria-roledescription="carousel"
          aria-label="Member testimonials"
        >
          <div
            ref={trackRef}
            className="hide-scrollbar -mx-5 flex snap-x snap-mandatory overflow-x-auto scroll-smooth md:-mx-10 lg:-mx-16"
            style={{ scrollbarWidth: "none" }}
          >
            {testimonials.map((t, i) => (
              <Slide
                key={t.name}
                testimonial={t}
                index={i}
                count={testimonials.length}
                isActive={i === active}
              />
            ))}
          </div>

          {/* Controls — prev/next arrows on the sides, hidden on mobile
              where swipe is the natural gesture. Buttons are disabled at
              the ends rather than wrapping, so the user always knows where
              they are in the sequence. */}
          <button
            type="button"
            onClick={prev}
            disabled={active === 0}
            aria-label="Previous testimonial"
            className="absolute -left-1 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-soft transition-all duration-300 hover:border-brand-accent hover:bg-brand-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink/15 disabled:hover:bg-white disabled:hover:text-ink md:inline-flex md:h-12 md:w-12 lg:-left-2"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={active === testimonials.length - 1}
            aria-label="Next testimonial"
            className="absolute -right-1 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-soft transition-all duration-300 hover:border-brand-accent hover:bg-brand-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink/15 disabled:hover:bg-white disabled:hover:text-ink md:inline-flex md:h-12 md:w-12 lg:-right-2"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Dot indicators — sit below the carousel, clickable, also reflect
            scroll position via the active index. */}
        <div
          className="mt-10 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Select testimonial"
        >
          {testimonials.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show testimonial from ${t.name}`}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ease-out-quart ${
                  isActive
                    ? "w-8 bg-brand-600"
                    : "w-1.5 bg-ink/20 hover:bg-ink/40"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Slide — one full-width pull quote. Mirrors the original featured-quote
 * treatment: serif body, brand-orange marks, avatar + name centered below.
 * --------------------------------------------------------------------------*/

function Slide({
  testimonial,
  index,
  count,
  isActive,
}: {
  testimonial: Testimonial;
  index: number;
  count: number;
  isActive: boolean;
}) {
  return (
    <figure
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${count}`}
      aria-hidden={!isActive}
      className="flex w-full shrink-0 snap-center flex-col items-center justify-center px-5 md:px-10 lg:px-16"
    >
      <blockquote
        className={`max-w-3xl text-center font-serif font-normal leading-snug tracking-tight text-ink transition-opacity duration-500 ease-out-quart md:text-3xl lg:text-[2.25rem] lg:leading-[1.15] text-2xl ${
          isActive ? "opacity-100" : "opacity-40"
        }`}
      >
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-8 flex items-center justify-center gap-3 text-sm text-ink-muted">
        {testimonial.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.avatar}
            alt=""
            aria-hidden
            width={40}
            height={40}
            className="inline-flex shrink-0 rounded-full object-cover"
            style={{ width: 40, height: 40 }}
          />
        ) : (
          <Avatar name={testimonial.name} size={40} />
        )}
        <span className="font-medium text-ink-soft">{testimonial.name}</span>
      </figcaption>
    </figure>
  );
}

/* ----------------------------------------------------------------------------
 * Avatar — initials inside a tinted circle. Real photos aren't available
 * for these beta members (see outstanding-assets list in CLAUDE.md), so
 * initials in a brand-coherent palette stand in. Color is picked
 * deterministically from the name so the same person always gets the same
 * chip across renders.
 * --------------------------------------------------------------------------*/

const AVATAR_PALETTE: Array<{ bg: string; fg: string }> = [
  { bg: "#FFE0C2", fg: "#7A3A0F" },
  { bg: "#F9D8B6", fg: "#6F2E07" },
  { bg: "#FCE9D3", fg: "#8E4515" },
  { bg: "#F4E2CC", fg: "#5B3417" },
  { bg: "#FFD0A8", fg: "#6F2E07" },
  { bg: "#FBE7C8", fg: "#7A3A0F" },
  { bg: "#F2DCC0", fg: "#6F2E07" },
];

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = getInitials(name);
  const { bg, fg } = AVATAR_PALETTE[hashIndex(name, AVATAR_PALETTE.length)];

  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full font-medium"
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: Math.max(11, Math.round(size * 0.36)),
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </span>
  );
}

function getInitials(name: string): string {
  const parts = name.replace(/\./g, "").trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hashIndex(input: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h % mod;
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

/* ----------------------------------------------------------------------------
 * ChevronLeft / ChevronRight — small inline carousel control glyphs.
 * --------------------------------------------------------------------------*/

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 4 6 9l5 5" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 4l5 5-5 5" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
 * useInView — local copy so the section is self-contained, matching the
 * pattern used by Solution / Outcome / SessionWalkthrough.
 * --------------------------------------------------------------------------*/

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
