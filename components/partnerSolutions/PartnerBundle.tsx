"use client";

import { Fragment, useState, type ReactNode } from "react";
import { useReveal } from "@/components/hooks/useReveal";
import type { Bundle } from "@/components/partnerSolutions/partnerData";

// Warm gradient shell for the bundles. Intentionally lighter than the hero's
// — the page varies its surfaces on purpose, so the repeating bundles sit on a
// barely-there warm tint rather than the hero's fuller gradient.
const BUNDLE_BG =
  "linear-gradient(120deg, #FFFAF4 0%, #FEFCF9 48%, #FCF8F3 100%)";

// Soft stacked radial glow layered over the gradient — kept very faint so the
// bundle surface stays light and the content leads.
function BundleGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(55% 45% at 12% 8%, rgba(249,144,77,0.08), transparent 70%), radial-gradient(45% 40% at 92% 92%, rgba(228,90,28,0.05), transparent 72%)",
      }}
    />
  );
}

/**
 * PartnerBundle — one bundled solution as a light case study. Every bundle
 * shares the same shape: a text column (logo · category · title · lead ·
 * icon-pointers · resolution · tagline) beside a graphic column. The graphic
 * is one of three:
 *   • video — the Zenn demo card (carries the tagline in its caption)
 *   • list  — a blurred card listing the paired outcomes as icon rows
 *   • glyph — a blurred card with the partner glyph centered
 * Even-indexed bundles flip the columns (graphic on the left).
 */
