"use client";

import { useReveal } from "@/components/hooks/useReveal";

type Deal = { label: string; caption: string };

export type AppPartnersDistributionContent = {
  eyebrow?: string;
  heading?: string;
  body1?: string;
  body2?: string;
  deals?: Deal[];
};

const DEFAULTS = {
  eyebrow: "The distribution kicker",
  heading: "Every plan you close makes your product better.",
  body1:
    "When you sell a new health plan into your platform, Chronilogix comes with it. Automatically. Your coaching depth grows every time BD wins — no roadmap cost, no re-integration.",
  body2:
    "It’s the rare distribution model where each new partnership expands the underlying product, instead of stretching your team thinner.",
  // Illustrative scale hints — labeled abstractly so the tickets don't
  // read as fabricated customer numbers. The visual makes the argument
  // (each deal ships Chronilogix with it), not the specific figures.
  deals: [
    { label: "Regional plan", caption: "Small footprint" },
    { label: "Multi-state plan", caption: "Mid-market" },
    { label: "National plan", caption: "Enterprise reach" },
  ],
} satisfies Required<AppPartnersDistributionContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AppPartnersDistribution({
  content,
}: {
  content?: AppPartnersDistributionContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const deals = content?.deals?.length ? content.deals : DEFAULTS.deals;
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="ap-distro-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              {c.eyebrow}
            </p>
            <h2
              id="ap-distro-label"
              className="reveal-row mt-4 max-w-[22ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.heading}
            </h2>
            <div className="mt-6 max-w-[54ch] space-y-5 body-prose">
              <p className="reveal-row [transition-delay:280ms]">
                {c.body1}
              </p>
              <p className="reveal-row [transition-delay:420ms]">
                {c.body2}
              </p>
            </div>
          </div>

          <ol
            className="reveal-row flex flex-col gap-3 [transition-delay:520ms]"
            aria-hidden
          >
            {deals.map((d, i) => (
              <li
                key={d.label}
                className="group/deal flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-paper-warm px-5 py-4 transition-all duration-400 ease-out-quart hover:-translate-y-0.5 hover:border-brand-500/30 motion-reduce:transition-none md:px-6 md:py-5"
                style={{
                  marginLeft: `${i * 12}px`,
                }}
              >
                <div>
                  <span className="font-serif text-[12px] italic text-ink-muted">
                    Deal ticket
                  </span>
                  <p className="mt-1 font-serif text-lg text-ink md:text-xl">
                    {d.label}
                  </p>
                  <p className="text-[13px] text-ink-soft">{d.caption}</p>
                </div>
                <span className="font-serif text-[13px] italic text-brand-700">
                  includes Chronilogix
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
