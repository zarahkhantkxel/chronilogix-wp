type Variant = "anchor" | "card";

export function NamedQuote({
  quote,
  attribution,
  variant = "card",
}: {
  quote: string;
  attribution: string;
  variant?: Variant;
}) {
  if (variant === "anchor") {
    return (
      <figure className="text-center">
        <blockquote className="font-serif font-medium tracking-tight text-ink text-section">
          <span className="text-brand-600">“</span>
          {quote}
          <span className="text-brand-600">”</span>
        </blockquote>
        <figcaption className="mt-6 text-sm uppercase tracking-[0.18em] text-ink-muted">
          {attribution}
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="rounded-2xl border border-ink/10 bg-white p-8 shadow-soft md:p-10">
      <blockquote className="text-xl font-medium leading-snug text-ink md:text-2xl">
        <span className="text-brand-600">“</span>
        {quote}
        <span className="text-brand-600">”</span>
      </blockquote>
      <figcaption className="mt-5 text-sm uppercase tracking-[0.16em] text-ink-muted">
        {attribution}
      </figcaption>
    </figure>
  );
}

export const AETNA_QUOTE = {
  quote:
    "We identified and engaged an additional 40% of employees not receiving care.",
  attribution: "Aetna",
};
