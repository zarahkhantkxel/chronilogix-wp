"use client";

import { useEffect, useRef, useState } from "react";

type Metric = {
  value: string;
  label: string;
  sub: string;
};

// Numbers are kept aligned with the home hero's stats pill (30+ years,
// 70+ clinical studies, 400+ peer-reviewed publications) so the about
// page never undercuts or contradicts the front door. 10,000+ clinicians
// extends that base — it doesn't replace it.
// Ordering: flagship payer, second national payer, academic anchor
// (Dr. Resnicow's home institution), regional payers. Puts the
// university at position 3 so a 3-per-row grid never orphans it.

// Recent writing / research — a horizontal-scroll rail whose vertical
// center sits on the section's bottom edge. Placeholder anchors follow
// the `#TODO-*` convention used elsewhere on the site — swap in real
// URLs when the blog goes live. Cards are text-only until real articles
// land; author byline carries the credibility signal.
type BlogCard = {
  title: string;
  byline: string;
  href: string;
};

export type AboutScienceContent = {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  prose?: React.ReactNode;
  aetnaQuote?: React.ReactNode;
  metrics?: Metric[];
  deployments?: string[];
  portraitImage?: string;
  portraitName?: string;
  portraitRole?: string;
  portraitInstitution1?: string;
  portraitInstitution2?: string;
  blogLabel?: string;
  blogAllLabel?: string;
  blogAllHref?: string;
  blogCards?: BlogCard[];
};

