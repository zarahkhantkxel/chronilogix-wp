"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * AppPartnersDiagram — the signature moment of this page. Shows how
 * Chronilogix sits inside a partner app: partner surface on the left,
 * the API/SDK connector in the middle, the Chronilogix coaching engine
 * on the right. Below the diagram, three caption columns explain what
 * moves in each direction. Beside it (on desktop) sits a placeholder
 * for the real partner-app screenshot when it lands.
 */

type EngineSubCard = { title: string; body: string };
type Caption = { label: string; body: string };

export type AppPartnersDiagramContent = {
  eyebrow?: string;
  heading?: string;
  engineTitle?: string;
  engineCards?: EngineSubCard[];
  captions?: Caption[];
};

const DEFAULTS = {
  eyebrow: "How it fits inside your product",
  heading: "One integration. Every coaching moment.",
  engineTitle: "Chronilogix coaching engine",
  engineCards: [
    {
      title: "MI methodology",
      body: "Thirty years of Dr. Resnicow's research, encoded as coaching moves.",
    },
    {
      title: "Roni AI runtime",
      body: "The reasoning layer that composes each reply in real time.",
    },
    {
      title: "Clinical guardrails",
      body: "Safety, escalation, and consent handled before your app ever sees a reply.",
    },
  ],
  captions: [
    {
      label: "You send",
      body: "User message + context, over a single REST call.",
    },
    {
      label: "Chronilogix returns",
      body: "A clinically grounded reply, ready to render in your UI.",
    },
    {
      label: "You keep",
      body: "Data, brand, and the relationship with your user.",
    },
  ],
} satisfies Required<AppPartnersDiagramContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AppPartnersDiagram({
  content,
}: {
  content?: AppPartnersDiagramContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const engineCards = content?.engineCards?.length
    ? content.engineCards
    : DEFAULTS.engineCards;
  const captions = content?.captions?.length
    ? content.captions
    : DEFAULTS.captions;
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="ap-diagram-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="max-w-[62ch]">
          <p className="reveal-row eyebrow [transition-delay:80ms]">
            {c.eyebrow}
          </p>
          <h2
            id="ap-diagram-label"
            className="reveal-row mt-4 max-w-[24ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.heading}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
          {/* Left / top: the diagram itself. */}
          <div
            className="reveal-row rounded-[24px] border border-ink/10 bg-paper-warm p-6 md:p-8 [transition-delay:280ms]"
          >
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.1fr)] md:gap-6">
              {/* Partner app panel */}
              <PartnerPanel />

              {/* Connector column — API/SDK link. Rotates horizontal on
                  desktop, vertical on mobile. */}
              <Connector />

              {/* Chronilogix engine panel with 3 sub-cards. */}
              <EnginePanel title={c.engineTitle} cards={engineCards} />
            </div>
          </div>

          {/* Right / below: image placeholder for a real screenshot of a
              partner app with Chronilogix inside it. */}
          <div
            className="reveal-row [transition-delay:440ms]"
          >
            {/* IMAGE PLACEHOLDER: Screenshot of a partner app with a
                Chronilogix-powered chat inside — chrome of partner app
                on top, Roni reply below. Size: ~500x700. */}
            <div className="surface-glass relative aspect-[3/4] w-full overflow-hidden rounded-[24px]">
              <span
                aria-hidden
                className="surface-glass-shine pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[24px]"
              />
              <div className="absolute inset-4 flex items-center justify-center rounded-[18px] border border-dashed border-ink/25">
                <p className="max-w-[22ch] px-6 text-center font-serif text-[13px] italic text-ink-muted">
                  Image placeholder &mdash; partner-app screenshot with
                  Chronilogix reply
                </p>
              </div>
            </div>
          </div>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-3 md:gap-6 lg:gap-10">
          {captions.map((cap, i) => {
            const numeral = ["I", "II", "III"][i] ?? String(i + 1);
            return (
              <li
                key={cap.label}
                className="reveal-row flex flex-col gap-3 border-t border-ink/12 pt-6 md:border-t-0 md:border-l md:pl-6 md:pt-1"
                style={{ transitionDelay: `${520 + i * 120}ms` }}
              >
                <span className="font-serif text-[13px] italic tracking-[0.04em] text-brand-700">
                  {numeral}.
                </span>
                <p className="text-base font-medium leading-snug text-ink md:text-lg">
                  {cap.label}
                </p>
                <p className="body-quiet max-w-[34ch]">{cap.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function PartnerPanel() {
  return (
    <div className="surface-glass relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[20px] p-6">
      <span
        aria-hidden
        className="surface-glass-shine pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[20px]"
      />
      <div className="relative">
        <span className="font-serif text-[13px] italic text-ink-muted">
          Your product
        </span>
        <p className="mt-4 max-w-[26ch] font-serif text-base leading-snug text-ink md:text-lg">
          &ldquo;How are you feeling about tomorrow&rsquo;s check&#8209;in?&rdquo;
        </p>
      </div>
      <p className="relative font-serif text-[12px] italic text-ink-muted">
        Your brand, your voice, your UI.
      </p>
    </div>
  );
}

function Connector() {
  return (
    <div className="relative flex items-center justify-center md:min-w-[72px]">
      <div className="flex flex-col items-center gap-3 md:gap-4">
        <span className="font-serif text-[12px] italic text-brand-700">
          API / SDK
        </span>
        <svg
          viewBox="0 0 40 20"
          className="h-5 w-10 rotate-90 md:rotate-0"
          fill="none"
          aria-hidden
        >
          <path
            d="M2 10h34m0 0-6-6m6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-700"
          />
        </svg>

        {/* Flow-trail dots — three tiny brand-orange pips that pulse
            in sequence from the partner side toward the engine side,
            reinforcing the "one integration, live traffic" idea. On
            mobile the connector rotates 90deg so the dot trail rotates
            with it. Loop repeats every 3.3s. Static and evenly spaced
            for prefers-reduced-motion (fallback below). */}
        <div
          aria-hidden
          className="flex items-center gap-2 rotate-90 md:rotate-0 motion-reduce:hidden"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: "#FF7434",
                opacity: 0.18,
                animation: `livePulse 3300ms cubic-bezier(0.22, 0.61, 0.36, 1) ${i * 320}ms infinite`,
              }}
            />
          ))}
        </div>
        {/* Reduced-motion fallback — same three dots, static, evenly
            spaced, low opacity so the trail still reads as an
            integration hint without any motion. */}
        <div
          aria-hidden
          className="hidden items-center gap-2 rotate-90 md:rotate-0 motion-reduce:flex"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#FF7434", opacity: 0.45 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EnginePanel({
  title,
  cards,
}: {
  title: string;
  cards: EngineSubCard[];
}) {
  return (
    <div className="surface-glass relative overflow-hidden rounded-[20px] p-6">
      <span
        aria-hidden
        className="surface-glass-shine pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[20px]"
      />
      <div className="relative flex items-center gap-2">
        <span
          aria-hidden
          className="block h-2 w-2 rounded-full"
          style={{ backgroundColor: "#FF7434" }}
        />
        <span className="font-serif text-[13px] italic text-brand-700">
          {title}
        </span>
      </div>
      <ul className="relative mt-4 space-y-3">
        {cards.map((card, i) => {
          const numeral = ["I", "II", "III"][i] ?? String(i + 1);
          return (
            <li
              key={card.title}
              className="surface-glass-inner rounded-xl px-4 py-3"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-[12px] italic text-brand-700">
                  {numeral}.
                </span>
                <p className="text-sm font-medium text-ink">{card.title}</p>
              </div>
              <p className="mt-1 pl-6 text-[13px] leading-snug text-ink-soft">
                {card.body}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
