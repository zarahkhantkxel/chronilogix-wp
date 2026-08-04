const CARDS = [
  {
    audience: "Employers & HR",
    blurb: "Based on workforce size and program scope.",
    cta: "Contact Us",
  },
  {
    audience: "Universities",
    blurb: "Based on enrolled student population.",
    cta: "Talk to Our Team",
  },
  {
    audience: "Health Plans",
    blurb: "Priced on covered member volume.",
    cta: "Get a Custom Quote",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section bg-paper">
      <div className="container-page">
        <p className="eyebrow">Pricing</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl text-section font-serif font-normal text-ink">
            Priced for scale. Built around the people you serve.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink-soft">
            Pricing is based on member or student volume, not seat count. The
            more people you serve, the better the unit economics get.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => {
            const featured = i === 1;
            return (
              <div
                key={c.audience}
                className={`flex flex-col rounded-2xl border p-7 transition ${
                  featured
                    ? "border-brand-600 bg-white shadow-soft md:-mt-4 md:mb-0"
                    : "border-ink/10 bg-white"
                }`}
              >
                <p className="text-[14px] font-medium tracking-[-0.005em] text-brand-700">
                  {c.audience}
                </p>
                <p className="mt-6 text-3xl font-medium tracking-tight text-ink md:text-4xl">
                  Custom pricing
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {c.blurb}
                </p>
                {/* TODO: pricing CTA destinations */}
                <a
                  href="#book-a-demo"
                  className={`mt-8 self-start ${
                    featured ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {c.cta}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
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
            );
          })}
        </div>

        <p className="mt-10 max-w-3xl text-sm text-ink-muted">
          All plans include full HIPAA compliance, crisis escalation protocol,
          cultural tailoring, and persistent session memory. Nothing is an
          add-on.
        </p>

        <a
          href="#pricing-details"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition hover:text-brand-700"
        >
          See full pricing breakdown
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
