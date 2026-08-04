"use client";

import { useReveal } from "@/components/hooks/useReveal";

type Pillar = { title: string; body: string };

export type AppPartnersPillarsContent = {
  eyebrow?: string;
  heading?: string;
  pillars?: Pillar[];
};

const DEFAULTS = {
  eyebrow: "What Chronilogix brings inside",
  heading: "A clinical engine, not a chatbot skin.",
  pillars: [
    {
      title: "Thirty years of methodology, delivered as an API",
      body:
        "Motivational Interviewing built by Dr. Ken Resnicow, wrapped in a modern coaching runtime. No behavioral-science team to hire. No decade of trials to run. Plug in and ship.",
    },
    {
      title: "White-labeled from the surface down",
      body:
        "Your brand, your voice, your UI. Chronilogix is the intelligence underneath — invisible to your user, indispensable to your product.",
    },
    {
      title: "Every health-plan sale ships with it",
      body:
        "Sign a plan, Chronilogix is included. Every new deal expands your coaching reach without expanding your roadmap or headcount.",
    },
  ],
} satisfies Required<AppPartnersPillarsContent>;

const ROMAN = ["I", "II", "III"];

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AppPartnersPillars({
  content,
}: {
  content?: AppPartnersPillarsContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const pillars = content?.pillars?.length ? content.pillars : DEFAULTS.pillars;
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="ap-pillars-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="max-w-[64ch]">
          <p className="reveal-row eyebrow [transition-delay:80ms]">
            {c.eyebrow}
          </p>
          <h2
            id="ap-pillars-label"
            className="reveal-row mt-4 max-w-[24ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.heading}
          </h2>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-3 md:gap-6 lg:gap-10">
          {pillars.map((pillar, i) => {
            const delay = 320 + i * 140;
            const numeral = ROMAN[i] ?? String(i + 1);
            return (
              <li
                key={pillar.title}
                className="reveal-row group/pillar flex flex-col gap-5 border-t border-ink/12 pt-6 transition-transform duration-400 ease-out-quart motion-reduce:transition-none md:border-t-0 md:border-l md:pl-7 md:pt-1 md:hover:-translate-y-1"
                style={{ transitionDelay: `${delay}ms` }}
              >
                <span className="font-serif text-[13px] italic tracking-[0.04em] text-brand-700">
                  {numeral}.
                </span>
                <h3 className="text-lg font-medium leading-snug text-ink transition-colors duration-400 ease-out-quart motion-reduce:transition-none group-hover/pillar:text-brand-700 md:text-xl">
                  {pillar.title}
                </h3>
                <p className="body-quiet max-w-[38ch]">{pillar.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
