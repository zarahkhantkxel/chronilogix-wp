"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type HiwAudienceProfile = {
  key?: string;
  label: string;
  intro: string;
  headline: [string, string];
  description: string;
  // Small eyebrow label above the `extended` paragraph so a follow-on
  // block (e.g. Solida Health under Underserved communities) reads as
  // a deliberate sub-section instead of a runaway continuation.
  extendedLabel?: string;
  extended?: string;
  pull?: { lead: string; caption: string };
};

export type HiwAudienceContent = {
  srHeading?: string;
  profiles?: HiwAudienceProfile[];
};

const DEFAULTS = {
  srHeading: "Who Chronilogix reaches",
  profiles: [
    {
      key: "cant-afford",
      label: "Can't afford care",
      intro: "Cost barrier members",
      headline: ["Clinical quality coaching.", "Without the copay."],
      description:
        "High deductibles and out of pocket costs turn behavioral health into a luxury. Coaching, accountability support, and the behavioral reinforcement that actually sustains long term change is rarely covered by insurance. Chronilogix delivers clinical quality coaching at a fraction of the cost of live care, with no copay and no scheduling barrier.",
    },
    {
      key: "off-hours",
      label: "Off hours workers",
      intro: "Night shift, first responders, hospitality",
      headline: ["Care at 3 AM.", "Not just 3 PM."],
      description:
        "Night shift nurses. First responders. Transportation and manufacturing workers. Hospitality staff. These are people who need support at 3 AM, not 3 PM. The traditional system was not built for their schedule. Chronilogix was.",
      pull: { lead: "Anytime", caption: "Available when shift work is" },
    },
    {
      key: "wont-talk",
      label: "Won't talk to a clinician",
      intro: "Members who avoid live providers",
      headline: ["Honest where", "live care can't reach."],
      description:
        "Fear of judgment. Cultural stigma. The feeling that a stranger across a desk cannot be trusted with the most honest version of your struggle. These are real barriers that turn millions of people away from care entirely. In a non judgmental AI environment, many people are more honest than they have ever been with a live provider. That honesty is where change begins.",
    },
    {
      key: "fallen-through",
      label: "Fallen through the cracks",
      intro: "Post discharge and post therapy members",
      headline: ["Present long after", "the clinic goes silent."],
      description:
        "After discharge. After the therapy course ends. After the motivation from the diagnosis scare fades. These are the moments when traditional care goes silent. Chronilogix stays present. Not as a crisis line, but as the consistent coaching voice that remains long after the clinical intervention has closed.",
    },
    {
      key: "underserved",
      label: "Underserved communities",
      intro: "Members standard programs don't reach",
      headline: ["Standard programs miss.", "Chronilogix adapts."],
      description:
        "Hispanic men face a 64% higher rate of diabetes, yet represent just 2% of participants in the CDC's National Diabetes Prevention Program. Standard coaching fails these members linguistically, culturally, and financially. Chronilogix's MI based approach is built to adapt to cultural context, dietary norms, literacy levels, and behavioral readiness, not just translate the same program into another language.",
      extendedLabel: "Solida Health",
      extended:
        "That is why Chronilogix created Solida Health, a Hispanic and Latin division that runs as its own operation with the same commitment to the underlying clinical IP. Dr. Renata B, its president and a practicing physician, health coach, and cultural voice, has spent years delivering culturally attuned coaching on weight, body image, food, and movement to thousands of Hispanic men and women.",
      pull: { lead: "64%", caption: "Higher diabetes rate for Hispanic men" },
    },
  ] as HiwAudienceProfile[],
} satisfies Required<HiwAudienceContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

// Auto-advance dwell per profile — matches the home page persona section
// (12 s lands between a 250-wpm careful read and a 400-wpm skim). Used only
// in the non-pinned (mobile / reduced-motion) fallback.
const DWELL_MS = 12000;
// Each pinned step owns one full viewport of scroll distance. A CSS scroll-snap
// point sits at every step boundary with `scroll-snap-stop: always`, so a fast
// fling is forced to stop on each step — the section can't be skipped — while
// the browser handles all the scrolling natively (no event hijacking).
const STEP_VH = 100;

