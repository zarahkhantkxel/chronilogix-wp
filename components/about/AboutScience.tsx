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
      //
      // scroll-mt-28 (7rem / 112px) because this section is an anchor target
      // for two links — AboutTeam's same-page "Read the science" and the home
      // page's "About Dr. Resnicow" deep link (/about#science) — and the top
      // nav is `fixed`. Its pinned row is h-20 / md:h-24 (80 / 96px), so 112px
      // lands this card's rounded top edge just clear of the nav instead of
      // tucked underneath it. Same value the legal pages use for their
      // anchored sections (components/legal/LegalDocument.tsx).
      //
      // Bottom padding is symmetric with the top again (was md:pb-28
      // lg:pb-32) now that the recent-writing rail below the grid is
      // commented out. The reduced pb existed to offset the rail's own
      // vertical bulk — with the rail gone it left the deployments list
      // sitting too close to the card's bottom edge, and the section read
      // top-heavy. py-24/32/40 is also what the sibling cards on this page
      // use (AboutPurpose, AboutClosingCTA). Restore md:pb-28 lg:pb-32 if
      // the rail comes back.
      className="relative scroll-mt-28 rounded-[28px] bg-paper-warm pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40"
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

        {/* Recent-writing rail — label AND card carousel — hidden for now.
            Restore by un-commenting the two blocks below; BLOG_CARDS,
            BlogScrollRail and BlogCardTile are all left intact below. The
            label goes with the cards deliberately: an eyebrow reading
            "Recent writing" over nothing is worse than no eyebrow. */}

        {/* Blog rail LABEL — sits close to the credentials block above
            (no oversized gap) and directly above the cards below. */}
        {/*
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
        */}

        {/* Blog rail CARDS — normal flow inside the section so the
            bottom of the section is a balanced editorial block instead
            of a straddling floating rail. */}
        {/*
        <div className="mt-6 md:mt-8">
          <BlogScrollRail reveal={reveal} cards={blogCards} />
        </div>
        */}
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
      {/* Elevation: these cards keep a shadow (they are real white surfaces
          on the warm-paper ground, with their own border and radius — not
          flat list rows), but the previous value was wrong in two ways.

          1. Mismatched light color. It stacked a cool-neutral contact layer
             `rgba(15,20,25,0.04)` under a near-black red-brown ambient
             `rgba(20,8,2,0.16)`. Two different-colored lights in one stack,
             and neither matched the warm `rgba(40,25,15,...)` tint that every
             other paper surface on this page uses (DrPortrait below, the
             AboutTeam portraits and pill). Against bg-paper-warm plus the
             brand-orange radial wash, that cold-then-black mix grimed the
             card edge instead of warming under it.

          2. Wrong tier for the element's size. `0 18px 40px -18px` is the
             large-element tier — a barely-shrunk copy of DrPortrait's
             `0 22px 56px -24px`, which belongs to a full-column 4:5
             portrait, not a 300px text card. The offset/spread ratio was the
             real culprit: a 40px blur pulled back only 18px leaves ~22px
             bleeding past the card on every side, so the card read as a
             detached slab hovering over a dark halo rather than paper
             lifting slightly off the page.

          The new resting value is the established mid tier from this same
          page (AboutTeam's portrait frames): a 30px blur pulled back 20px
          leaves only ~10px of visible bleed, which keeps the shadow tucked
          under the card's own bottom edge. Same warm tint on both layers, so
          the light finally comes from one place. Hover nudges one step up
          (18/38) while holding the same -20px pullback — the card rises
          without the footprint spreading back out into slab territory. */}
      <a
        href={card.href}
        className="group/blog flex h-full w-[300px] flex-col justify-between rounded-[20px] border border-ink/[0.06] bg-white p-7 shadow-[0_1px_2px_rgba(40,25,15,0.05),0_14px_30px_-20px_rgba(40,25,15,0.22)] transition-shadow duration-300 hover:border-brand-600/25 hover:shadow-[0_1px_2px_rgba(40,25,15,0.06),0_18px_38px_-20px_rgba(40,25,15,0.26)] md:w-[360px] md:p-8"
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
        /* The source is a 1365x768 video still, so this 4/5 frame shows only
           614px of its width and pans across 751px of slack. At the previous
           30% the window opened at x=225 while his head starts around x=205,
           which clipped his hairline against the left edge. 16% opens at
           x=120, clearing the whole head with margin, and stops short of the
           dark chair that creeps in below ~12%. Height fills exactly at this
           ratio, so the vertical value is currently inert. */
        style={{ objectPosition: "16% 22%" }}
      />
    </div>
  );
}
