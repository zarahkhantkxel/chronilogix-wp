"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollTrigger } from "./useScrollTrigger";

const SUGGESTIONS = [
  "How does Chronilogix work?",
  "What does it cost?",
  "How do you handle crisis situations?",
  "Can I book a demo?",
];

export function QuestionsWidget() {
  const visible = useScrollTrigger("section-credibility-bar", 0.2);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-out md:bottom-6 md:right-6 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Got a question?"
          className="mb-3 w-[calc(100vw-2rem)] max-w-[340px] origin-bottom-right animate-fade-up overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-widget"
        >
          <div className="flex items-start justify-between gap-3 border-b border-ink/5 bg-slate-widgetSoft px-5 py-4">
            <div>
              <p className="text-sm font-medium text-ink">Got a question?</p>
              <p className="mt-0.5 text-[11px] text-ink-muted">
                Ask anything about Chronilogix
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted transition hover:bg-white hover:text-ink"
            >
              ×
            </button>
          </div>

          <div className="px-5 pb-5 pt-5">
            <div className="rounded-xl bg-slate-widgetSoft px-4 py-3 text-sm leading-relaxed text-ink-soft">
              Hi — got questions about Chronilogix? I can help with how the
              platform works, pricing, the clinical methodology, or how to book
              a demo. What would you like to know?
            </div>

            <ul className="mt-4 space-y-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-ink/10 px-3 py-2 text-left text-xs text-ink-soft transition hover:border-ink/30 hover:text-ink"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-2">
              <input
                type="text"
                placeholder="Type your question…"
                className="flex-1 bg-transparent text-xs text-ink placeholder:text-ink-subtle focus:outline-none"
              />
              <button
                type="button"
                aria-label="Send"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-widget text-white transition hover:opacity-90"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M2 6h8M6.5 2.5 10 6l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open questions widget"
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-widget text-white shadow-widget transition hover:opacity-95"
      >
        {open ? (
          <span className="text-lg" aria-hidden>
            ×
          </span>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M6.7 6.8a2.3 2.3 0 1 1 3.5 2c-.8.5-1.2 1-1.2 1.7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="9" cy="13.2" r="0.7" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
