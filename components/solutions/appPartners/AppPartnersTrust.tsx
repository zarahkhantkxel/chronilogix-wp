"use client";

import { useReveal } from "@/components/hooks/useReveal";
import { ComplianceBadges } from "@/components/ComplianceBadges";

export type AppPartnersTrustContent = {
  eyebrow?: string;
  heading?: string;
  lines?: string[];
  complianceLabel?: string;
  complianceBody?: string;
};

const DEFAULTS = {
  eyebrow: "Trust & security",
  heading: "A partner your security team will actually approve.",
  lines: [
    "Member data is never used to train our models.",
    "SOC 2 Type II and GDPR Ready — verified, not aspirational.",
    "HIPAA-compliant infrastructure with clinical-grade guardrails.",
  ],
  complianceLabel: "Compliance posture",
  complianceBody:
    "The certifications your security review will ask about before an integration approval, ready in one link.",
} satisfies Required<AppPartnersTrustContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AppPartnersTrust({
  content,
}: {
  content?: AppPartnersTrustContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const lines = content?.lines?.length ? content.lines : DEFAULTS.lines;
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="ap-trust-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-20 md:py-24 lg:py-28"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <div>
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              {c.eyebrow}
            </p>
            <h2
              id="ap-trust-label"
              className="reveal-row mt-4 font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.heading}
            </h2>
            <ol className="mt-8 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
              {lines.map((line, i) => {
                const numeral = ["I", "II", "III"][i] ?? String(i + 1);
                return (
                  <li
                    key={line}
                    className="reveal-row grid grid-cols-[2rem_1fr] gap-x-4 py-4 body-quiet"
                    style={{ transitionDelay: `${300 + i * 120}ms` }}
                  >
                    <span className="font-serif text-[13px] italic leading-[1.55] text-brand-700">
                      {numeral}.
                    </span>
                    <span>{line}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="reveal-row rounded-[24px] border border-ink/10 bg-paper-warm p-8 md:p-10 [transition-delay:520ms]">
            <p className="eyebrow-muted">{c.complianceLabel}</p>
            <div className="mt-5">
              <ComplianceBadges />
            </div>
            <p className="mt-6 max-w-[42ch] body-quiet">
              {c.complianceBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
