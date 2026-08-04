"use client";

export function BlogNewsletter() {
  return (
    <section className="pb-16 md:pb-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 px-8 py-12 md:px-14 md:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-white/10 blur-3xl md:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full border border-white/15 md:h-96 md:w-96"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full border border-white/15 md:h-72 md:w-72"
          />

          <div className="relative grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
            <div className="max-w-xl">
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
                In Practice
              </div>
              <h2 className="mt-3 text-section font-medium text-white">
                Get our quarterly briefing on behavioral health, chronic care, and clinical grade AI.
              </h2>
              <p className="mt-3 text-sm text-white/85 md:text-base">
                New research, field notes, and product updates from Chronilogix, straight to your inbox.
              </p>
            </div>

            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-[0_8px_30px_-12px_rgba(15,20,25,0.45)]">
                <label htmlFor="blog-newsletter-email" className="sr-only">
                  Work email
                </label>
                <input
                  id="blog-newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your work email"
                  className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 ease-out-quart hover:bg-brand-accent motion-reduce:transition-none"
                >
                  Subscribe
                </button>
              </div>
              <div className="text-xs text-white/75">Unsubscribe anytime.</div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
