import type { ArticleBlock } from "./article-types";

// Renders an article body from its block list using the site's shared
// typographic vocabulary (body-prose, font-serif / text-row, eyebrow-scale
// labels, the homepage brand dot bullet). The measure is constrained to
// roughly 68ch on the prose so long-form reads comfortably.
//
// Note: callouts use a full ring + tinted surface, never a left-only side
// border (that pattern is banned across the site).

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="mx-auto max-w-[68ch]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "para":
            return (
              <p key={i} className="body-prose mt-6 first:mt-0">
                {block.text}
              </p>
            );

          case "heading":
            return (
              <h2
                key={i}
                className="mt-14 text-row font-serif font-normal text-ink first:mt-0"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                {block.text}
              </h2>
            );

          case "subheading":
            return (
              <h3
                key={i}
                className="mt-10 text-card font-medium text-ink first:mt-0"
              >
                {block.text}
              </h3>
            );

          case "list": {
            const items = block.items.map((item, j) => (
              <li key={j} className="flex gap-4 body-prose">
                {block.ordered ? (
                  <span
                    aria-hidden
                    className="mt-[0.1em] shrink-0 font-serif text-lg tabular-nums text-brand-700"
                  >
                    {j + 1}.
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="mt-[0.7em] inline-block h-2 w-2 shrink-0 rounded-full bg-brand"
                  />
                )}
                <span>{item}</span>
              </li>
            ));
            return block.ordered ? (
              <ol key={i} className="mt-6 space-y-4">
                {items}
              </ol>
            ) : (
              <ul key={i} className="mt-6 space-y-4">
                {items}
              </ul>
            );
          }

          case "callout":
            return (
              <div
                key={i}
                className="mt-10 rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-200/60 md:p-8"
              >
                <p className="font-serif text-xl font-normal leading-snug tracking-tight text-ink md:text-2xl">
                  {block.text}
                </p>
              </div>
            );

          case "stat":
            return (
              <div
                key={i}
                className="mt-10 rounded-2xl border border-ink/[0.08] bg-paper-warm p-8 text-center"
              >
                <div className="font-serif text-stat-md font-normal tabular-nums text-ink">
                  {block.value}
                </div>
                <div className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-ink-soft">
                  {block.label}
                </div>
                {block.source && (
                  <div className="mt-4 text-[13px] text-ink-muted">
                    Source &middot; {block.source}
                  </div>
                )}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