export function PartnerBundle({ bundle }: { bundle: Bundle }) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const flipped = bundle.index % 2 === 0;

  return (
    <section
      aria-labelledby={`ps-${bundle.key}-label`}
      className="relative overflow-hidden rounded-[28px]"
      style={{ background: BUNDLE_BG }}
    >
      <BundleGlow />
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative grid items-stretch gap-10 py-20 md:py-28 lg:grid-cols-2 lg:gap-16 lg:py-32"
      >
        {/* Text column — on top when stacked; top-aligns with the card at lg+. */}
        <div className={flipped ? "lg:order-2" : ""}>
          <BundleHeading bundle={bundle} />

          <div className="mt-5 flex flex-col gap-4">
            {bundle.lead.map((para, i) => (
              <p
                key={i}
                className="reveal-row body-prose"
                style={{ transitionDelay: `${220 + i * 70}ms` }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Inline pointers — orange bullets. */}
          <div className="reveal-row mt-8 [transition-delay:360ms]">
            <BulletList
              heading={bundle.pointersHeading}
              items={bundle.pointers}
            />
          </div>

          {/* Resolution paragraph (only some bundles carry one). */}
          {bundle.leadAfter && (
            <p className="reveal-row mt-6 body-prose [transition-delay:420ms]">
              {bundle.leadAfter}
            </p>
          )}
        </div>

        {/* Graphic column */}
        <div className={`${flipped ? "lg:order-1" : ""} lg:h-full`}>
          {bundle.graphic === "video" && bundle.video ? (
            <ZennCard video={bundle.video} title={bundle.tagline} />
          ) : bundle.graphic === "list" ? (
            <GraphicListCard
              tagline={bundle.tagline}
              heading={bundle.graphicHeading}
              items={bundle.graphicList ?? []}
              icons={graphicListIcons(bundle.key)}
              footnote={bundle.graphicFootnote}
            />
          ) : (
            <GraphicStepsCard
              tagline={bundle.tagline}
              steps={bundle.graphicSteps ?? []}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// Shared header — partner logo (hero-sized), category eyebrow, serif title.
function BundleHeading({ bundle }: { bundle: Bundle }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bundle.logo.src}
        alt={bundle.logo.alt}
        className="reveal-row h-9 w-auto object-contain [transition-delay:40ms] md:h-11"
        draggable={false}
      />
      <p className="reveal-row eyebrow mt-6 text-[16px] [transition-delay:80ms]">
        {bundle.category}
      </p>
      <h2
        id={`ps-${bundle.key}-label`}
        className="reveal-row mt-4 font-serif font-normal text-section text-ink [transition-delay:140ms]"
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        {bundle.title}
      </h2>
    </>
  );
}

/**
 * BulletList — an optional uppercase heading over a list of items, each led by
 * a small orange bullet. Used for the inline description pointers in the text
 * column (the graphic cards render their own icon lists).
 */
function BulletList({
  heading,
  items,
}: {
  heading?: string;
  items: string[];
}) {
  return (
    <div>
      {heading && (
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-muted">
          {heading}
        </p>
      )}
      <ul className={`flex flex-col gap-1 ${heading ? "mt-5" : ""}`}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600"
            />
            <span className="body-prose">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * GraphicListCard — the "list" graphic: the same blurred product-shot
 * background used on the How-It-Works page, milk-washed for legibility, with a
 * brand-tone heading and the paired outcomes as a 2-up grid of icon-tile cards.
 * Each card is left-aligned — an orange gradient icon tile (same treatment as
 * the top-nav Solutions dropdown) over an 18px label. A trailing odd card
 * spans the full width so the last row doesn't sit half-empty.
 */
function GraphicListCard({
  tagline,
  heading,
  items,
  icons,
  footnote,
}: {
  tagline: string;
  heading?: string;
  items: string[];
  icons: ReactNode[];
  footnote?: string;
}) {
  const oddTail = items.length % 2 === 1;
  return (
    <div className="reveal-row relative mr-auto flex h-auto w-full lg:h-[650px] lg:w-full lg:max-w-[594px] xl:h-[713px] flex-col justify-center overflow-hidden rounded-[22px] border border-ink/10 shadow-[0_1px_2px_rgba(15,20,25,0.04),0_14px_30px_-26px_rgba(20,8,2,0.22)] [transition-delay:240ms]">
      <BlurredCardBackground washClass="bg-paper/75" />
      <div className="relative p-8 md:p-10">
        {/* Tagline — moved up from the text column; italic, but black here. */}
        <p
          className="font-serif text-xl italic text-ink md:text-2xl"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {tagline}
        </p>
        {heading && (
          <p className="mt-6 text-[16px] font-medium uppercase tracking-[0.06em] text-brand-700">
            {heading}
          </p>
        )}
        <ul className="mt-5 grid grid-cols-2 gap-3">
          {items.map((item, i) => (
            <li
              key={item}
              className={`flex flex-col items-start gap-3 rounded-xl border border-white/50 bg-white/45 p-4 shadow-[0_1px_2px_rgba(15,20,25,0.04)] backdrop-blur-md ${
                oddTail && i === items.length - 1 ? "col-span-2" : ""
              }`}
            >
              <span
                aria-hidden
                className="inline-flex shrink-0 items-center justify-center text-brand-600 [&>svg]:h-7 [&>svg]:w-7"
              >
                {icons[i]}
              </span>
              <span className="text-[16px] leading-snug text-ink">{item}</span>
            </li>
          ))}
        </ul>
        {footnote && (
          <>
            {/* Light divider then a small italic grey closing line. */}
            <div className="mt-9 h-px w-full bg-ink/10" />
            <p className="mt-3 text-[13px] italic text-ink-muted">{footnote}</p>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * GraphicStepsCard — the "steps" graphic: the tagline up top, then three
 * staggered glassy blocks (icon · orange heading · body) that unpack the
 * tagline word by word. The increasing left indent reads as a hierarchy.
 */
function GraphicStepsCard({
  tagline,
  steps,
}: {
  tagline: string;
  steps: { heading: string; body: string; meta?: string }[];
}) {
  const icons = stepIcons();
  return (
    <div className="reveal-row relative ml-auto flex h-auto w-full lg:h-[650px] lg:w-full lg:max-w-[594px] xl:h-[713px] flex-col justify-center overflow-hidden rounded-[22px] border border-ink/10 shadow-[0_1px_2px_rgba(15,20,25,0.04),0_14px_30px_-26px_rgba(20,8,2,0.22)] [transition-delay:240ms]">
      <BlurredCardBackground washClass="bg-paper/60" />
      <div className="relative p-8 md:p-10">
        {/* Tagline — moved up from the text column; italic, but black here. */}
        <p
          className="font-serif text-xl italic text-ink md:text-2xl"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {tagline}
        </p>
        <div className="mt-6 flex flex-col">
          {steps.map((step, i) => (
            <Fragment key={step.heading}>
              <div className="rounded-xl border border-white/50 bg-white/40 px-4 py-3 shadow-[0_1px_2px_rgba(15,20,25,0.04)] backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-brand-700"
                  >
                    {icons[i]}
                  </span>
                  <p className="text-[13px] font-medium text-brand-700">
                    {step.heading}
                  </p>
                </div>
                <p className="mt-2 text-[16px] leading-snug text-ink">
                  {step.body}
                </p>
                {step.meta && (
                  <>
                    {/* Light divider between the block copy and its compact
                        middot meta list. */}
                    <div className="mt-3 h-px w-full bg-ink/10" />
                    <p className="mt-3 text-[13px] leading-snug text-ink-muted">
                      {step.meta}
                    </p>
                  </>
                )}
              </div>
              {/* Thin gradient connector drawing the eye from one step to the
                  next — the same treatment as the products page's
                  "A coach, not a chatbot." card. */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="mx-auto h-7 w-px bg-gradient-to-b from-brand-600/60 to-brand-600/10"
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// Shared blurred backdrop for the list/glyph graphic cards — the How-It-Works
// product shot, scaled and blurred, with a milky wash for legibility.
function BlurredCardBackground({ washClass }: { washClass: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
        draggable={false}
      />
      <div aria-hidden className={`absolute inset-0 ${washClass}`} />
    </>
  );
}

/**
 * ZennCard — the Zenn demo sharing the other bundles' card: the same blurred
 * product-shot background, the poster-framed video on top (with the "Live
 * demo" eyebrow, runtime, and play button), and a caption beneath carrying the
 * tagline (italic serif, like the other bundles) and blurb. The card fills the
 * graphic column (h-full). Clicking the poster swaps in the inline video (same
 * asset shown on the homepage).
 */
function ZennCard({
  video,
  title,
}: {
  video: NonNullable<Bundle["video"]>;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="reveal-row relative ml-auto flex h-auto w-full lg:h-[650px] lg:w-full lg:max-w-[594px] xl:h-[713px] flex-col overflow-hidden rounded-[22px] border border-ink/10 shadow-[0_1px_2px_rgba(15,20,25,0.04),0_14px_30px_-26px_rgba(20,8,2,0.22)] [transition-delay:240ms]">
      <BlurredCardBackground washClass="bg-paper/75" />
      {/* Padded so the video sits inside the card (not edge-to-edge), matching
          the other bundles' card padding. */}
      <div className="relative flex flex-1 flex-col p-6 md:p-7">
        {/* Video — a rounded, inset thumbnail that fills the card's height. */}
        <div className="relative min-h-[240px] flex-1 overflow-hidden rounded-2xl border border-ink/10 bg-ink">
          {playing ? (
            <video
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play the demo: ${video.title}`}
              className="group/vid absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.poster}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out-quart group-hover/vid:scale-[1.03] motion-reduce:transition-none"
                draggable={false}
              />
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(15,20,25,0.42) 0%, rgba(15,20,25,0) 34%, rgba(15,20,25,0) 62%, rgba(15,20,25,0.46) 100%)",
                }}
              />
              <span className="absolute left-4 top-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
                {video.eyebrow}
              </span>
              <span className="absolute bottom-3.5 right-4 rounded-full bg-ink/55 px-2 py-0.5 text-[11px] font-medium tabular-nums text-white/90 backdrop-blur-sm">
                {video.runtime}
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-white shadow-[0_6px_18px_-4px_rgba(228,90,28,0.6)] transition-transform duration-300 ease-out-quart group-hover/vid:scale-110 motion-reduce:transition-none">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="currentColor"
                    aria-hidden
                    className="ml-0.5"
                  >
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>

        {/* Caption — tagline (italic serif, like the other bundles) + blurb. */}
        <div className="mt-5">
          <p
            className="font-serif text-xl italic text-ink md:text-2xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {title}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft md:text-base">
            {video.blurb}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Icon mapping ──────────────────────────────────────────────────────
// Hoisted functions (not module consts) so the JSX is built at render time,
// after every icon component below is defined — a module-scope const array of
// elements trips a temporal-dead-zone error in the dev bundler.

// Graphic-card list icons, keyed by bundle. Order matches bundle.graphicList.
function graphicListIcons(key: string): ReactNode[] {
  switch (key) {
    case "medimart":
      return [
        <TagIcon key="tag" />,
        <CalendarCheckIcon key="cal" />,
        <DropletIcon key="droplet" />,
        <HeartIcon key="heart" />,
        <TrendUpIcon key="trend" />,
      ];
    default:
      return [];
  }
}

// Step-card icons (scan · understand · improve). Order matches graphicSteps.
function stepIcons(): ReactNode[] {
  return [
    <SearchIcon key="scan" />,
    <LightbulbIcon key="understand" />,
    <TrendUpIcon key="improve" />,
  ];
}

// ── Icons ─────────────────────────────────────────────────────────────
// Sleek stroked line icons, matching the About-page value icons.

function TrendUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M2.5 12.5 L7 8 L10 11 L15.5 5.5 M11.25 5.5 H15.5 V9.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 15.25 C 9 15.25, 2.25 11.5, 2.25 6.75 C 2.25 4.7, 3.85 3.1, 5.9 3.1 C 7.15 3.1, 8.3 3.75, 9 4.75 C 9.7 3.75, 10.85 3.1, 12.1 3.1 C 14.15 3.1, 15.75 4.7, 15.75 6.75 C 15.75 11.5, 9 15.25, 9 15.25 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 2.5 C 9 2.5, 14 8, 14 11 A5 5 0 0 1 4 11 C 4 8, 9 2.5, 9 2.5 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 2.7 H14.2 A1.1 1.1 0 0 1 15.3 3.8 V9 L9 15.3 A1.3 1.3 0 0 1 7.2 15.3 L2.7 10.8 A1.3 1.3 0 0 1 2.7 9 L9 2.7 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function CalendarCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect
        x="3"
        y="4"
        width="12"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 7.5 H15 M6.5 2.5 V5 M11.5 2.5 V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.8 11 L8.3 12.4 L11.2 9.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M11.7 11.7 L15.5 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 2.5 A4.8 4.8 0 0 0 6.2 11.1 C 6.8 11.6, 7 12.1, 7 12.9 H11 C11 12.1, 11.2 11.6, 11.8 11.1 A4.8 4.8 0 0 0 9 2.5 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7.2 14.6 H10.8 M7.9 16 H10.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
