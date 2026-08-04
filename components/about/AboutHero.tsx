"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

const EYEBROW = "Our story";
const HEADLINE_LINE_1 = "We built what";
const HEADLINE_LINE_2 = "healthcare forgot to.";
const SUB =
  "Chronilogix exists because the most important moments in someone's health journey happen when no one in the system is available to help. The midnight anxiety spiral. The impulse to quit medication. The quiet relapse. We decided to change that.";

const REVEAL_MS = 1800;

type CredibilityFact = {
  value: string;
  label: string;
};

const CREDIBILITY: CredibilityFact[] = [
  { value: "30+ yrs", label: "of MI research" },
  { value: "430+", label: "peer reviewed studies" },
  { value: "$110M", label: "in research funding" },
  { value: "10,000+", label: "clinicians trained" },
];

export function AboutHero() {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }
    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / REVEAL_MS, 1);
      setProgress(t);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const headWords1 = useMemo(() => HEADLINE_LINE_1.split(" "), []);
  const headWords2 = useMemo(() => HEADLINE_LINE_2.split(" "), []);
  const subWords = useMemo(() => SUB.split(" "), []);
  const totalWords = headWords1.length + headWords2.length + subWords.length;
  const stride = 1 / (totalWords - 1 + 4);
  const windowSize = stride * 4;

  let idx = 0;
  const eased = 1 - Math.pow(1 - progress, 3);
  const tail = clamp01((eased - 0.78) / 0.22);

  const renderWords = (words: string[], key: string) =>
    words.map((w, wi) => {
      const i = idx++;
      const t = clamp01((eased - i * stride) / windowSize);
      return (
        <Fragment key={`${key}-${wi}`}>
          <span
            className="inline-block"
            style={{
              filter: `blur(${(1 - t) * 3.5}px)`,
              opacity: 0.12 + t * 0.88,
              willChange: "filter, opacity",
            }}
          >
            {w}
          </span>
          {wi < words.length - 1 && " "}
        </Fragment>
      );
    });

  return (
    <section
      className="relative overflow-hidden rounded-[28px]"
      style={{ backgroundColor: "#F4EFE7" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 100% 0%, rgba(249,144,77,0.22) 0%, rgba(249,144,77,0.06) 35%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(244,239,231,0) 40%, rgba(15,20,25,0.04) 100%)",
        }}
      />

      <div className="container-page relative pt-36 pb-16 md:pt-44 md:pb-20 lg:pt-52 lg:pb-24">
        <div className="flex items-center gap-3">
          <AIOrb size={18} />
          <p
            className="eyebrow"
            style={{
              opacity: tail,
              transform: `translateY(${(1 - tail) * 6}px)`,
              willChange: "opacity, transform",
            }}
          >
            {EYEBROW}
            <span aria-hidden className="mx-2 text-ink/25">
              ·
            </span>
            <span className="font-serif italic text-ink-muted">
              Founded on Dr. Ken Resnicow&rsquo;s research
            </span>
          </p>
        </div>

        <h1
          className="mt-8 max-w-[18ch] font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.75rem]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {renderWords(headWords1, "h1")}
          <br />
          <span className="text-ink-muted">
            {renderWords(headWords2, "h2")}
          </span>
        </h1>

        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-20">
          <p
            className="max-w-[58ch] text-lg leading-relaxed text-ink-soft md:text-xl md:leading-[1.55]"
            style={{
              opacity: tail,
              transform: `translateY(${(1 - tail) * 10}px)`,
              willChange: "opacity, transform",
            }}
          >
            {renderWords(subWords, "sub")}
          </p>

          <div
            className="flex items-center gap-5"
            style={{
              opacity: tail,
              transform: `translateY(${(1 - tail) * 10}px)`,
              willChange: "opacity, transform",
            }}
          >
            <a href="#get-in-touch" className="btn-primary">
              Get in Touch
            </a>
            <a
              href="#origin"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors duration-200 ease-out hover:text-ink"
            >
              Read on
              <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-ink/[0.08]">
        <div className="container-page py-7 md:py-8">
          <dl
            className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-x-10"
            style={{
              opacity: tail,
              transform: `translateY(${(1 - tail) * 8}px)`,
              transition: "opacity 600ms ease-out, transform 600ms ease-out",
              willChange: "opacity, transform",
            }}
          >
            {CREDIBILITY.map((f) => (
              <div key={f.label} className="flex items-baseline gap-3">
                <dt className="font-serif text-[26px] font-normal leading-none tracking-[-0.015em] text-ink md:text-[30px]">
                  {f.value}
                </dt>
                <dd className="text-[13px] leading-snug text-ink-muted md:text-[13.5px]">
                  {f.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}
