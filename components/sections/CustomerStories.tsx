"use client";

import { useEffect, useRef, useState } from "react";

// ScienceKen — the Dr. Resnicow "science behind Chronilogix" beat.
// Deliberately mirrors the MIExplainer section's layout/pattern so the
// two adjacent sections read as a matched pair: same rounded container,
// same container-page padding, same 5fr/7fr proportions and items-center
// grid, same contained rounded-card visual treatment. Only the sides are
// mirrored — here the visual (Dr. Resnicow) sits on the LEFT and the copy
// on the RIGHT.
export function ScienceKen() {
  return (
    <section
      id="science"
      aria-label="The science behind Chronilogix"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div className="container-page relative z-10 py-20 md:py-28 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
          {/* Left — Dr. Resnicow video/portrait, framed as a card. */}
          <KenVideo />

          {/* Right — copy. */}
          <div>
            <p className="eyebrow">The science behind Chronilogix</p>
            <h2
              className="mt-4 text-section font-serif font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Thirty years of clinical evidence,{" "}
              <span className="text-ink-muted">
                built into every conversation.
              </span>
            </h2>
            <p className="mt-6 body-prose md:mt-7">
              Dr. Kenneth Resnicow is our Chief Science Officer and one of
              the world&rsquo;s foremost authorities on Motivational
              Interviewing. We have translated his life&rsquo;s work into
              the AI that powers every Chronilogix conversation.
            </p>
            <div className="mt-8 md:mt-9">
              <a href="/about" className="btn-primary group/link">
                About
                <Arrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// AetnaProof — the field-proof beat, in the minimal editorial layout the
// Outcome section uses: a rounded cream card with eyebrow + hero headline +
// intro, then each proof as ONE big serif statement whose stat leads in brand
// orange, set over a hairline rule, with a small source logo and a formal
// source line. Type-led and quiet — no cards, no panels. Two proofs: the
// PREMISE — support between visits changes outcomes (US Diabetes Prevention
// Program / CDC) — and the METHOD — Dr. Resnicow's MI drives engagement
// (Aetna). Keeps id="customer-stories" so the SectionGuide "Proof" anchor
// resolves. Numbers are canonical: DPP per CDC/NIH; Aetna per /case-studies/aetna.

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
type Proof = {
  logo?: string;
  logoAlt?: string;
  logoClass?: string;
  stat?: string;
  statClass?: string;
  measure?: string;
  clause?: string;
  source?: string;
};

export type AetnaProofContent = {
  eyebrow?: string;
  headingLead?: string;
  headingMuted?: string;
  intro?: string;
  proofs?: Proof[];
};

const DEFAULTS = {
  eyebrow: "Proof in the field",
  headingLead: "The premise is proven.",
  headingMuted: "So is the method.",
  intro:
    "Support between visits changes outcomes &mdash; and Dr. Resnicow’s Motivational Interviewing, the method inside Chronilogix, is <span class=\"text-ink\">what keeps people engaged in it</span>.",
  proofs: [
    {
      logo: "/Aetna_Logo.svg",
      logoAlt: "Aetna",
      logoClass: "h-9 md:h-10",
      stat: "53.1% → 76%",
      statClass: "text-[1.3em]",
      measure: "member engagement",
      clause:
        "after Aetna’s care teams retrained in Dr. Resnicow’s method — dropouts cut by more than half.",
      source: "Source · Aetna Care Management · post-MI integration",
    },
    {
      logo: "/us-dpp-logo.png",
      logoAlt: "Centers for Disease Control and Prevention",
      logoClass: "h-9 md:h-10",
      stat: "58%",
      statClass: "text-[1.55em]",
      measure: "fewer new Type 2 diabetes cases",
      clause:
        "when lifestyle support continues between appointments — the gap Chronilogix covers.",
      source: "Source · US Diabetes Prevention Program · CDC and NIH",
    },
  ] as Proof[],
} satisfies Required<AetnaProofContent>;

function useProofInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);
  return { ref, inView };
}

