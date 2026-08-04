"use client";

import { useState } from "react";

export function USP() {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      id="why-chronilogix"
      className="relative overflow-hidden rounded-[28px] bg-ink"
    >
      <div className="group relative aspect-[4/5] sm:aspect-video">
        <img
          src="/ken-thumbnail.png"
          alt="Dr. Ken Resnicow, seated in conversation"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink/35 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent"
        />

        <div className="absolute left-8 top-8 md:left-12 md:top-12 lg:left-16 lg:top-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">
            Why Chronilogix
          </p>
          <p className="mt-2 text-sm text-white/85 md:text-base">
            Watch · 2 min
          </p>
        </div>

        <button
          type="button"
          aria-label="Play video"
          onClick={() => setPlaying(true)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 group-hover:opacity-100"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-ink shadow-widget transition-transform hover:scale-105 md:h-20 md:w-20">
            <PlayIcon />
          </span>
        </button>

        <div className="absolute bottom-8 left-8 text-white md:bottom-12 md:left-12 lg:bottom-16 lg:left-16">
          <p className="text-xl font-normal md:text-2xl">Dr. Ken Resnicow</p>
          <p className="mt-1 text-sm text-white/75 md:text-base">
            The mind behind Chronilogix
          </p>
        </div>

        <div className="absolute bottom-8 right-8 max-w-sm text-right md:bottom-12 md:right-12 md:max-w-md lg:bottom-16 lg:right-16 lg:max-w-lg">
          <h2 className="text-xl font-serif font-normal tracking-tight text-white md:text-2xl lg:text-3xl">
            The human intelligence behind our AI.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 md:text-base">
            At the heart of our platform is not just technology. It is 30
            years of global experience. Dr. Ken Resnicow, one of the world’s
            foremost experts in Motivational Interviewing and Cultural
            Tailoring, has spent decades guiding patients across diverse
            backgrounds, conditions, and cultures toward real, lasting change.
          </p>
        </div>
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M7 4.5v11l9-5.5-9-5.5Z" fill="currentColor" />
    </svg>
  );
}
