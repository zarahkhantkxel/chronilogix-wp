"use client";

import { useReveal } from "@/components/hooks/useReveal";
import { PhoneChatMockup } from "@/components/PhoneChatMockup";

/**
 * VendorsProgramGap — specialized AI health coaches (Section 4).
 *
 * Chronilogix gives each patient a condition-specific AI coach, a mental
 * health coach or a diabetes coach, available 24/7 and grounded in
 * Motivational Interviewing and Dr. Ken Resnicow's decades of behavioral
 * science, so patients stay engaged continuously rather than episodically.
 * Left column: the animated conversational phone mockup in a surface-glass
 * panel; right column: heading, copy, and attribute pills.
 */

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when a field is empty.
export type VendorsProgramGapContent = {
  headingLead?: string;
  headingEmph?: string;
  body1?: string;
  body2?: string;
  pills?: string[];
};

const DEFAULTS = {
  headingLead: "Specialized 24/7 AI coaches that keep patients",
  headingEmph: "engaged.",
  body1:
    "Chronilogix gives every patient a dedicated AI coach for their condition, a mental health coach or a diabetes coach, available 24/7 to guide, motivate, and support them throughout their care.",
  body2:
    "Each coach is trained in Motivational Interviewing and backed by Dr. Ken Resnicow’s 30+ years of evidence-based behavioral change research, helping patients overcome the everyday barriers that derail treatment and engaging them continuously, not episodically:",
  pills: [
    "Mental health coach",
    "Diabetes coach",
    "Available 24/7",
    "Motivational Interviewing",
    "30+ years of research",
  ],
} satisfies Required<VendorsProgramGapContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function VendorsProgramGap({
  content,
}: {
  content?: VendorsProgramGapContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const REQUIREMENTS = content?.pills?.length ? content.pills : DEFAULTS.pills;
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-program-gap-label"
      className="relative overflow-hidden rounded-[28px] bg-brand-50"
    >
      {/* Soft orange wash — a little warmth under the whole section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 88% 18%, rgba(249,144,77,0.16), transparent 70%), radial-gradient(55% 45% at 6% 90%, rgba(255,116,52,0.08), transparent 72%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 items-stretch gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left (desktop): the animated conversational phone (same mockup
              as the homepage hero) in the surface-glass panel treatment used
              by the Product page's second section — the block fills the
              column height (flex-1) with the phone anchored to the bottom. */}
          <div className="reveal-row order-2 flex flex-col lg:order-1 [transition-delay:420ms]">
            <div
              className="surface-glass relative flex flex-1 items-end justify-center overflow-hidden rounded-[24px] min-h-[460px] md:min-h-[560px]"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -1px 0 rgba(15, 20, 25, 0.04)",
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[24px]"
                style={{
                  background:
                    "radial-gradient(60% 60% at 0% 0%, rgba(249, 144, 77, 0.10) 0%, rgba(249, 144, 77, 0) 70%)",
                }}
              />
              <div className="relative w-full max-w-[520px]">
                <PhoneChatMockup />
              </div>
            </div>
          </div>

          {/* Right (desktop): the copy. */}
          <div className="order-1 lg:order-2">
            <h2
              id="vendors-program-gap-label"
              className="reveal-row max-w-[22ch] font-serif font-normal text-section text-ink [transition-delay:160ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.headingLead}{" "}
              <span className="text-brand-700 italic">{c.headingEmph}</span>
            </h2>

            <p className="reveal-row mt-5 max-w-[46ch] body-prose [transition-delay:240ms]">
              {c.body1}
            </p>
            <p className="reveal-row mt-4 max-w-[46ch] body-prose [transition-delay:320ms]">
              {c.body2}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {REQUIREMENTS.map((req, i) => (
                <span
                  key={req}
                  className="reveal-row rounded-full bg-white px-5 py-3 text-[14px] font-medium text-ink shadow-soft ring-1 ring-ink/10"
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

