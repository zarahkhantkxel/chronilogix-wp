"use client";

import { useEffect, useRef, useState } from "react";
import type { LegalBlock, LegalSection } from "./legal-content";

/**
 * Legal document body — renders /privacy and /terms from their section
 * lists.
 *
 * Follows the conventions a reader (and a reviewing lawyer) expects of
 * this page type:
 *
 *  - The document's own numbering, never a render-time index. Privacy is
 *    I–XII, Terms is 1–17 with 2.1-style subsections, and every one of
 *    them is an anchor — so `/terms-and-conditions#s-10-3` lands on the arbitration
 *    clause, which is how these get cited.
 *  - A sticky table of contents on desktop, tracking the section in view.
 *  - Clauses that must be *conspicuous* to be enforceable (arbitration,
 *    warranty disclaimer, liability cap) set off in their own bordered
 *    block rather than shouted in all-caps. Bold + set-off satisfies the
 *    conspicuousness expectation and stays readable; a wall of capitals
 *    does the opposite of making someone read it.
 *  - Defined terms as a real description list, so "AI Output" and the
 *    rest are scannable.
 *  - A print stylesheet (see `globals.css`) — legal pages get printed
 *    and attached to contracts.
 *
 * Callouts use a full ring plus a tinted surface; the left-only side
 * border pattern is banned across the site.
 */
