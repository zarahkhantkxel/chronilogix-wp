"use client";

import { useEffect, useRef, useState } from "react";

type LegalLink = { href: string; label: string };

export type AboutClosingCTAContent = {
  headingLead?: string;
  headingEmph?: string;
  body?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  contactIntro?: string;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneHref?: string;
  legalLinks?: LegalLink[];
};

const DEFAULTS = {
  headingLead: "Let’s create a future where",
  headingEmph: "care listens first.",
  body: "Whether you’re an employer, a health plan, a benefits broker, or someone looking for a better kind of support, we’d like to talk.",
  primaryLabel: "Get in Touch",
  primaryUrl: "mailto:steven@chronilogix.com",
  secondaryLabel: "See How It Works",
  secondaryUrl: "/product",
  contactIntro: "Or reach Steven directly",
  contactName: "Steven Amiel",
  contactRole: "CEO",
  contactEmail: "steven@chronilogix.com",
  contactPhone: "(646) 522 1447",
  contactPhoneHref: "tel:+16465221447",
  // Two documents only. HIPAA and Security were placeholder anchors with no
  // page behind them; the trust line beside this strip already carries the
  // data-handling promise, so the strip links only what actually exists.
  legalLinks: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ],
} satisfies Required<AboutClosingCTAContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

/**
 * Closing CTA section for the About page. Warm-paper register matching the
 * rest of the site — no dark slab. A brand-orange radial wash from the top
 * gives the close its "lights up" energy without resorting to ink.
 * Two CTAs (Get in Touch / See How It Works), a contact line for direct
 * outreach to Steven, and a folded legal strip act as the page's bookend.
 */
export function AboutClosingCTA({
  content,
}: {
  content?: AboutClosingCTAContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const legalLinks = content?.legalLinks?.length
    ? content.legalLinks
    : DEFAULTS.legalLinks;
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
  });

  return (
    <section
      id="get-in-touch"
      ref={ref}
      className="relative overflow-hidden rounded-[28px] bg-paper-warm py-24 md:py-32 lg:py-40"
    >
      {/* Brand wash from the top — picks up the same radial idiom AboutTeam
          uses, anchoring the close as a visual bookend. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 65% at 50% 0%, rgba(255,116,52,0.20) 0%, rgba(249,144,77,0.08) 35%, transparent 70%)",
        }}
      />

      <div className="container-page relative text-center">
        <h2
          className="mx-auto max-w-[20ch] text-display font-serif font-normal text-ink"
          style={reveal(0)}
        >
          {c.headingLead}{" "}
          <span className="text-brand italic">{c.headingEmph}</span>
        </h2>

        <p
          className="mx-auto mt-7 max-w-[52ch] text-[18px] leading-relaxed text-ink-soft md:text-[20px]"
          style={reveal(140)}
        >
          {c.body}
        </p>

        <div
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          style={reveal(260)}
        >
          <a href={c.primaryUrl} className="btn-primary group/cta-primary">
            {c.primaryLabel}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/cta-primary:translate-x-1"
            >
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a href={c.secondaryUrl} className="btn-secondary group/cta-secondary">
            {c.secondaryLabel}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/cta-secondary:translate-x-1"
            >
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div
          className="mx-auto mt-16 max-w-[56ch]"
          style={reveal(380)}
        >
          <p className="font-serif text-[13.5px] italic text-ink-muted">
            {c.contactIntro}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink md:text-[16px]">
            <span className="font-medium text-ink">{c.contactName}</span>,{" "}
            {c.contactRole}
            <span aria-hidden className="mx-3 text-ink/30">
              &middot;
            </span>
            <a
              className="text-ink-soft underline decoration-ink/20 underline-offset-4 transition-colors hover:text-brand-accent hover:decoration-brand-accent"
              href={`mailto:${c.contactEmail}`}
            >
              {c.contactEmail}
            </a>
            <span aria-hidden className="mx-3 text-ink/30">
              &middot;
            </span>
            <a
              className="text-ink-soft underline decoration-ink/20 underline-offset-4 transition-colors hover:text-brand-accent hover:decoration-brand-accent"
              href={c.contactPhoneHref}
            >
              {c.contactPhone}
            </a>
          </p>
        </div>

        {/* Bottom legal strip — folded into the CTA so this section acts
            as the page footer (the global Footer is omitted from /about).
            Hairline + muted ink colors keep it calm. */}
        <div
          className="relative mt-20 border-t border-ink/10 pt-7 md:mt-24"
          style={reveal(500)}
        >
          <div className="flex flex-col items-center justify-between gap-4 text-left md:flex-row md:gap-6">
            <p className="text-[13px] text-ink-muted md:text-sm">
              &copy; {new Date().getFullYear()} Chronilogix, Inc. All rights reserved.
            </p>
            {/* Same two documents as the global Footer strip — the HIPAA and
                Security entries were placeholder anchors with nothing behind
                them, so they're gone rather than left dead. Type ramp matches
                the global strip (13px / 14px) so /about doesn't read finer
                than the rest of the site. */}
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[13px] font-medium text-ink-muted transition-colors duration-200 ease-out hover:text-ink md:text-sm"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

