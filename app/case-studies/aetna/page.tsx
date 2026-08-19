import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { getPageAcf } from "@/lib/acf";
import { DEMO_BOOKING_URL } from "@/site.config";

/**
 * Aetna case study — /case-studies/aetna
 *
 * Content is ACF-driven (WordPress page slug "case-study-aetna"); every field
 * falls back to the original copy so the page renders identically when a field
 * is empty or WordPress is down. Layout/structure/decorative glyphs unchanged.
 */

export const metadata: Metadata = {
  title: "Aetna Case Study · Chronilogix",
  description:
    "How Aetna transformed member engagement with Motivational Interviewing. A partnership with MI pioneer Dr. Kenneth Resnicow lifted engagement 53.1% → 76% and cut program dropouts by more than half — the same method that powers Chronilogix.",
};

type Content = ReturnType<typeof buildContent>;

const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);
function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

const DEFAULTS = {
  hero_eyebrow: "Case study",
  hero_logo: "/Aetna_Logo.svg",
  hero_logo_alt: "Aetna",
  hero_heading_lead: "How Aetna transformed member engagement",
  hero_heading_emph: "with Motivational Interviewing",
  hero_body:
    "A breakthrough partnership with MI pioneer Dr. Kenneth Resnicow reshaped how Aetna communicates with members — shifting from scripted calls to meaningful, human-centered conversations.",
  hero_primary_label: "Book a Demo",
  hero_primary_url: DEMO_BOOKING_URL,
  hero_secondary_label: "See the platform",
  hero_secondary_url: "/product",
  outcomes_label: "What changed, in numbers",
  outcomes_source:
    "Source: Aetna Care Management & Disease Management programs, post-MI integration.",
  challenge_eyebrow: "The challenge",
  challenge_heading: "Members were being talked at, not talked with.",
  challenge_body1:
    "Traditional disease-management programs across the industry were failing to truly engage members. Scripted, compliance-first coaching left people feeling unheard — and drove high dropout rates.",
  challenge_body2:
    "The care was well-intentioned. The delivery wasn’t landing. Aetna needed a way to make coaching feel like a real relationship, at the scale of an entire member population.",
  solution_eyebrow: "Aetna’s solution",
  solution_heading:
    "A partnership with the pioneer of Motivational Interviewing.",
  solution_body:
    "Aetna partnered with Dr. Kenneth Resnicow, a global leader in Motivational Interviewing, to train its care teams in a new approach built on empathy, autonomy, and real dialogue.",
  solution_quote:
    "A highly personalized member experience with real conversations, not scripted interactions.",
  solution_quote_attr: "Aetna Leadership",
  conv_member: "Honestly, I stopped taking my meds a few weeks ago.",
  conv_scripted_label: "Scripted",
  conv_scripted_text:
    "On a scale of 1 to 5, how would you rate your medication adherence this week?",
  conv_mi_label: "With MI",
  conv_mi_text:
    "That took honesty — thank you. What’s made taking them feel hard lately?",
  conv_bg: "/card-1-bg.jpg",
  bio_image: "/ken-thumbnail.webp",
  bio_role: "Chief Science Officer, Chronilogix",
  bio_name: "Dr. Kenneth Resnicow",
  bio_body:
    "One of the world’s leading experts in Motivational Interviewing, whose work spans healthcare, behavior change, chronic illness, and health equity. His partnership with Aetna helped operationalize MI at scale — and set a national precedent for member-centered coaching.",
  changed_eyebrow: "What changed",
  changed_heading: "MI rewired Aetna’s coaching model.",
  changed_body:
    "The same care teams, having the same calls — but with conversations built to do three things differently.",
  why_eyebrow: "Why MI works",
  why_heading_lead: "From telling people what to do",
  why_heading_emph: "to helping them discover why they want to.",
  why_body:
    "Motivational Interviewing shifts the focus of every conversation. That shift is what produced Aetna’s numbers — and it’s what makes behavior change last.",
  bridge_eyebrow: "The method, productized",
  bridge_heading_lead: "The method Aetna proved is the method",
  bridge_heading_emph: "inside Chronilogix.",
  bridge_body:
    "We’ve translated Dr. Resnicow’s thirty years of Motivational Interviewing research into the AI that powers every Chronilogix conversation — so every member gets the same evidence-based coaching, 24/7, at a fraction of the cost of live care.",
  bridge_primary_label: "Book a Demo",
  bridge_primary_url: DEMO_BOOKING_URL,
  bridge_secondary_label: "See How Chronilogix Works",
  bridge_secondary_url: "/product",
};