export function AetnaProof({ content }: { content?: AetnaProofContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const proofs: Proof[] = content?.proofs?.length
    ? content.proofs
    : DEFAULTS.proofs;

  return (
    <section
      id="customer-stories"
      aria-labelledby="field-proof-heading"
      className="relative flex flex-col justify-center rounded-[28px] bg-paper-warm py-14 md:py-16 lg:min-h-[calc(100vh-1rem)] lg:py-0"
    >
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2
            id="field-proof-heading"
            className="mt-4 text-hero font-serif font-normal text-ink"
          >
            {c.headingLead}
            <br />
            <span className="text-ink-muted">{c.headingMuted}</span>
          </h2>

          <p
            className="mt-5 max-w-[54ch] body-prose"
            dangerouslySetInnerHTML={{ __html: c.intro }}
          />
        </div>

        {/* Two proofs side by side so the whole beat sits in one viewport —
            each a big serif statement whose stat leads in brand orange, under
            a shared hairline, split by a vertical rule on desktop. */}
        <div className="mt-9 grid gap-8 md:mt-11 md:grid-cols-2 md:gap-0">
          {proofs.map((proof, i) => (
            <ProofStatement key={proof.source ?? i} proof={proof} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofStatement({ proof, index }: { proof: Proof; index: number }) {
  const { ref, inView } = useProofInView<HTMLElement>(0.25);
  const logoClass = proof.logoClass ?? "h-9 md:h-10";
  const statClass = proof.statClass ?? "text-[1.3em]";

  return (
    <figure
      ref={ref}
      className={`border-t border-ink/10 pt-6 md:pt-8 ${
        index > 0 ? "md:border-l md:pl-8 lg:pl-12" : "md:pr-8 lg:pr-12"
      }`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${index * 120}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${index * 120}ms`,
      }}
    >
      {/* Small source mark — the credential behind the number. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={proof.logo}
        alt={proof.logoAlt}
        className={`${logoClass} w-auto`}
        draggable={false}
          loading="lazy"
          decoding="async"
        />

      <blockquote>
        <p className="mt-5 font-serif text-[21px] font-normal leading-[1.28] text-ink md:text-[24px] lg:text-[26px]">
          <span
            className={`mr-2 font-normal text-brand-700 ${statClass} leading-[0.9] align-[-0.06em] tabular-nums`}
          >
            {proof.stat}
          </span>
          {proof.measure},{" "}
          <span className="text-ink-muted">{proof.clause}</span>
        </p>
      </blockquote>

      <figcaption className="source-line mt-5 md:mt-6">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-brand"
        />
        {proof.source}
      </figcaption>
    </figure>
  );
}

// CustomerStories — legacy composite (V2–V4 still import this). Renders
// the two split sections back-to-back so those pages are unaffected.
export function CustomerStories() {
  return (
    <>
      <ScienceKen />
      <AetnaProof />
    </>
  );
}

/* ----------------------------------------------------------------------------
 * KenVideo — the 60-second intro from Dr. Resnicow. Shows the portrait as a
 * poster with a play affordance; on play it swaps to native controls and
 * plays the clip. The clip file is pending — drop it at
 * /public/video/ken-resnicow-60s.mp4 and it plays with no further changes.
 * --------------------------------------------------------------------------*/

function KenVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play().then(() => setPlaying(true)).catch(() => {
      // Clip not yet supplied (or blocked) — leave the poster in place.
    });
  };

  return (
    <div
      onClick={!playing ? start : undefined}
      className={`relative aspect-[3/2] overflow-hidden rounded-[24px] border border-ink/[0.08] bg-ink shadow-[0_10px_28px_-18px_rgba(20,8,2,0.18)] lg:aspect-auto lg:h-[455px] ${
        !playing ? "cursor-pointer" : ""
      }`}
    >
      {/* Ken sits in the left ~45% of the frame; object-[20%] keeps the
          crop biased toward him so he stays the focus in the taller,
          near-square card that matches the MI dialogue panel's height. */}
      <video
        ref={videoRef}
        poster="/ken-thumbnail.webp"
        src="/video/ken-resnicow-60s.mp4"
        playsInline
        preload="none"
        controls={playing}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover object-[20%_center]"
      />

      {!playing && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/10"
          />

          <div className="pointer-events-none absolute bottom-8 left-8 right-8 text-white md:bottom-10 md:left-10 lg:bottom-12 lg:left-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">
              Chief Science Officer
            </p>
            <p className="mt-2 font-serif text-xl font-normal text-white md:text-2xl">
              Dr. Kenneth Resnicow
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Small inline arrow used by both CTAs. Lives in this file because nothing
 * else on the page uses this exact treatment.
 * --------------------------------------------------------------------------*/

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform group-hover/link:translate-x-0.5"
    >
      <path d="M3 7h8M7.5 3l3.5 4-3.5 4" />
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