const DEFAULTS = {
  eyebrow: "Our foundation",
  headingLine1: "Thirty years of research.",
  headingLine2: "One breakthrough platform.",
  prose: (
    <>
      Most AI wellness products are built on good intentions and generic
      language models. Chronilogix is built on{" "}
      <span className="text-ink">
        three decades of peer reviewed clinical science in Motivational
        Interviewing
      </span>
      : the most rigorously validated behavioral change methodology in the
      world.
    </>
  ),
  aetnaQuote: (
    <>
      When{" "}
      <a
        href="/case-studies/aetna"
        className="underline decoration-brand-500/40 decoration-1 underline-offset-[3px] transition-colors hover:text-brand-700 hover:decoration-brand-600"
      >
        Aetna
      </a>{" "}
      integrated his MI framework into their disease management programs, member
      engagement rose by 40% and dropout rates fell by more than half.
    </>
  ),
  metrics: [
    { value: "400+", label: "Peer reviewed publications", sub: "On Motivational Interviewing" },
    { value: "70+", label: "Global clinical studies", sub: "Across diverse populations" },
    { value: "10,000+", label: "Clinicians trained", sub: "Worldwide, across health systems" },
  ],
  deployments: [
    "Aetna",
    "Kaiser Permanente",
    "University of Minnesota",
    "AmeriHealth",
    "Caritas",
    "Active Health",
  ],
  portraitImage: "/ken-thumbnail.png",
  portraitName: "Dr. Kenneth Resnicow",
  portraitRole: "Chief Science Officer",
  portraitInstitution1: "Professor,",
  portraitInstitution2: "University of Minnesota",
  blogLabel: "Recent writing",
  blogAllLabel: "All posts",
  blogAllHref: "/resources/blog",
  blogCards: [
    { title: "Motivational Interviewing, engineered for every member", byline: "Dr. Ken Resnicow", href: "#TODO-blog-mi-engineered" },
    { title: "Inside Roni AI: clinical-grade coaching at scale", byline: "Chronilogix Research", href: "#TODO-blog-roni-inside" },
    { title: "The MI fidelity rubric, in practice", byline: "Dr. Ken Resnicow", href: "#TODO-blog-fidelity-rubric" },
    { title: "What a complex reflection actually does", byline: "Chronilogix Research", href: "#TODO-blog-complex-reflection" },
    { title: "From 200+ RCTs to a coaching platform", byline: "Dr. Ken Resnicow", href: "#TODO-blog-rcts-to-platform" },
  ],
} satisfies Required<AboutScienceContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AboutScience({ content }: { content?: AboutScienceContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const metrics = content?.metrics?.length ? content.metrics : DEFAULTS.metrics;
  const deployments = content?.deployments?.length
    ? content.deployments
    : DEFAULTS.deployments;
  const blogCards = content?.blogCards?.length
    ? content.blogCards
    : DEFAULTS.blogCards;
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
  });

  return (
    <section
      id="science"
      ref={ref}
      // overflow-visible so the blog rail can straddle the bottom edge.
      // The bg-paper-warm ground + rounded-[28px] corners still clip
      // visually via border-radius on the background surface. The
      // radial wash gets its own overflow-hidden wrapper below so its
      // gradient stays inside the rounded shape.
      className="relative rounded-[28px] bg-paper-warm pt-24 pb-24 md:pt-32 md:pb-28 lg:pt-40 lg:pb-32"
    >
      {/* Brand-orange radial wash from the top-right — same idiom as the
          home page's Outcome section. Carries the "gravitational pull"
          this section needs without resorting to a dark slab. Nested
          in its own overflow-hidden rounded wrapper so it stays clipped
          to the section's rounded corners even though the section
          itself allows overflow (for the straddling blog rail). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 100% 0%, rgba(249,144,77,0.18) 0%, rgba(249,144,77,0.05) 38%, transparent 68%)",
          }}
        />
      </div>

      <div className="container-page relative">
        <div className="max-w-[52rem]">
          <p className="eyebrow" style={reveal(0)}>
            {c.eyebrow}
          </p>
          <h2
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={
              {
                textWrap: "balance",
                ...reveal(100),
              } as React.CSSProperties
            }
          >
            {c.headingLine1}
            <br />
            <span className="text-ink-muted">{c.headingLine2}</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-16 lg:items-stretch">
          {/* Portrait + name plaque */}
          <figure className="flex flex-col" style={reveal(180)}>
            <DrPortrait src={c.portraitImage} name={c.portraitName} />
            <figcaption className="mt-6 flex items-baseline justify-between gap-6 border-t border-ink/10 pt-5">
              <div>
                <p className="font-serif text-[22px] font-normal leading-tight tracking-[-0.012em] text-ink md:text-[24px]">
                  {c.portraitName}
                </p>
                <p className="mt-1.5 text-[13.5px] font-medium tracking-[-0.005em] text-brand-700">
                  {c.portraitRole}
                </p>
              </div>
              <p className="text-right font-serif text-[13px] italic text-ink-muted">
                {c.portraitInstitution1}<br />
                {c.portraitInstitution2}
              </p>
            </figcaption>
          </figure>

          {/* Credibility column — prose, metrics, deployments */}
          <div className="flex flex-col">
            <p
              className="body-prose"
              style={reveal(220)}
            >
              {c.prose}
            </p>
            <p
              className="mt-5 font-serif text-[18px] italic leading-[1.45] text-ink-soft md:text-[20px]"
              style={reveal(300)}
            >
              {c.aetnaQuote}
            </p>

            <dl
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-ink/10 pt-9 sm:grid-cols-3"
              style={reveal(380)}
            >
              {metrics.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <dt className="font-serif text-[32px] font-normal leading-none tracking-[-0.018em] text-ink md:text-[38px]">
                    {m.value}
                  </dt>
                  <dd className="mt-3">
                    <p className="text-[13.5px] font-medium leading-snug text-ink md:text-[14px]">
                      {m.label}
                    </p>
                    <p className="mt-1 font-serif text-[12.5px] italic text-ink-muted">
                      {m.sub}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>

            <div
              className="mt-10 border-t border-ink/10 pt-7"
              style={reveal(480)}
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-subtle">
                Deployed across
              </p>
              {/* 3-per-row grid at md+ so six deployments read as a
                  balanced 3×2 block (never 5+1 or 4+2). Columns hug
                  content width so shorter names don't get stranded in
                  wide cells. Mobile stays flex-wrap for organic flow. */}
              <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3 md:grid md:grid-cols-[auto_auto_auto] md:justify-start md:gap-x-10 md:gap-y-4">
                {deployments.map((d) => (
                  <li
                    key={d}
                    className="font-serif text-[18px] font-normal tracking-[-0.005em] text-ink md:text-[20px]"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Blog rail LABEL — sits close to the credentials block above
            (no oversized gap) and directly above the cards below. */}
        <div
          className="mt-12 flex items-baseline justify-between md:mt-14"
          style={reveal(520)}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-brand-700">
            {c.blogLabel}
          </p>
          <a
            href={c.blogAllHref}
            className="text-[13px] font-medium tracking-tight text-ink-muted transition-colors hover:text-brand-700"
          >
            {c.blogAllLabel} &rarr;
          </a>
        </div>

        {/* Blog rail CARDS — normal flow inside the section so the
            bottom of the section is a balanced editorial block instead
            of a straddling floating rail. */}
        <div className="mt-6 md:mt-8">
          <BlogScrollRail reveal={reveal} cards={blogCards} />
        </div>
      </div>
    </section>
  );
}

/**
 * Horizontal-scroll rail of recent writing / research cards. Snap
 * carousel with native-feeling scroll — no arrows, no dots, just a
 * quiet scrollbar hidden with the site's `hide-scrollbar` idiom.
 */
function BlogScrollRail({
  reveal,
  cards,
}: {
  reveal: (delay?: number) => React.CSSProperties;
  cards: BlogCard[];
}) {
  return (
    <div style={reveal(600)}>
      <ul
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:-mx-0 md:scroll-px-0 md:px-0 md:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => (
          <BlogCardTile key={card.href} card={card} index={i} />
        ))}
      </ul>
    </div>
  );
}

