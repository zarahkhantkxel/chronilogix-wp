"use client";

import { useEffect, useRef, useState } from "react";

type Trait = {
  label: string;
  body: string;
};

const TRAITS: Trait[] = [
  {
    label: "Culturally sensitive",
    body:
      "Adapting to language, background, dietary norms, and lived experience.",
  },
  {
    label: "Emotionally aware",
    body:
      "Recognizing that stress, identity, family dynamics, and financial pressure all influence readiness to change.",
  },
  {
    label: "Without judgment",
    body:
      "Creating the kind of safe environment where people are honest, often for the first time, about what they're actually struggling with.",
  },
];

export function AboutDifferent() {
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
      id="different"
      ref={ref}
      className="relative overflow-hidden rounded-[28px] bg-white py-24 md:py-32 lg:py-40"
    >
      <div className="container-page">
        <div className="max-w-[46rem]">
          <p className="eyebrow" style={reveal(0)}>
            Our approach
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
            We don&rsquo;t push notifications.{" "}
            <span className="text-ink-muted">We have conversations.</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
          <div className="space-y-7 max-w-[60ch]">
            <p className="body-prose" style={reveal(200)}>
              There is a fundamental difference between an app that{" "}
              <span className="text-ink-muted italic">tracks</span> your
              behavior and a coach that{" "}
              <span className="text-ink">understands</span> it.
            </p>
            <p className="body-prose" style={reveal(280)}>
              Most digital health tools are built around dashboards, reminders,
              and content libraries. They are passive. They wait for you to
              come to them, log something, or respond to a push notification.
              When you stop showing up, the system moves on.
            </p>
            <p className="body-prose" style={reveal(360)}>
              Chronilogix is built around conversation. Real, responsive,
              adaptive dialogue, available 24 hours a day, every day of the
              year. It meets people in the moments that matter rather than
              waiting for them to schedule a session.
            </p>
            <p
              className="font-serif text-row font-normal leading-[1.18] text-ink"
              style={reveal(440)}
            >
              Our AI coaches don&rsquo;t tell people what to do.{" "}
              <span className="text-brand-700 italic">
                They help people discover why they want to do it.
              </span>
            </p>
          </div>

          <ul className="space-y-3 self-start lg:sticky lg:top-28">
            {TRAITS.map((trait, i) => (
              <li
                key={trait.label}
                className="relative overflow-hidden rounded-[18px] border border-ink/[0.08] bg-paper-warm p-6 md:p-7"
                style={reveal(240 + i * 110)}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-[11px] font-medium text-brand-700 tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[16px] font-medium text-ink">
                    {trait.label}
                  </h3>
                </div>
                <p className="mt-3 body-quiet">{trait.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