export function LegalDocument({
  sections,
  contactEmail,
  preamble,
}: {
  sections: LegalSection[];
  contactEmail: string;
  preamble?: { tone: "warn" | "affirm"; text: string };
}) {
  const activeId = useActiveSection(sections);
  const navRef = useRef<HTMLElement>(null);
  useActiveRowInView(navRef, activeId);

  return (
    /* No `overflow-hidden` here, unlike the other section cards on the
       site: an ancestor with a non-visible overflow makes the contents
       rail's `position: sticky` resolve against a box that never
       scrolls, so the rail silently stops sticking. Nothing inside this
       section is absolutely positioned, so there is nothing for the
       rounded corners to clip anyway. */
    <section className="legal-doc relative rounded-[20px] bg-paper py-14 sm:rounded-[24px] sm:py-20 md:rounded-[28px] md:py-28">
      <div className="container-page">
        {/* Narrower rail and tighter gutter than the marketing sections
            use, so the clause text gets the width instead of the
            navigation. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          {/* ── Contents ────────────────────────────────────────────
              Sticky on desktop so a long policy stays navigable. The
              numeral column carries the document's own label, so the
              rail reads as the contract's structure, not a list.
              `max-h` + scroll keeps a 17-section document from running
              past the viewport on a laptop. */}
          <nav
            ref={navRef}
            aria-label="On this page"
            className="legal-toc lg:sticky lg:top-28 lg:max-h-[calc(100svh-9rem)] lg:self-start lg:overflow-y-auto"
          >
            <p className="eyebrow-muted">On this page</p>
            <ol className="mt-4 space-y-1 border-t border-ink/[0.07] pt-4">
              {sections.map((section) => {
                const isActive = section.id === activeId;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      /* `location` rather than `true`: this marks position
                         within a structural map of the page, which is
                         exactly what the token means. */
                      aria-current={isActive ? "location" : undefined}
                      /* Type only — no fill, no border. The active row
                         carries weight plus full-ink colour while the
                         rest recede to muted, so the mark reads as
                         emphasis in the text itself rather than as a
                         selected object.

                         Inactive stays at `ink-muted` rather than going
                         lighter still: these are real navigation links,
                         and `ink-subtle` on white lands near 3:1, which
                         fails AA for 14px text. The separation comes
                         from lifting the active row instead of sinking
                         the others past legibility. */
                      className={`flex gap-3 rounded-md py-1.5 text-[14px] leading-snug transition-colors duration-200 ease-out-quart motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 focus-visible:ring-offset-2 ${
                        isActive
                          ? "font-medium text-ink"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      <span
                        aria-hidden
                        /* `w-7` clears the widest numeral in either
                           document — Privacy's `VIII` overruns `w-5`.
                           Decorative (the heading carries the accessible
                           name), so the dimmer inactive tone here is not
                           held to the same contrast floor as the label. */
                        className={`w-7 shrink-0 tabular-nums ${
                          isActive ? "text-brand-700" : "text-ink-subtle"
                        }`}
                      >
                        {section.label ?? ""}
                      </span>
                      <span>{section.heading}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* ── Prose ───────────────────────────────────────────────
              `scroll-mt` on each section keeps an anchored heading clear
              of the fixed nav when jumped to from the contents. */}
          {/* Wider than the 68ch used for editorial long-form. A policy
              is reference material that gets scanned and cited rather
              than read start to finish, and it sits next to a contents
              rail, so the measure can run longer than an article's
              without costing the reader. Still capped — the column would
              otherwise reach ~110ch on a wide display. */}
          <div className="legal-prose mt-14 max-w-[88ch] lg:mt-0">
            {preamble && (
              <Notice tone={preamble.tone} text={preamble.text} lead />
            )}

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-t border-ink/[0.07] pt-10 first:border-t-0 first:pt-0 md:pt-14"
              >
                <div className="flex items-baseline gap-4">
                  {section.label && (
                    <span
                      aria-hidden
                      className="shrink-0 font-serif text-lg tabular-nums text-brand-700"
                    >
                      {section.label}
                    </span>
                  )}
                  <h2
                    className="text-row font-serif font-normal text-ink"
                    style={{ textWrap: "balance" } as React.CSSProperties}
                  >
                    {section.heading}
                  </h2>
                </div>

                <div className="mt-5 md:mt-6">
                  <Blocks
                    blocks={section.blocks}
                    sectionLabel={section.label}
                  />

                  {/* The contact sections carry a live mailto in addition
                      to the printed address block. */}
                  {section.id === "contact" && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="mt-6 inline-flex items-center gap-2 text-base font-medium text-ink underline decoration-brand-500/40 decoration-1 underline-offset-[4px] transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-brand-700 hover:decoration-brand-600 md:text-lg"
                    >
                      {contactEmail}
                    </a>
                  )}
                </div>
              </section>
            ))}

            {/* Long documents need a way back without a scroll marathon.
                Anchors to the hero rather than `#`, which some browsers
                treat as a no-op. */}
            <p className="legal-top mt-14 border-t border-ink/[0.07] pt-8">
              <a
                href="#legal-hero"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M6 9.5V3m0 0L3.5 5.5M6 3l2.5 2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to top
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Block renderer ──────────────────────────────────────────────────
   Recursive so a `sub` can hold any block type, including a nested
   list. `sectionLabel` is threaded through to namespace subsection
   anchors — Privacy restarts its lettering at A in every section, so an
   unqualified `#s-a` would resolve to three different clauses. */
function Blocks({
  blocks,
  sectionLabel,
}: {
  blocks: LegalBlock[];
  sectionLabel?: string;
}) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "para":
            return (
              <p key={i} className="body-prose mt-6 first:mt-0">
                <Rich text={block.text} />
              </p>
            );

          case "list":
            return <List key={i} items={block.items} ordered={block.ordered} />;

          case "notice":
            return <Notice key={i} tone={block.tone} text={block.text} />;

          case "defs":
            return (
              <dl key={i} className="mt-8 space-y-6">
                {block.items.map((def, j) => (
                  <div
                    key={j}
                    className="rounded-xl border border-ink/[0.07] bg-paper-warm/60 p-5 md:p-6"
                  >
                    <dt className="text-[15px] font-medium tracking-[-0.005em] text-ink md:text-base">
                      &ldquo;{def.term}&rdquo;
                    </dt>
                    <dd className="mt-2 body-quiet">
                      <Rich text={def.text} />
                    </dd>
                  </div>
                ))}
              </dl>
            );

          case "sub": {
            /* Terms already numbers decimally, so `10.3` → `s-10-3` is
               unique on its own. Privacy's letters are only unique
               within their section, so they get the section numeral in
               front: `A` under III → `s-iii-a`. Both stay readable as a
               citation, which is the point of the anchor. */
            const qualified =
              sectionLabel && !block.label.startsWith(`${sectionLabel}.`)
                ? `${sectionLabel}-${block.label}`
                : block.label;
            const subId = `s-${qualified.toLowerCase().replace(/\./g, "-")}`;
            return (
              <div
                key={i}
                id={subId}
                className="mt-10 scroll-mt-28 first:mt-8 md:mt-12"
              >
                <h3 className="flex items-baseline gap-3 text-card font-medium text-ink">
                  <span aria-hidden className="shrink-0 tabular-nums text-brand-700">
                    {block.label}
                  </span>
                  <span>{block.heading}</span>
                </h3>
                <div className="mt-4">
                  <Blocks
                    blocks={block.blocks}
                    sectionLabel={sectionLabel}
                  />
                </div>
              </div>
            );
          }

          case "address":
            return (
              <address
                key={i}
                className="mt-6 not-italic body-prose"
              >
                <span className="font-medium text-ink">{block.org}</span>
                {block.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            );
        }
      })}
    </>
  );
}

