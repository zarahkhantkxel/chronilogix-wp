"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Section 1: The Origin. Editorial prose on a soft warm background, with
 * an italic serif emphasis stanza cataloguing the moments where behavior
 * change actually happens.
 */
export function AboutOrigin() {
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
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
  });

  return (
    <section
      id="origin"
      ref={ref}
      className="relative overflow-hidden bg-paper-warm py-24 md:py-32 lg:py-40"
    >
      {/* Soft brand wash from bottom-right, very low intensity, anchors the
          editorial column visually without competing with the prose. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 100% 100%, rgba(249,144,77,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p
              className="font-serif text-[14px] italic text-ink-muted"
              style={reveal(0)}
            >
              Chapter 01
            </p>
            <p className="mt-3 eyebrow" style={reveal(40)}>
              Why we started
            </p>
            <h2
              className="mt-4 text-hero font-serif font-normal text-ink"
              style={
                {
                  textWrap: "balance",
                  ...reveal(120),
                } as React.CSSProperties
              }
            >
              The gap was hiding{" "}
              <span className="text-ink-muted">in plain sight.</span>
            </h2>
          </div>

          <div className="space-y-7 max-w-[60ch]">
            <p className="body-prose" style={reveal(180)}>
              Healthcare has never been short on knowledge.{" "}
              <span className="text-ink">What it&rsquo;s been short on is presence.</span>
            </p>

            <p className="body-prose" style={reveal(260)}>
              Clinicians know what chronic disease costs. Employers know what
              disengaged employees cost. Insurers know what avoidable claims
              cost. And everyone, patients included, knows that the real
              work of behavior change doesn&rsquo;t happen inside a single
              appointment window.
            </p>

            <p
              className="font-serif text-[20px] italic leading-[1.45] text-ink/85 md:text-[22px]"
              style={reveal(340)}
            >
              It happens in the grocery store at 9 PM.<br />
              It happens after an argument.<br />
              It happens when motivation disappears and nobody notices.
            </p>

            <p className="body-prose" style={reveal(440)}>
              We started Chronilogix because the gap between clinical
              knowledge and everyday behavioral support had gone unaddressed
              for too long. Not because nobody cared. Because the tools to
              bridge it at scale didn&rsquo;t exist yet.
            </p>

            <p
              className="font-serif text-row font-normal text-ink"
              style={reveal(540)}
            >
              Now they do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
