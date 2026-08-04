"use client";

// Chapter rail — editorial stat-list used as the entry point into the
// DetailModal system. Each row anchors on the hero stat (40M, 70%, $300B),
// with a descriptive one-sentence line beside it. Hairlines separate
// rows; hovering fills the row with a soft brand wash and the arrow
// nudges right. No arrow chip at rest — the row itself does the
// affordance work through hover.

export type ChapterRailRow = {
  id: string;
  /** Hero stat rendered as the row's visual anchor (e.g. "40M", "$300B"). */
  stat?: string;
  /** Full-sentence descriptive line — the fact at a glance. */
  label: string;
};

export function ChapterRail({
  rows,
  activeId,
  onSelect,
  eyebrow,
}: {
  rows: ChapterRailRow[];
  activeId?: string | null;
  onSelect: (id: string) => void;
  eyebrow?: string;
}) {
  return (
    <div className="w-full">
      {eyebrow ? <p className="eyebrow-muted">{eyebrow}</p> : null}
      <ol
        className={`flex flex-col ${eyebrow ? "mt-6" : ""}`}
        aria-label="Chapter rail"
      >
        {rows.map((row) => {
          const isActive = row.id === activeId;
          return (
            <li
              key={row.id}
              className="border-t border-ink/10 first:border-t-0 last:border-b last:border-ink/10"
            >
              <button
                type="button"
                onClick={() => onSelect(row.id)}
                aria-expanded={isActive}
                className="group/row relative grid w-full grid-cols-[auto_1fr_auto] items-start gap-5 px-1 py-6 text-left transition-none md:gap-8 md:py-8"
              >
                {/* Hover fill — sweeps from left, brand-tinted wash. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 origin-left scale-x-0 rounded-md bg-brand-50/60 opacity-0 transition-all duration-400 ease-out-quart group-hover/row:scale-x-100 group-hover/row:opacity-100 group-focus-visible/row:scale-x-100 group-focus-visible/row:opacity-100 motion-reduce:transition-none"
                />

                {/* Stat — the visual anchor. Large serif, tabular
                    numerals so multi-row alignment reads clean. */}
                {row.stat ? (
                  <span
                    className="relative z-10 min-w-[110px] shrink-0 font-serif text-[36px] font-normal leading-none tracking-tight tabular-nums text-ink transition-colors group-hover/row:text-brand-700 md:min-w-[170px] md:text-[44px] lg:text-[48px]"
                  >
                    {row.stat}
                  </span>
                ) : null}

                {/* Descriptive line — reads as a lead sentence. */}
                <span
                  className="relative z-10 font-serif text-[16px] font-normal leading-[1.35] text-ink md:text-[18px] lg:text-[19px]"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  {row.label}
                </span>

                {/* Arrow — quiet at rest, brand-tinted on hover, nudges
                    right. No border, no chip: minimum chrome. */}
                <span
                  aria-hidden
                  className="relative z-10 mt-1.5 inline-flex h-6 w-6 shrink-0 items-center justify-center text-ink-subtle transition-all duration-300 ease-out-quart group-hover/row:translate-x-1 group-hover/row:text-brand-accent group-focus-visible/row:translate-x-1 group-focus-visible/row:text-brand-accent motion-reduce:transition-none md:h-7 md:w-7"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