export function HiwAudience({ content }: { content?: HiwAudienceContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const profiles = content?.profiles?.length
    ? content.profiles
    : DEFAULTS.profiles;
  const stepCount = profiles.length;

  const [active, setActive] = useState(0);
  // Continuous rail position (0 … stepCount-1) so the fill/knob + horizontal
  // strip glide smoothly with the scroll; `active` is the rounded step that
  // drives the labels + content.
  const [railPos, setRailPos] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // The tall spacer that supplies the scroll distance; its offset maps to the
  // active step while the inner content stays pinned.
  const scrollWrapRef = useRef<HTMLDivElement>(null);
  // Once the visitor takes manual control of the rail in the fallback path,
  // auto-advance stops — their click is the strongest signal they're reading
  // at their own pace.
  const userTookOverRef = useRef(false);

  // Two pinned step modes + one fallback, chosen by width and motion pref:
  //   • pinned   (≥1024, motion ok) — pin the section, rail on the left,
  //     content on the right; the panel swaps in place per step.
  //   • pinnedH  (<1024, motion ok) — pin the section, rail stacked on top,
  //     content below on a horizontal strip that slides one panel per step
  //     (tablet and mobile).
  //   • fallback (reduced motion) — no pin; tap + auto-advance.
  // Both pinned modes use the tall-spacer + sticky + scroll-snap mechanism so
  // the visitor is stopped on every step and can't skip past.
  const pinned = isDesktop && !reducedMotion;
  const pinnedH = !isDesktop && !reducedMotion;
  const anyPinned = pinned || pinnedH;
  // Rail rides the continuous scroll position in both pinned modes.
  const continuous = anyPinned;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Width-based mode detection. One resize handler reading window.innerWidth
  // directly (rather than a matchMedia listener) so the breakpoint updates on
  // every resize — matchMedia's `change` only fires when a boundary is
  // crossed, which could miss updates and strand the section in the wrong
  // mode. Threshold: ≥1024 → pinned (rail beside content); below → pinnedH
  // (rail above a horizontal sliding strip).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  // ── Pinned scroll driver + snap gating ──────────────────────────────
  // Map how far the tall spacer has scrolled past the top of the viewport to a
  // fractional step position (purely visual — it drives the rail + slide) and
  // toggle mandatory y snapping ON only while the spacer fills the viewport.
  // Scoping the snap to the pinned range means the page snaps to each step
  // (with `scroll-snap-stop: always` on the anchors forbidding a fling from
  // passing one) without affecting the rest of the site. rAF-throttled.
  useEffect(() => {
    if (!anyPinned) return;
    const wrap = scrollWrapRef.current;
    if (!wrap) return;
    const root = document.documentElement;
    let raf = 0;
    let snapOn = false;
    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      if (total > 0) {
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        const pos = (scrolled / total) * (stepCount - 1);
        setRailPos(pos);
        setActive(Math.round(pos));
      }
      // Snap only while the section fully occupies the viewport.
      const filling = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (filling !== snapOn) {
        snapOn = filling;
        root.style.scrollSnapType = filling ? "y mandatory" : "";
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      root.style.scrollSnapType = "";
    };
  }, [anyPinned, stepCount]);

  // ── Fallback path (reduced motion) ──────────────────────────────────
  // Hold the auto-advance until the section is actually being read.
  useEffect(() => {
    if (anyPinned) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [anyPinned]);

  // Auto-advance timer. Stops at the last profile and once user clicks.
  useEffect(() => {
    if (anyPinned) return;
    if (reducedMotion || !inView) return;
    if (userTookOverRef.current) return;
    if (active >= stepCount - 1) return;
    const t = setTimeout(() => setActive((a) => a + 1), DWELL_MS);
    return () => clearTimeout(t);
  }, [active, inView, reducedMotion, stepCount, anyPinned]);

  const handleSelect = (idx: number) => {
    if (anyPinned) {
      // Scroll to the offset that lands on this step; the driver + snap sync
      // the rail and slide.
      const wrap = scrollWrapRef.current;
      if (!wrap) return;
      const total = wrap.offsetHeight - window.innerHeight;
      const wrapTop = window.scrollY + wrap.getBoundingClientRect().top;
      window.scrollTo({
        top: wrapTop + (idx / (stepCount - 1)) * total,
        behavior: reducedMotion ? "auto" : "smooth",
      });
      return;
    }
    userTookOverRef.current = true;
    setActive(idx);
  };

  const profile = profiles[active];
  const autoAdvancing =
    !anyPinned &&
    !reducedMotion &&
    inView &&
    !userTookOverRef.current &&
    active < stepCount - 1;

  return (
    <section
      ref={sectionRef}
      id="audience"
      aria-labelledby="audience-label"
      className="relative bg-paper-warm"
    >
      <h2 id="audience-label" className="sr-only">
        {c.srHeading}
      </h2>

      {/* Tall spacer supplies the scroll distance when pinned; the inner block
          sticks to the viewport and advances steps as it scrolls by, and the
          snap anchors below stop the scroll on each step. On the fallback path
          this is a plain wrapper in normal flow. */}
      <div
        ref={scrollWrapRef}
        className={anyPinned ? "relative" : ""}
        style={anyPinned ? { height: `${stepCount * STEP_VH}vh` } : undefined}
      >
        {/* One snap stop per step. `scroll-snap-stop: always` forbids the scroll
            from flinging past a step, so the visitor is stopped on every one. */}
        {anyPinned
          ? profiles.map((p, i) => (
              <div
                key={`snap-${p.key ?? i}`}
                aria-hidden
                className="pointer-events-none absolute inset-x-0"
                style={{
                  top: `${i * STEP_VH}vh`,
                  height: `${STEP_VH}vh`,
                  scrollSnapAlign: "start",
                  scrollSnapStop: "always",
                }}
              />
            ))
          : null}
        <div
          className={
            anyPinned
              ? // flex-col + overflow-y-auto + `my-auto` on the child centres a
                // step that fits and lets a taller one (the content-heavy last
                // step on a narrow phone) scroll into view instead of clipping.
                "sticky top-0 flex h-screen flex-col overflow-y-auto"
              : "relative"
          }
        >
          {/* Top / bottom edge gradients soften the boundary with adjacent
              full-bleed sections — same treatment as the home persona block. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-20"
            style={{
              height: "min(180px, 18vh)",
              background:
                "linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
            style={{
              height: "min(180px, 18vh)",
              background:
                "linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)",
            }}
          />

          <div
            className={`container-page w-full ${
              anyPinned ? "my-auto shrink-0 py-6" : "py-24 md:py-28 lg:py-32"
            }`}
          >
            {/* Tab rail + panel — the home persona pattern. */}
            <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-[300px_1fr] lg:gap-16 xl:grid-cols-[340px_1fr] xl:gap-24">
              <ProfileTabs
                profiles={profiles}
                stepCount={stepCount}
                active={active}
                railPos={railPos}
                continuous={continuous}
                onSelect={handleSelect}
                reducedMotion={reducedMotion}
                autoAdvancing={autoAdvancing}
              />
              {pinnedH ? (
                // 768–1023px — every step panel sits on one horizontal strip
                // that slides with the scroll, one panel per step.
                <SlidingPanels
                  profiles={profiles}
                  stepCount={stepCount}
                  railPos={railPos}
                  active={active}
                  reducedMotion={reducedMotion}
                />
              ) : (
                // Panel animates to the active tab's real content height so the
                // section is exactly as tall as the current step needs.
                <AudiencePanel
                  profile={profile}
                  index={active}
                  reducedMotion={reducedMotion}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileTabs({
  profiles,
  stepCount,
  active,
  railPos,
  continuous,
  onSelect,
  reducedMotion,
  autoAdvancing,
}: {
  profiles: HiwAudienceProfile[];
  stepCount: number;
  active: number;
  railPos: number;
  continuous: boolean;
  onSelect: (i: number) => void;
  reducedMotion: boolean;
  autoAdvancing: boolean;
}) {
  // Progress rail math — each row gets an equal slice of the list
  // height; track spans first-row center → last-row center; fill grows
  // top-down to the active row's center. In the pinned modes the fill + knob
  // ride the continuous `railPos` so they glide in lockstep with the scroll;
  // the fallback path uses the WAAPI dwell animation below.
  const segment = 100 / stepCount;
  const trackTop = segment / 2;
  const trackHeight = 100 - segment;
  const pos = continuous ? railPos : active;
  const fillHeight =
    stepCount > 1 ? (pos / (stepCount - 1)) * trackHeight : 0;
  const knobTop = trackTop + segment * pos;

  const fillRef = useRef<HTMLSpanElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);

  // Drive the fill height and knob position with WAAPI so the visual
  // progress is smooth and linear across the entire dwell. Fallback path
  // only — in the pinned modes the rail is positioned from `active` + CSS.
  useEffect(() => {
    if (continuous || !autoAdvancing) return;
    const fillEl = fillRef.current;
    const knobEl = knobRef.current;
    if (!fillEl || !knobEl) return;

    const startFill = (active / (stepCount - 1)) * trackHeight;
    const endFill = ((active + 1) / (stepCount - 1)) * trackHeight;
    const startKnob = trackTop + segment * active;
    const endKnob = trackTop + segment * (active + 1);

    const fillAnim = fillEl.animate(
      [{ height: `${startFill}%` }, { height: `${endFill}%` }],
      { duration: DWELL_MS, easing: "linear", fill: "forwards" },
    );
    const knobAnim = knobEl.animate(
      [{ top: `${startKnob}%` }, { top: `${endKnob}%` }],
      { duration: DWELL_MS, easing: "linear", fill: "forwards" },
    );

    return () => {
      fillAnim.cancel();
      knobAnim.cancel();
    };
  }, [
    active,
    autoAdvancing,
    continuous,
    segment,
    stepCount,
    trackHeight,
    trackTop,
  ]);

  return (
    <nav
      aria-label="Member profiles"
      className={
        continuous
          ? "relative lg:self-start"
          : "relative lg:sticky lg:top-28 lg:self-start"
      }
    >
      <ul className="relative">
        {/* Quiet base track */}
        <span
          aria-hidden
          className="absolute left-0 block w-px bg-ink/12"
          style={{
            top: `${trackTop}%`,
            height: `${trackHeight}%`,
          }}
        />
        {/* Progress fill */}
        <span
          ref={fillRef}
          aria-hidden
          className="absolute left-[-1.5px] block w-[4px] rounded-full"
          style={{
            top: `${trackTop}%`,
            height: `${fillHeight}%`,
            background:
              "linear-gradient(180deg, #FFB088 0%, #FF7434 55%, #E45A1C 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,116,52,0.08), 0 6px 18px -6px rgba(255,116,52,0.5)",
          }}
        />
        {/* Knob with pulse */}
        <span
          ref={knobRef}
          aria-hidden
          className="pointer-events-none absolute left-[1px]"
          style={{
            top: `${knobTop}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="relative block">
            <span
              aria-hidden
              className="knob-pulse absolute left-1/2 top-1/2 block h-[9px] w-[9px] rounded-full"
              style={{
                backgroundColor: "#FF7434",
                animation: reducedMotion
                  ? "none"
                  : "knobPulse 2400ms cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
              }}
            />
            <span
              className="relative block h-[9px] w-[9px] rounded-full bg-brand-accent"
              style={{
                boxShadow:
                  "0 0 0 3px rgba(255,116,52,0.15), 0 4px 10px -2px rgba(255,116,52,0.45)",
              }}
            />
          </span>
        </span>
        {profiles.map((p, i) => {
          const isActive = i === active;
          return (
            <li key={p.key ?? String(i)}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={isActive ? "true" : undefined}
                className="group relative flex w-full items-center rounded-md py-3.5 pl-6 pr-2 text-left transition-colors duration-200 ease-out motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-warm md:py-4"
              >
                <span
                  className={`text-[15px] font-medium leading-snug md:text-[16px] ${
                    isActive
                      ? "text-ink"
                      : "text-ink/45 group-hover:text-ink/75"
                  }`}
                  style={{
                    transition: reducedMotion
                      ? "none"
                      : "color 300ms ease-out",
                  }}
                >
                  {p.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Measures the active panel's natural height and animates the wrapper to
// it, so the section is exactly as tall as the current tab needs. Overflow
// is clipped so a grow (short → tall tab) reads as a clean top-down reveal
// instead of the new content briefly overlapping the section below.
function AudiencePanel({
  profile,
  index,
  reducedMotion,
}: {
  profile: HiwAudienceProfile;
  index: number;
  reducedMotion: boolean;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  // Measure synchronously on tab change so the height transition runs from
  // the previous value rather than flashing the new content unclipped.
  // Keyed on index (profiles sourced from ACF may not carry a stable key).
  useIsomorphicLayoutEffect(() => {
    if (innerRef.current) setHeight(innerRef.current.offsetHeight);
  }, [profile.key, index]);

  // Re-measure on responsive reflow (e.g. the description rewrapping).
  useEffect(() => {
    const el = innerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className="min-w-0 overflow-hidden"
      style={{
        height: height ?? undefined,
        transition: reducedMotion
          ? undefined
          : "height 480ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      <div ref={innerRef}>
        <ProfilePanel
          profile={profile}
          index={index}
          reducedMotion={reducedMotion}
        />
      </div>
    </div>
  );
}

// 768–1023px — every step panel laid out on one horizontal strip whose
// transform rides the continuous `railPos`, so the strip glides sideways in
// lockstep with the scroll (one panel per step). The wrapper height tracks the
// *current* step's natural height (top-aligned panels, not flex-stretch) so
// short early steps stay short and clear the header — only the content-heavy
// last step is tall. The wrapper clips off-screen (and taller) panels with
// overflow-hidden.
function SlidingPanels({
  profiles,
  stepCount,
  railPos,
  active,
  reducedMotion,
}: {
  profiles: HiwAudienceProfile[];
  stepCount: number;
  railPos: number;
  active: number;
  reducedMotion: boolean;
}) {
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [height, setHeight] = useState<number | null>(null);

  // Size the clip window to the active panel so the pinned group is only as
  // tall as the step being read.
  useIsomorphicLayoutEffect(() => {
    const el = panelRefs.current[active];
    if (el) setHeight(el.offsetHeight);
  }, [active]);

  // Re-measure the active panel on responsive reflow (e.g. text rewrapping).
  useEffect(() => {
    const el = panelRefs.current[active];
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  return (
    <div
      className="min-w-0 overflow-hidden"
      style={{
        height: height ?? undefined,
        transition: reducedMotion
          ? undefined
          : "height 480ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      <div
        className="flex items-start"
        style={{
          width: `${stepCount * 100}%`,
          transform: `translateX(-${(railPos / stepCount) * 100}%)`,
          willChange: "transform",
        }}
      >
        {profiles.map((p, i) => (
          <div
            key={p.key ?? i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="flex-none"
            style={{ width: `${100 / stepCount}%` }}
          >
            <ProfilePanel
              profile={p}
              index={i}
              reducedMotion={reducedMotion}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePanel({
  profile,
  index,
  reducedMotion,
}: {
  profile: HiwAudienceProfile;
  index: number;
  reducedMotion: boolean;
}) {
  return (
    <div key={profile.key ?? String(index)} className="flex flex-col">
      {/* Tiny intro line above the headline — matches the home persona
          pattern's "for [audience]" framing. */}
      <p
        className="text-[13px] font-medium tracking-tight text-brand-700"
        style={{
          opacity: 0,
          animation: reducedMotion
            ? "none"
            : "wordReveal 500ms cubic-bezier(0.22, 0.61, 0.36, 1) 80ms forwards",
        }}
      >
        {profile.intro}
      </p>

      <ProfileHeadline
        lines={profile.headline}
        reducedMotion={reducedMotion}
      />

      <p
        className="mt-5 max-w-2xl body-prose md:mt-6"
        style={{
          opacity: 0,
          animation: reducedMotion
            ? "none"
            : "wordReveal 600ms cubic-bezier(0.22, 0.61, 0.36, 1) 540ms forwards",
        }}
      >
        {profile.description}
      </p>

      {profile.extended ? (
        <div
          className="mt-6 max-w-2xl md:mt-7"
          style={{
            opacity: 0,
            animation: reducedMotion
              ? "none"
              : "wordReveal 600ms cubic-bezier(0.22, 0.61, 0.36, 1) 700ms forwards",
          }}
        >
          {profile.extendedLabel ? (
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-brand-700">
              {profile.extendedLabel}
            </p>
          ) : null}
          <p
            className={`body-prose text-ink-soft ${profile.extendedLabel ? "mt-3" : ""}`}
          >
            {profile.extended}
          </p>
        </div>
      ) : null}

      {profile.pull ? (
        <PullStat
          pull={profile.pull}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </div>
  );
}

function ProfileHeadline({
  lines,
  reducedMotion,
}: {
  lines: [string, string];
  reducedMotion: boolean;
}) {
  const wordsByLine = useMemo(
    () => lines.map((line) => line.split(" ")),
    [lines],
  );

  const BASE_DELAY = 160;
  const STRIDE = 55;
  let idx = 0;

  return (
    <h3 className="mt-5 font-serif text-display font-normal md:mt-6">
      {wordsByLine.map((words, li) => (
        <Fragment key={li}>
          {words.map((word, wi) => {
            const delay = BASE_DELAY + idx * STRIDE;
            idx += 1;
            const lineColor = li === 0 ? "#0F1419" : "#5B6470";
            return (
              <Fragment key={wi}>
                <span
                  className="inline-block"
                  style={
                    reducedMotion
                      ? { color: lineColor, opacity: 1 }
                      : {
                          color: lineColor,
                          opacity: 0.12,
                          filter: "blur(3.5px)",
                          animation: `wordReveal 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms forwards`,
                          willChange: "filter, opacity",
                        }
                  }
                >
                  {word}
                </span>
                {wi < words.length - 1 && " "}
              </Fragment>
            );
          })}
          {li < wordsByLine.length - 1 && <br />}
        </Fragment>
      ))}
    </h3>
  );
}

function PullStat({
  pull,
  reducedMotion,
}: {
  pull: { lead: string; caption: string };
  reducedMotion: boolean;
}) {
  return (
    <div
      className="mt-10 flex items-baseline gap-5 border-t border-ink/10 pt-6 md:mt-12"
      style={{
        opacity: 0,
        animation: reducedMotion
          ? "none"
          : "wordReveal 600ms cubic-bezier(0.22, 1, 0.36, 1) 880ms forwards",
      }}
    >
      <p className="font-serif text-stat-md font-normal text-ink tabular-nums">
        {pull.lead}
      </p>
      <p className="max-w-[28ch] text-[14.5px] font-medium leading-snug text-ink-soft md:text-[15px]">
        {pull.caption}
      </p>
    </div>
  );
}