function BlogCardTile({ card, index }: { card: BlogCard; index: number }) {
  return (
    <li
      className="shrink-0 snap-start"
      style={{
        transitionDelay: `${index * 60}ms`,
      }}
    >
      <a
        href={card.href}
        className="group/blog flex h-full w-[300px] flex-col justify-between rounded-[20px] border border-ink/[0.06] bg-white p-7 shadow-[0_1px_2px_rgba(15,20,25,0.04),0_18px_40px_-18px_rgba(20,8,2,0.16)] transition-shadow duration-300 hover:border-brand-600/25 hover:shadow-[0_2px_4px_rgba(15,20,25,0.06),0_22px_50px_-18px_rgba(20,8,2,0.22)] md:w-[360px] md:p-8"
      >
        <h3 className="font-serif text-[20px] font-normal leading-[1.25] tracking-[-0.008em] text-ink md:text-[22px]">
          {card.title}
        </h3>
        <p className="mt-10 text-[13px] font-medium tracking-tight text-ink-muted md:mt-12 md:text-[13.5px]">
          {card.byline}
        </p>
      </a>
    </li>
  );
}

/**
 * Editorial portrait of Dr. Resnicow on the warm-paper register. 4:5 aspect
 * to match the leader band on AboutTeam. Object-position biases left+up so
 * the face stays in the visual centre of the crop (source is landscape).
 * Subtle drop shadow + cream backdrop keep the photo sitting on paper, not
 * floating as a stark rectangle.
 */
function DrPortrait({ src, name }: { src: string; name: string }) {
  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-ink/5"
      style={{
        boxShadow:
          "0 1px 2px rgba(40,25,15,0.06), 0 22px 56px -24px rgba(40,25,15,0.22)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Portrait of ${name}`}
        draggable={false}
        className="h-full w-full select-none object-cover"
        style={{ objectPosition: "30% 22%" }}
      />
    </div>
  );
}
