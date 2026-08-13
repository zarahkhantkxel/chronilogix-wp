"use client";

/**
 * Closing block for /privacy and /terms.
 *
 * Deliberately not the dark Book-a-Demo slab the marketing pages end
 * on — a legal document closing with a sales pitch reads badly. Instead:
 * a quiet warm card pointing at the companion document and at a human,
 * so a visitor who landed here from the footer has somewhere to go next.
 */
export function LegalCrossLink({
  companionHref,
  companionLabel,
  companionBlurb,
  contactEmail,
}: {
  companionHref: string;
  companionLabel: string;
  companionBlurb: string;
  contactEmail: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[20px] bg-paper-warm py-14 sm:rounded-[24px] sm:py-16 md:rounded-[28px] md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 90% at 0% 100%, rgba(249,144,77,0.14) 0%, rgba(249,144,77,0.04) 40%, transparent 70%)",
        }}
      />

      <div className="container-page relative">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <a
            href={companionHref}
            className="group/doc flex flex-col justify-between rounded-2xl border border-ink/[0.07] bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 ease-out motion-reduce:transition-none hover:border-brand-300 hover:shadow-[0_12px_32px_-20px_rgba(20,8,2,0.28)] md:p-8"
          >
            <div>
              <p className="eyebrow-muted">The companion document</p>
              <h2 className="mt-3 text-card font-medium text-ink">
                {companionLabel}
              </h2>
              <p className="mt-3 body-quiet">{companionBlurb}</p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors duration-200 ease-out-quart motion-reduce:transition-none group-hover/doc:text-brand-700">
              Read it
              <Arrow />
            </span>
          </a>

          <div className="flex flex-col justify-between rounded-2xl border border-ink/[0.07] bg-white/80 p-6 backdrop-blur-sm md:p-8">
            <div>
              <p className="eyebrow-muted">Something unclear</p>
              <h2 className="mt-3 text-card font-medium text-ink">
                Talk to a person about it
              </h2>
              <p className="mt-3 body-quiet">
                Privacy, security, and contracting questions get answered
                directly &mdash; not routed through a form.
              </p>
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="group/mail mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-ink transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-brand-700"
            >
              {contactEmail}
              <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/doc:translate-x-1 group-hover/mail:translate-x-1"
    >
      <path
        d="M3 6h6m0 0L6.5 3.5M9 6 6.5 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
