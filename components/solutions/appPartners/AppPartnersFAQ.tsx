"use client";

import { useState } from "react";
import { useReveal } from "@/components/hooks/useReveal";

type QA = { q: string; a: string };

export type AppPartnersFAQContent = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  questions?: QA[];
};

const DEFAULTS = {
  eyebrow: "Partner FAQ",
  heading: "What partners ask us first.",
  intro:
    "The five questions that come up in the first technical conversation — answered before you have to ask.",
  questions: [
    {
      q: "How does the integration work — REST, SDK, both?",
      a: "REST is the default surface — a single call in, a clinically grounded reply back. SDKs for common runtimes are in scope depending on partner needs. Contact us for the technical brief.",
    },
    {
      q: "Do we control the branding and the surface?",
      a: "Yes. Chronilogix is white-labeled from the surface down. Your brand, your voice, your UI. The engine is invisible to your user, indispensable to your product.",
    },
    {
      q: "How is member data handled between our platform and Chronilogix?",
      a: "Member data stays with you. Chronilogix processes context to compose each reply, but does not use member data to train our models. Full data-handling posture is in the technical brief.",
    },
    {
      q: "What does 'automatically included with plan sales' mean commercially?",
      a: "When you sell a health plan into your platform, Chronilogix is bundled with that deal automatically — no separate procurement cycle. We align on the commercial structure per partnership.",
    },
    {
      q: "How fast can we ship a working integration?",
      a: "First integrations typically land in weeks, not quarters. The exact timeline depends on your stack and product surface — contact us to align on scope.",
    },
  ],
} satisfies Required<AppPartnersFAQContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AppPartnersFAQ({
  content,
}: {
  content?: AppPartnersFAQContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const questions = content?.questions?.length
    ? content.questions
    : DEFAULTS.questions;
  const { ref, inView } = useReveal<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      aria-labelledby="ap-faq-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-20">
          <div>
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              {c.eyebrow}
            </p>
            <h2
              id="ap-faq-label"
              className="reveal-row mt-4 max-w-[16ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.heading}
            </h2>
            <p className="reveal-row mt-6 max-w-[38ch] body-quiet [transition-delay:280ms]">
              {c.intro}
            </p>
          </div>

          <ul className="flex flex-col divide-y divide-ink/12 border-y border-ink/12">
            {questions.map((item, i) => {
              const isOpen = openIndex === i;
              const delay = 320 + i * 100;
              return (
                <li
                  key={item.q}
                  className="reveal-row"
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-6 rounded-lg py-6 text-left transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2"
                  >
                    <span className="text-base font-medium leading-snug text-ink md:text-lg">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-transform duration-300 ease-out motion-reduce:transition-none"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      <svg
                        viewBox="0 0 12 12"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path d="M6 2v8M2 6h8" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                    }}
                  >
                    <div className="min-h-0">
                      <p className="body-quiet max-w-[62ch] pb-6 pr-10">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