function List({
  items,
  ordered,
}: {
  items: (string | { text: string; items: string[] })[];
  ordered?: boolean;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="mt-6 space-y-4">
      {items.map((item, i) => {
        const text = typeof item === "string" ? item : item.text;
        const nested = typeof item === "string" ? undefined : item.items;
        return (
          <li key={i} className="flex gap-4 body-prose">
            {ordered ? (
              <span
                aria-hidden
                className="mt-[0.1em] shrink-0 font-serif text-lg tabular-nums text-brand-700"
              >
                {i + 1}.
              </span>
            ) : (
              <span
                aria-hidden
                className="mt-[0.7em] inline-block h-2 w-2 shrink-0 rounded-full bg-brand"
              />
            )}
            <span>
              <Rich text={text} />
              {nested && (
                <ul className="mt-3 space-y-2.5">
                  {nested.map((sub, j) => (
                    <li key={j} className="flex gap-3">
                      {/* Hollow dot at the second level so nesting depth
                          is legible without a second color. */}
                      <span
                        aria-hidden
                        className="mt-[0.62em] inline-block h-1.5 w-1.5 shrink-0 rounded-full ring-1 ring-brand/70"
                      />
                      <span>
                        <Rich text={sub} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </span>
          </li>
        );
      })}
    </Tag>
  );
}

/**
 * A set-off legal notice.
 *
 * `warn` is the treatment for clauses whose enforceability depends on
 * being noticed — the arbitration agreement, the warranty disclaimer,
 * the liability cap. `affirm` is for commitments running in the
 * reader's favour, so a promise and a limitation never look alike.
 * `lead` is the document-opening variant, which gets more weight.
 */
function Notice({
  tone,
  text,
  lead,
}: {
  tone: "warn" | "affirm";
  text: string;
  lead?: boolean;
}) {
  const isWarn = tone === "warn";
  return (
    <div
      role="note"
      className={`legal-notice rounded-2xl p-6 md:p-7 ${
        lead ? "mb-12 md:mb-14" : "mt-8"
      } ${
        /* Warm neutral, not a cool grey — the page ground is cream, and a
           slate-tinted box reads as foreign here. Bracket opacity because
           bare `/12` silently falls through to Tailwind's default ring
           colour (blue-500), which is how this shipped blue once. */
        isWarn
          ? "bg-paper-warm ring-1 ring-ink/[0.12]"
          : "bg-brand-50 ring-1 ring-brand-200/60"
      }`}
    >
      <p
        className={
          isWarn
            ? `font-medium leading-relaxed tracking-[-0.005em] text-ink ${
                lead ? "text-base md:text-lg" : "text-[15px] md:text-base"
              }`
            : "font-serif text-xl font-normal leading-snug tracking-tight text-ink md:text-2xl"
        }
      >
        <Rich text={text} />
      </p>
    </div>
  );
}

/**
 * Inline marks for the content strings: `**bold**` and `[label](href)`.
 *
 * Deliberately tiny — the alternative was authoring 60+ clauses as JSX,
 * which makes the copy unreadable in the file and hard for a
 * non-engineer to review. Anything richer than these two marks belongs
 * in a block type instead.
 */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }

        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          const [, label, href] = link;
          const isExternal = href.startsWith("http");
          return (
            <a
              key={i}
              href={href}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="underline decoration-brand-500/40 decoration-1 underline-offset-[3px] transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-brand-700 hover:decoration-brand-600"
            >
              {label}
            </a>
          );
        }

        return part;
      })}
    </>
  );
}

/**
 * Tracks which section is currently in view so the contents can mark it.
 *
 * This was an IntersectionObserver over a thin band below the nav, and it
 * did not work: the `entries` handed to the callback only cover targets
 * whose intersection *changed*, so they are not a reliable picture of
 * what is on screen, and picking the topmost intersecting target meant
 * that whenever two sections straddled the band the one being scrolled
 * *away from* won. On a document whose sections run to a couple of
 * thousand pixels each, the mark sat on section I for the entire page.
 *
 * A direct scroll calculation is both simpler and correct here: walk the
 * sections in document order and take the last one whose top has passed
 * the read line. rAF-throttled, so a scroll costs one pass over ~18
 * `getBoundingClientRect` calls per frame at most.
 */
function useActiveSection(sections: LegalSection[]) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    /* The read line — just below the fixed nav, so a section counts as
       current once its heading reaches the top of the reading area. */
    const READ_LINE = 140;
    let raf = 0;

    const compute = () => {
      raf = 0;
      let current = sections[0]?.id ?? "";

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        /* Sections are rendered in document order, so the first one that
           has not yet reached the read line ends the search. */
        if (el.getBoundingClientRect().top > READ_LINE) break;
        current = section.id;
      }

      /* A short final section may never push its top above the read line
         before the page bottoms out, which would leave the mark stuck on
         the second-to-last entry while the reader looks at the last one. */
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1]?.id ?? current;

      setActiveId(current);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections]);

  return activeId;
}

/**
 * Keeps the marked row inside the rail's own scroll box.
 *
 * On a short viewport the rail hits its `max-h` and scrolls internally,
 * so with 18 entries the active row can sit outside it — an indicator
 * the reader cannot see is worse than none. Nudges the rail's own
 * `scrollTop` rather than calling `scrollIntoView`, which would also
 * scroll the page and fight the reader.
 */
function useActiveRowInView(
  ref: React.RefObject<HTMLElement | null>,
  activeId: string
) {
  useEffect(() => {
    const nav = ref.current;
    if (!nav || !activeId) return;
    if (nav.scrollHeight <= nav.clientHeight) return;

    const row = nav.querySelector<HTMLElement>(`a[href="#${activeId}"]`);
    if (!row) return;

    const navBox = nav.getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();
    const pad = 8;

    if (rowBox.top < navBox.top + pad) {
      nav.scrollTop -= navBox.top + pad - rowBox.top;
    } else if (rowBox.bottom > navBox.bottom - pad) {
      nav.scrollTop += rowBox.bottom - (navBox.bottom - pad);
    }
  }, [ref, activeId]);
}
