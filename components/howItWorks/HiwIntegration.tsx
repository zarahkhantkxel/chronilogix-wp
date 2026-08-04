"use client";

import { useEffect, useRef, useState } from "react";

export type HiwIntegrationContent = {
  headingLead?: string;
  headingMuted?: string;
  intro?: string;
  paths?: { index: string; label: string; heading: string; body: string }[];
  infraLabel?: string;
  infraText?: string;
};

/**
 * Integration section — dedicated treatment for capability #15.
 *
 * Where HiwPlatform's compact pillars cover white-label and coverage in
 * one line each, the integration capability is content-heavy: four
 * commercial deployment paths plus the underlying infrastructure
 * posture. This section unpacks it as a 2×2 grid of paths so each one
 * can carry its own context, with a Stripe + HIPAA infrastructure note
 * closing the block.
 */

const DEFAULTS = {
  headingLead: "Plugs into how",
  headingMuted: "you already deliver care.",
  intro:
    "Four ways Chronilogix lands inside an existing care delivery model, on infrastructure that meets you where compliance demands it.",
  paths: [
    {
      index: "01",
      label: "Subscription access",
      heading: "Direct PEPM contracts with health plans.",
      body: "Member month pricing inside an existing plan footprint, without the plan having to build clinical IP from scratch.",
    },
    {
      index: "02",
      label: "Employer benefit bundles",
      heading: "Inside existing employer wellness benefits.",
      body: "Drops into a benefits portfolio alongside EAP, telehealth, and wellness vendors, reachable by every covered employee without a separate enrollment flow.",
    },
    {
      index: "03",
      label: "Affiliate software",
      heading: "Embedded in partner wellness or fitness apps.",
      body: "Lives as a coaching layer inside a partner’s existing app experience, same surface the member already opens, with Chronilogix doing the clinical work underneath.",
    },
    {
      index: "04",
      label: "Vendors of Chronic Care Supplies",
      heading: "Co-deployed with supplies and devices.",
      body: "Pairs with diabetes supply programs, glucose monitors, and other chronic care vendors so the behavioral layer ships in the same box as the clinical hardware.",
    },
  ],
  infraLabel: "Infrastructure",
  infraText:
    "Stripe powered consumer direct billing. HIPAA compliant by default.",
} satisfies Required<HiwIntegrationContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

// Icons stay hardcoded and are matched to paths by index (decorative).
const ICONS = [RecurringIcon, BriefcaseIcon, LinkIcon, PackageIcon];

function useInView<T extends HTMLElement>(threshold = 0.2) {
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

export function HiwIntegration({
  content,
}: {
  content?: HiwIntegrationContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const paths = content?.paths?.length ? content.paths : DEFAULTS.paths;
  const { ref, inView } = useInView<HTMLUListElement>(0.16);
  return (
    <section
      id="integration"
      className="relative overflow-hidden rounded-[28px] bg-white pt-14 pb-10 md:pt-16 md:pb-12 lg:pt-20 lg:pb-14"
    >
      <div className="container-page">
        {/* Header */}
        <div className="max-w-3xl">
          <h2
            className="text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.headingLead}{" "}
            <span className="text-ink-muted">{c.headingMuted}</span>
          </h2>
          <p className="mt-5 max-w-[62ch] body-quiet">{c.intro}</p>
        </div>

        {/* 2×2 grid of integration paths */}
        <ul
          ref={ref}
          className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 md:mt-20 md:grid-cols-2 md:gap-y-14"
        >
          {paths.map((path, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li
                key={path.label}
                className="flex flex-col"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${160 + i * 110}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${160 + i * 110}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/10 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-serif text-[13px] font-medium tabular-nums text-brand-700">
                    {path.index}
                  </span>
                </div>
                <p className="mt-5 text-[13px] font-medium tracking-tight text-ink-muted">
                  {path.label}
                </p>
                <h3
                  className="mt-3 max-w-[22ch] font-serif text-[22px] font-normal leading-[1.18] text-ink md:text-[24px]"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  {path.heading}
                </h3>
                <p className="mt-4 max-w-[40ch] text-[14.5px] leading-relaxed text-ink-soft md:text-[15px]">
                  {path.body}
                </p>
              </li>
            );
          })}
        </ul>

        {/* Infrastructure note — single muted line under the paths,
            separated by a hairline so the technical posture reads as
            ground-floor rather than another path. */}
        <div className="mt-16 border-t border-ink/10 pt-7 md:mt-20">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="text-[12px] font-medium tracking-tight text-ink-muted">
              {c.infraLabel}
            </span>
            <span className="text-[14.5px] leading-relaxed text-ink-soft md:text-[15px]">
              {c.infraText}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Integration path icons ────────────────────────────────────────────── */

function RecurringIcon({ className }: { className?: string }) {
  // Two opposing arrows curving around — a subscription / recurring motion.
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3.5 10a6.5 6.5 0 0 1 11.6-4" />
      <path d="M16.5 10a6.5 6.5 0 0 1-11.6 4" />
      <path d="M15 3v3h-3" />
      <path d="M5 17v-3h3" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="6.5" width="14" height="9.5" rx="1.6" />
      <path d="M7.2 6.5V5.2a1.2 1.2 0 0 1 1.2-1.2h3.2a1.2 1.2 0 0 1 1.2 1.2v1.3" />
      <path d="M3 10.5h14" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  // Two interlocked rings — affiliate / partner embed.
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8.4 6.6 6.6 4.8a3.3 3.3 0 0 0-4.6 4.6l2.6 2.6a3.3 3.3 0 0 0 4.6 0" />
      <path d="M11.6 13.4l1.8 1.8a3.3 3.3 0 0 0 4.6-4.6l-2.6-2.6a3.3 3.3 0 0 0-4.6 0" />
      <path d="M8 12l4-4" />
    </svg>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 3 3 6v8l7 3 7-3V6l-7-3Z" />
      <path d="M3 6l7 3 7-3" />
      <path d="M10 9v8" />
    </svg>
  );
}
