"use client";

import { useReveal } from "@/components/hooks/useReveal";
import { PhoneChatMockup } from "@/components/PhoneChatMockup";

/**
 * BrokersMemberExperience — the members' AI coaching section (Section
 * 4).
 *
 * Chronilogix gives members two specialized AI coaches: Millie for
 * mental and behavioral health, and Roni for diabetes and chronic
 * care. Both run Motivational Interviewing backed by thirty-plus years
 * of behavioral science research, personalized to each member and
 * available without depending on clinician availability.
 *
 * Device-left / copy-right composition: the homepage hero's conversational
 * chat phone (Millie's mental-health exchange) carries the experience,
 * shown fully rather than scroll driven, in the same surface-glass panel
 * treatment as the rest of the site.
 */

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type BrokersMemberExperienceContent = {
  heading?: string;
  body?: string;
  pivotLead?: string;
  pivotEmph?: string;
  tags?: string[];
};

const DEFAULT_TAGS = [
  "Onboarding",
  "Daily check-ins",
  "Goal tracking",
  "Progress reporting",
];

const DEFAULTS = {
  heading:
    "Two specialized AI coaches: one for mental health, one for diabetes.",
  body: "Millie coaches members through mental and behavioral health, while Roni guides those managing diabetes and chronic conditions. Both run Motivational Interviewing, grounded in 30 years of behavioral science research, personalized to each member and available without waiting on a clinician’s calendar.",
  pivotLead: "Not reminders. Not wellness noise.",
  pivotEmph: "Real behavior change, at scale.",
  tags: DEFAULT_TAGS,
} satisfies Required<BrokersMemberExperienceContent>;

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

export function BrokersMemberExperience({
  content,
}: {
  content?: BrokersMemberExperienceContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const CAPABILITY_TAGS = content?.tags?.length ? content.tags : DEFAULTS.tags;
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      id="how-it-works"
      aria-labelledby="brokers-member-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 items-stretch gap-12 md:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Left (desktop): the phone-in-hand conversational mockup — the
              same PhoneChatMockup used on the Vendors page — in the shared
              surface-glass panel with a warm top-left glow. The block fills
              the column height (flex-1) with the phone anchored to the
              bottom. */}
          <div className="reveal-row order-2 flex flex-col lg:order-1 [transition-delay:320ms]">
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
          <div className="flex flex-col justify-center order-1 lg:order-2">
            <h2
              id="brokers-member-label"
              className="reveal-row mt-4 max-w-[22ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.heading}
            </h2>
            <p className="reveal-row mt-6 max-w-[52ch] body-prose [transition-delay:280ms]">
              {c.body}
            </p>
            <p className="reveal-row mt-5 max-w-[46ch] font-serif text-row font-normal leading-[1.15] text-ink [transition-delay:380ms]">
              {c.pivotLead}{" "}
              <span className="text-brand-700 italic">
                {c.pivotEmph}
              </span>
            </p>

            {/* Capability tags — quiet chip row summarizing what the
                coaching product covers. */}
            <ul className="reveal-row mt-8 flex flex-wrap gap-2 md:gap-3 [transition-delay:480ms]">
              {CAPABILITY_TAGS.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-full border border-ink/12 bg-white px-4 py-2 text-xs font-medium text-ink shadow-[0_1px_2px_rgba(15,20,25,0.04)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