const DEFAULT_META = [
  { label: "Sector", value: "Health plan" },
  { label: "Method", value: "Motivational Interviewing" },
  { label: "Partner", value: "Dr. Kenneth Resnicow" },
];
const DEFAULT_OUTCOMES = [
  {
    figure: '53.1% <span class="text-brand-500">→</span> 76%',
    label: "Member engagement",
    note: "Enrollment climbed after care teams retrained in MI",
  },
  { figure: "+43%", label: "Relative lift in engagement", note: "The largest engagement gain in the program's history" },
  { figure: "−55%", label: "Program dropouts", note: "Drop-offs cut by more than half" },
];
const DEFAULT_SHIFTS = [
  { title: "Strengthen intrinsic motivation", body: "Conversations surface the member's own reasons for change instead of prescribing them." },
  { title: "Increase readiness for change", body: "Coaching meets people where they are, moving them forward at a pace they own." },
  { title: "Build trust through collaboration", body: "Guidance replaces persuasion, so members stay in the driver's seat of their care." },
];
const DEFAULT_DOWNSTREAM = [
  "Better adherence to care plans",
  "Improved productivity for plan sponsors",
  "Fewer disability claims",
];
const DEFAULT_CREATES = [
  "Higher participation",
  "More consistent behavior change",
  "Stronger long-term health outcomes",
];

function buildContent(s: Record<string, any>) {
  return {
    ...DEFAULTS,
    ...clean(s as any),
    meta: arr(s.hero_meta).length
      ? arr(s.hero_meta).map((r) => ({ label: r.label, value: r.value }))
      : DEFAULT_META,
    outcomes: arr(s.outcomes_items).length
      ? arr(s.outcomes_items).map((r) => ({ figure: r.figure, label: r.label, note: r.note }))
      : DEFAULT_OUTCOMES,
    shifts: arr(s.changed_shifts).length
      ? arr(s.changed_shifts).map((r) => ({ title: r.title, body: r.body }))
      : DEFAULT_SHIFTS,
    downstream: arr(s.changed_downstream).length
      ? arr(s.changed_downstream).map((r) => r.text)
      : DEFAULT_DOWNSTREAM,
    creates: arr(s.why_creates).length
      ? arr(s.why_creates).map((r) => r.text)
      : DEFAULT_CREATES,
  };
}

