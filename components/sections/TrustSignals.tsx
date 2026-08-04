import { AETNA_QUOTE, NamedQuote } from "@/components/NamedQuote";

const STATS = [
  {
    value: "400+",
    label: "Peer-reviewed clinical studies validating our methodology",
  },
  {
    value: "50–70%",
    label: "Reduction in live-coaching cost for health plans",
  },
  {
    value: "40%",
    label: "Additional employees engaged in care (Aetna)",
  },
];

export function TrustSignals() {
  return (
    <section
      id="section-credibility-bar"
      className="section bg-brand-50"
    >
      <div className="container-page">
        <p className="eyebrow text-center">Trusted in healthcare</p>

        <div className="mx-auto mt-8 max-w-3xl">
          <NamedQuote
            quote={AETNA_QUOTE.quote}
            attribution={AETNA_QUOTE.attribution}
            variant="anchor"
          />
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12">
          {STATS.map((stat) => (
            <div key={stat.value}>
              <p className="text-4xl font-medium tracking-tight text-ink md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
