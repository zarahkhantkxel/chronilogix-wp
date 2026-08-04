export function FinalCTA() {
  return (
    <section
      id="book-a-demo"
      className="relative overflow-hidden rounded-[28px] bg-ink text-white"
    >
      <Glow />

      <div className="container-page relative py-24 md:py-32 lg:py-40">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <h2 className="max-w-xl text-2xl font-serif font-normal leading-snug text-white md:text-3xl">
              <span className="text-white">Book a 30-minute demo.</span>{" "}
              <span className="text-white/65">
                We’ll show you Chronilogix in a live session, walk through the
                clinical methodology, and model the impact for your specific
                population.
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            {/* TODO: Calendly URL */}
            <a href="#book-a-demo" className="btn-primary">
              Book a Demo
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Glow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-32 -right-20 h-[420px] w-[420px] rounded-full bg-brand-600/35 blur-3xl" />
      <div className="absolute top-1/3 -left-32 h-[360px] w-[360px] rounded-full bg-brand-700/25 blur-3xl" />
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