export default async function AetnaCaseStudyPage() {
  const acf = (await getPageAcf<Record<string, unknown>>("case-study-aetna")) ?? {};
  const c = buildContent(acf as Record<string, any>);

  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <Hero c={c} />
          <OutcomesBand c={c} />
          <Challenge c={c} />
          <Solution c={c} />
          <WhatChanged c={c} />
          <WhyItWorks c={c} />
          <BridgeToChronilogix c={c} />
        </div>
      </main>
      <Footer />

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 1 · Hero — warm gradient card, matching the /solutions/* hero surface. */
/* ------------------------------------------------------------------ */

function Hero({ c }: { c: Content }) {
  return (
    <section
      aria-labelledby="aetna-hero-label"
      className="relative overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(120deg, #FFF3E8 0%, #FBF5EE 42%, #F4EEE4 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 12% 8%, rgba(249,144,77,0.22), transparent 70%), radial-gradient(45% 40% at 92% 90%, rgba(228,90,28,0.14), transparent 72%)",
        }}
      />

      <div className="container-page relative pt-32 pb-20 md:pt-40 md:pb-24 lg:pt-48 lg:pb-28">
        <div className="mx-auto max-w-[54rem] text-center">
          <p className="eyebrow">{c.hero_eyebrow}</p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.hero_logo}
            alt={c.hero_logo_alt}
            className="mx-auto mt-6 h-9 w-auto md:h-10"
            draggable={false}
          loading="lazy"
          decoding="async"
        />

          <h1
            id="aetna-hero-label"
            className="mt-7 font-serif font-normal text-display"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.hero_heading_lead}{" "}
            <span className="text-brand-700">{c.hero_heading_emph}</span>
          </h1>

          <p className="mx-auto mt-7 max-w-[58ch] body-prose md:mt-8">
            {c.hero_body}
          </p>

          {/* Meta chips — sector / method / partner. */}
          <dl className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-3">
            {c.meta.map((m) => (
              <div
                key={m.label}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm backdrop-blur-sm"
              >
                <dt className="font-medium text-ink-muted">{m.label}</dt>
                <span aria-hidden className="h-3 w-px bg-ink/15" />
                <dd className="font-medium text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <a href={c.hero_primary_url} target="_blank" rel="noopener noreferrer" className="group/cta btn-primary">
              {c.hero_primary_label}
              <Arrow />
            </a>
            <a href={c.hero_secondary_url} className="btn-secondary">
              {c.hero_secondary_label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · Outcomes band — dark ink slab, the numeric punch of the story.  */
/* ------------------------------------------------------------------ */

function OutcomesBand({ c }: { c: Content }) {
  return (
    <section
      data-nav-tone="dark"
      aria-labelledby="aetna-outcomes-label"
      className="relative overflow-hidden rounded-[28px] bg-ink text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 0%, rgba(255,116,52,0.18), transparent 65%), radial-gradient(45% 40% at 100% 100%, rgba(249,144,77,0.10), transparent 70%)",
        }}
      />

      <div className="container-page relative py-20 md:py-28 lg:py-32">
        <p
          id="aetna-outcomes-label"
          className="text-center text-[14px] font-medium tracking-[-0.005em] text-white/70"
        >
          {c.outcomes_label}
        </p>

        <dl className="mt-12 grid gap-y-12 sm:grid-cols-3 sm:gap-x-8 md:mt-16">
          {c.outcomes.map((o, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center sm:px-6 ${
                i > 0 ? "sm:border-l sm:border-white/10" : ""
              }`}
            >
              <dt
                className="font-serif text-[52px] font-normal leading-none tracking-tight tabular-nums text-white md:text-[64px]"
                dangerouslySetInnerHTML={{ __html: o.figure }}
              />
              <dd className="mt-5 text-sm font-medium uppercase tracking-[0.14em] text-white/85">
                {o.label}
              </dd>
              <p className="mt-3 max-w-[26ch] text-[14px] leading-relaxed text-white/55">
                {o.note}
              </p>
            </div>
          ))}
        </dl>

        <p className="mt-14 text-center text-[13px] italic text-white/45 md:mt-16">
          {c.outcomes_source}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · The Challenge — two-column framing of the problem.              */
/* ------------------------------------------------------------------ */

function Challenge({ c }: { c: Content }) {
  return (
    <section
      aria-labelledby="aetna-challenge-label"
      className="rounded-[28px] bg-paper-warm"
    >
      <div className="container-page py-20 md:py-28 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-16">
          <div>
            <p className="eyebrow">{c.challenge_eyebrow}</p>
            <h2
              className="mt-4 text-section font-serif font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.challenge_heading}
            </h2>
          </div>
          <div>
            <p className="body-prose">{c.challenge_body1}</p>
            <p className="mt-5 body-prose">{c.challenge_body2}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · Aetna's Solution — the Resnicow partnership + leadership quote. */
/* ------------------------------------------------------------------ */

function Solution({ c }: { c: Content }) {
  return (
    <section
      aria-labelledby="aetna-solution-label"
      className="rounded-[28px] bg-white"
    >
      <div className="container-page py-20 md:py-28 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-center lg:gap-16">
          {/* Left — the partnership + the leadership quote. */}
          <div>
            <p className="eyebrow">{c.solution_eyebrow}</p>
            <h2
              id="aetna-solution-label"
              className="mt-4 text-section font-serif font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.solution_heading}
            </h2>
            <p className="mt-6 body-prose">{c.solution_body}</p>

            <figure className="mt-8 border-l-2 border-brand-500/50 pl-5 md:mt-9">
              <blockquote className="font-serif text-xl font-normal leading-snug tracking-tight text-ink md:text-2xl">
                <span className="text-brand-600">&ldquo;</span>
                {c.solution_quote}
                <span className="text-brand-600">&rdquo;</span>
              </blockquote>
              <figcaption className="mt-4 text-sm uppercase tracking-[0.16em] text-ink-muted">
                {c.solution_quote_attr}
              </figcaption>
            </figure>
          </div>

          {/* Right — illustrative frame: one member, two replies. */}
          <ConversationFrame c={c} />
        </div>

        {/* Dr. Resnicow bio — full-width card below the split. */}
        <div className="mx-auto mt-12 max-w-4xl md:mt-16">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-ink/[0.08] bg-paper-warm p-8 text-center shadow-soft sm:flex-row sm:items-center sm:gap-8 sm:text-left md:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.bio_image}
              alt={c.bio_name}
              className="h-24 w-24 shrink-0 rounded-full object-cover object-top ring-1 ring-ink/10"
              draggable={false}
          loading="lazy"
          decoding="async"
        />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-700">
                {c.bio_role}
              </p>
              <p className="mt-1.5 font-serif text-xl font-normal text-ink md:text-2xl">
                {c.bio_name}
              </p>
              <p className="mt-3 body-quiet">{c.bio_body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConversationFrame({ c }: { c: Content }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[24px] border border-ink/[0.08] bg-paper shadow-[0_10px_28px_-18px_rgba(20,8,2,0.18)] lg:max-w-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={c.conv_bg}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
          loading="lazy"
          decoding="async"
        />
      <div className="absolute inset-0 bg-paper/[0.72]" />

      <div className="relative flex h-full flex-col justify-center gap-3.5 p-7 md:p-10">
        {/* Member — the honest thing. */}
        <div className="surface-glass-inner relative max-w-[86%] self-end overflow-hidden rounded-[16px] rounded-br-[6px] px-4 py-3 text-[13.5px] leading-snug text-ink md:text-[14px]">
          {c.conv_member}
        </div>

        {/* Scripted reply — procedural, struck through: the old way. */}
        <div className="surface-glass-inner relative max-w-[92%] self-start overflow-hidden rounded-[16px] rounded-bl-[6px] px-4 py-3">
          <span className="mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-ink-muted">
            {c.conv_scripted_label}
          </span>
          <p className="text-[13.5px] leading-snug text-ink-muted line-through decoration-ink-muted/40 md:text-[14px]">
            {c.conv_scripted_text}
          </p>
        </div>

        {/* MI reply — the real conversation. Brand-anchored glass card. */}
        <div className="surface-glass relative max-w-[94%] self-start overflow-hidden rounded-[18px] rounded-bl-[6px] px-4 py-3">
          <span
            aria-hidden
            className="surface-glass-shine pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[18px]"
          />
          <div className="relative">
            <span className="mb-1.5 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-brand-700">
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #FB9C5E 0%, #E45A1C 100%)",
                }}
              />
              {c.conv_mi_label}
            </span>
            <p className="text-[13.5px] leading-snug text-ink md:text-[14px]">
              {c.conv_mi_text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Warm icon tiles (decorative — matched to shifts by index).          */
/* ------------------------------------------------------------------ */

type IconVariant = "peach" | "coral" | "ember";

const ICON_BG: Record<IconVariant, string> = {
  peach:
    "radial-gradient(ellipse 70% 85% at 50% 105%, rgba(184,70,20,0.45) 0%, rgba(184,70,20,0) 68%), linear-gradient(180deg, #FB9C5E 0%, #FF7434 100%)",
  coral:
    "radial-gradient(ellipse 65% 70% at 50% -8%, rgba(253,179,125,0.55) 0%, rgba(253,179,125,0) 60%), linear-gradient(180deg, #FF7434 0%, #E45A1C 100%)",
  ember:
    "radial-gradient(circle at 28% 32%, rgba(253,179,125,0.5) 0%, rgba(253,179,125,0) 55%), radial-gradient(circle at 74% 74%, rgba(120,40,10,0.42) 0%, rgba(120,40,10,0) 55%), linear-gradient(135deg, #FB9C5E 0%, #B84614 100%)",
};

function IconTile({
  children,
  variant = "peach",
}: {
  children: React.ReactNode;
  variant?: IconVariant;
}) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_12px_24px_-14px_rgba(184,70,20,0.42)]"
      style={{ backgroundImage: ICON_BG[variant] }}
    >
      {children}
    </span>
  );
}

const SparkGlyph = (
  <svg viewBox="0 0 20 20" className="h-6 w-6">
    <path
      fill="currentColor"
      d="M10 2.2l1.7 5.1a1 1 0 0 0 .64.64L17.8 9.7l-5.46 1.76a1 1 0 0 0-.64.64L9.94 17.8l-1.76-5.46a1 1 0 0 0-.64-.64L2.2 9.94l5.46-1.76a1 1 0 0 0 .64-.64L10 2.2z"
    />
  </svg>
);
const RiseGlyph = (
  <svg viewBox="0 0 20 20" className="h-6 w-6">
    <path
      fill="currentColor"
      d="M10 3.2l4.6 4.6a.9.9 0 0 1-1.27 1.27L11 6.94V16a1 1 0 1 1-2 0V6.94L6.67 9.07A.9.9 0 0 1 5.4 7.8L10 3.2z"
    />
  </svg>
);
const UnionGlyph = (
  <svg viewBox="0 0 20 20" className="h-6 w-6">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.5 4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm5 0a4.48 4.48 0 0 0-1.86.4 5.5 5.5 0 0 1 0 8.2A4.5 4.5 0 1 0 12.5 4.5z"
    />
  </svg>
);
const SHIFT_GLYPHS = [SparkGlyph, RiseGlyph, UnionGlyph];
const SHIFT_VARIANTS: IconVariant[] = ["peach", "coral", "ember"];

/* ------------------------------------------------------------------ */
/* 5 · What Changed — the three conversational shifts + downstream wins.*/
/* ------------------------------------------------------------------ */

function WhatChanged({ c }: { c: Content }) {
  return (
    <section
      aria-labelledby="aetna-changed-label"
      className="rounded-[28px] bg-paper-warm"
    >
      <div className="container-page py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{c.changed_eyebrow}</p>
          <h2
            id="aetna-changed-label"
            className="mt-4 text-section font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.changed_heading}
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] body-prose">
            {c.changed_body}
          </p>
        </div>

        <ol className="mt-14 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {c.shifts.map((s, i) => (
            <li
              key={s.title}
              className="flex flex-col rounded-2xl border border-ink/[0.08] bg-white p-8 shadow-soft"
            >
              <IconTile variant={SHIFT_VARIANTS[i % SHIFT_VARIANTS.length]}>
                {SHIFT_GLYPHS[i % SHIFT_GLYPHS.length]}
              </IconTile>
              <h3 className="mt-6 text-card font-serif font-normal text-ink">
                {s.title}
              </h3>
              <p className="mt-3 body-quiet">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* Downstream wins for the plan sponsor — a quiet row of proof. */}
        <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-3 md:mt-12">
          {c.downstream.map((d) => (
            <li
              key={d}
              className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink-soft"
            >
              <Check />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6 · Why MI Works — the principle behind the numbers.               */
/* ------------------------------------------------------------------ */

function WhyItWorks({ c }: { c: Content }) {
  return (
    <section
      aria-labelledby="aetna-why-label"
      className="rounded-[28px] bg-white"
    >
      <div className="container-page py-20 md:py-28 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow">{c.why_eyebrow}</p>
            <h2
              id="aetna-why-label"
              className="mt-4 text-section font-serif font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.why_heading_lead}{" "}
              <span className="text-ink-muted">{c.why_heading_emph}</span>
            </h2>
            <p className="mt-6 body-prose">{c.why_body}</p>
          </div>

          <ul className="flex flex-col gap-3">
            {c.creates.map((item) => (
              <li
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-ink/[0.08] bg-paper-warm px-6 py-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-700">
                  <Check />
                </span>
                <span className="text-lg font-medium text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7 · Bridge to Chronilogix — the resolution names the platform.      */
/* ------------------------------------------------------------------ */

function BridgeToChronilogix({ c }: { c: Content }) {
  return (
    <section
      id="book-a-demo"
      aria-labelledby="aetna-bridge-label"
      className="relative overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(120deg, #FFF3E8 0%, #FBF5EE 42%, #F4EEE4 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 45% at 88% 10%, rgba(249,144,77,0.20), transparent 70%), radial-gradient(45% 40% at 6% 96%, rgba(228,90,28,0.12), transparent 72%)",
        }}
      />

      <div className="container-page relative py-20 text-center md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">{c.bridge_eyebrow}</p>
          <h2
            id="aetna-bridge-label"
            className="mt-4 text-display font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.bridge_heading_lead}{" "}
            <span className="text-brand-700">{c.bridge_heading_emph}</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[58ch] body-prose">
            {c.bridge_body}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a href={c.bridge_primary_url} target="_blank" rel="noopener noreferrer" className="group/cta btn-primary">
              {c.bridge_primary_label}
              <Arrow />
            </a>
            <a href={c.bridge_secondary_url} className="btn-secondary">
              {c.bridge_secondary_label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shared inline glyphs.                                               */
/* ------------------------------------------------------------------ */

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/cta:translate-x-1"
    >
      <path
        d="M3 7h6m0 0L6 4m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="text-brand-600"
    >
      <path
        d="M2.5 7.5 5.5 10.5 11.5 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
