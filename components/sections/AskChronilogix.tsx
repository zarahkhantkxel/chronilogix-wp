"use client";

import { useState } from "react";

const SUGGESTIONS = [
  {
    label: "Who is it for",
    prompt: "Who is Chronilogix designed for?",
  },
  {
    label: "What is Motivational Interviewing",
    prompt: "What is Motivational Interviewing, in plain English?",
  },
  {
    label: "How Chronilogix helps with chronic care",
    prompt:
      "How does Chronilogix support members managing chronic conditions like diabetes or hypertension?",
    wide: true,
  },
];

export function AskChronilogix() {
  const [value, setValue] = useState("");

  return (
    <section
      id="ask-chronilogix"
      className="section flex flex-col justify-center bg-brand-50 lg:min-h-[85vh]"
    >
      <div className="container-page">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-section font-serif font-normal tracking-tight text-ink md:text-display">
            Ask anything about Chronilogix.
          </h2>

          <div className="mt-12 w-full">
            <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft transition focus-within:border-ink/30">
              <div className="relative p-5">
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  rows={3}
                  placeholder="Ask about clinical methodology, integration, pricing, or compliance…"
                  aria-label="Ask anything about Chronilogix"
                  className="w-full resize-none bg-transparent pr-24 text-left text-base leading-relaxed text-ink placeholder:text-ink-subtle focus:outline-none"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Voice input"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink-soft transition hover:border-ink/40 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2"
                  >
                    <MicIcon />
                  </button>
                  <button
                    type="button"
                    aria-label="Send"
                    disabled={!value.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white shadow-soft transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:bg-ink/20"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path
                        d="M7 11V3M3.5 6.5 7 3l3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex w-full flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTIONS.filter((s) => !s.wide).map((s) => (
                <Pill key={s.label} suggestion={s} onPick={setValue} />
              ))}
            </div>
            {SUGGESTIONS.filter((s) => s.wide).map((s) => (
              <Pill key={s.label} suggestion={s} onPick={setValue} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({
  suggestion,
  onPick,
}: {
  suggestion: { label: string; prompt: string };
  onPick: (v: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(suggestion.prompt)}
      className="rounded-full border border-ink/15 bg-transparent px-3.5 py-1.5 text-xs text-ink-soft transition hover:border-ink/40 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-50"
    >
      {suggestion.label}
    </button>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect
        x="6"
        y="2"
        width="4"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M3.5 7v1a4.5 4.5 0 0 0 9 0V7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M8 12.5V14M6 14h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
