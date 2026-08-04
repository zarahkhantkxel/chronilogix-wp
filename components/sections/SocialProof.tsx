import { AETNA_QUOTE, NamedQuote } from "@/components/NamedQuote";

const CARDS = [
  {
    stat: "400+",
    label: "Clinical studies",
    body:
      "Motivational Interviewing is among the most rigorously studied behavioral interventions in clinical science — validated across chronic disease, mental health, addiction, and sustained behavior change.",
  },
  {
    stat: "Equivalent to live coaching",
    label: "Proven outcomes",
    body:
      "Independent peer-reviewed research shows AI-delivered Motivational Interviewing — built on validated clinical methodology — matches human outcomes for members who engage consistently.",
  },
  {
    stat: "50–70%",
    label: "Cost reduction",
    body:
      "Plans and employers that replace a portion of live coaching with Chronilogix report sustained cost reductions — with no measurable decline in outcomes or satisfaction.",
  },
];

export function SocialProof() {
  return (
    <section id="social-proof" className="section bg-paper-warm">
      <div className="container-page">
        <p className="eyebrow">Clinical evidence</p>
        <h2 className="mt-4 max-w-3xl text-section font-serif font-normal text-ink">
          Thirty years of research. Four hundred studies.
          <br className="hidden md:block" /> One named customer outcome.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CARDS.map((c) => (
            <div
              key={c.label}
              className="flex flex-col rounded-2xl border border-ink/10 bg-white p-7"
            >
              <p className="text-3xl font-medium tracking-tight text-ink md:text-4xl">
                {c.stat}
              </p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-600">
                {c.label}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {c.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <NamedQuote
            quote={AETNA_QUOTE.quote}
            attribution={AETNA_QUOTE.attribution}
            variant="card"
          />
        </div>
      </div>
    </section>
  );
}
