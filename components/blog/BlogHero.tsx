export function BlogHero() {
  return (
    <section className="pt-32 md:pt-40">
      <div className="container-page">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <span className="eyebrow">Blog</span>
          <h1 className="text-display font-medium tracking-[-0.022em] text-ink">
            In Practice
          </h1>
          <p className="body-prose max-w-xl text-balance text-ink-muted">
            Where behavioral science meets clinical grade AI. Research,
            product notes, and field reports from the Chronilogix team.
          </p>
        </div>
      </div>
    </section>
  );
}
