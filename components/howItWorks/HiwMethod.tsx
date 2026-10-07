"use client";

import { useEffect, useRef, useState } from "react";

type Principle = {
  index: string;
  lead: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    index: "01",
    lead: "It reflects rather than prescribes.",
    body:
      "Roni and Millie ask open questions. They summarize what the member says back to them. They help the member hear their own ambivalence, and work through it, without being pushed. The coach isn't the authority. The member is.",
  },
  {
    index: "02",
    lead: "It meets people where they actually are.",
    body:
      "Not where they should be. Not where the care plan says they should be. Where they are today. Exhausted. Resistant. Halfway. That's a valid starting point. Every Chronilogix conversation begins there.",
  },
  {
    index: "03",
    lead: "It builds intrinsic motivation, not compliance.",
    body:
      "Compliance breaks under stress. Intrinsic motivation, rooted in what the person actually cares about, their family, their health, their sense of self, holds. Chronilogix coaches are designed to find that thread and pull it gently forward.",
  },
];

type ResearchStat = {
  target: number;
  prefix?: string;
  suffix?: string;
  grouped?: boolean;
  label: string;
};

const RESEARCH_STATS: ResearchStat[] = [
  { target: 430, suffix: "+", label: "Peer reviewed studies" },
  { target: 110, prefix: "$", suffix: "M", label: "Research funding" },
  { target: 70, label: "Global clinical trials" },
];

type ProofPoint = {
  lead: string;
  label: string;
};

const PROOF_POINTS: ProofPoint[] = [
  { lead: "430+", label: "Peer reviewed studies" },
  { lead: "$110M", label: "Research funding" },
  { lead: "70", label: "Global clinical studies" },
  { lead: "+40%", label: "Engagement increase at Aetna" },
  { lead: "-55%", label: "Reduction in dropout rates" },
  { lead: "-58%", label: "Type 2 diabetes onset (US DPP, CDC/NIH)" },
];

export function HiwMethod() {
  return (
    <section
      id="method"
      aria-labelledby="method-label"
      className="relative bg-white"
    >
      <div className="container-page py-24 md:py-32 lg:py-40">
        {/* Header — sets up the contrast between information delivery
            and motivational interviewing. */}
        <div className="max-w-4xl">
          <p className="eyebrow">Why it works</p>
          <h2
            id="method-label"
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Not what to do.{" "}
            <span className="text-ink-muted">Why they want to.</span>
          </h2>
        </div>

        {/* Lead-in prose — the argument that information is not the gap. */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="space-y-6 body-prose">
              <p>
                There is a reason most health coaching fails. It tells
                people what they already know. Eat less. Move more. Take
                your medication. Check your sugar.
              </p>
              <p>
                People do not fail chronic care because they lack
                information. They fail because behavior change is
                emotionally difficult, inconsistent, lonely, and
                unsupported during the moments that matter most.
              </p>
              <p>
                Motivational Interviewing is the clinical antidote to that
                failure. Developed over decades of NIH funded research, MI
                is the communication framework used by the world&rsquo;s
                most effective therapists, addiction counselors, and
                chronic disease specialists. It doesn&rsquo;t persuade. It
                doesn&rsquo;t lecture. It listens, and through listening,
                it helps people find their own reasons to change.
              </p>
              <p>
                That internal shift, from external pressure to internal
                motivation, is what makes change sustainable. Not just
                for a week after the appointment. But for months. Years.
                For good.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <aside
              className="relative h-full rounded-2xl border border-ink/10 bg-paper-warm p-8 md:p-9"
              style={{
                boxShadow:
                  "0 1px 2px rgba(15,20,25,0.04), 0 18px 44px -22px rgba(15,20,25,0.18)",
              }}
            >
              <p className="eyebrow-subtle">A first</p>
              <p
                className="mt-4 font-serif text-row font-normal leading-[1.18] text-ink"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                Chronilogix is the first platform to translate that method
                into AI at scale.
              </p>
              <p className="mt-6 body-quiet">
                Thirty years of MI research, encoded into the coaching
                loop of every Roni and Millie session, automatically, at
                clinical fidelity, around the clock.
              </p>
            </aside>
          </div>
        </div>

        {/* Three principles. Mirrors WhoWeServe's numbered signal rows
            so the page sounds in one voice across home and product. */}
        <div className="mt-24 md:mt-32">
          <div className="flex items-baseline justify-between gap-4 border-t border-ink/15 pt-6">
            <p className="eyebrow-muted">
              Three things MI does that other approaches don&rsquo;t
            </p>
            <p className="font-serif text-[13px] italic text-ink/45">
              03 principles
            </p>
          </div>
          <ol className="mt-10 flex flex-col">
            {PRINCIPLES.map((p, i) => (
              <PrincipleRow
                key={p.index}
                principle={p}
                isLast={i === PRINCIPLES.length - 1}
              />
            ))}
          </ol>
        </div>

        {/* Credential block — Dr. Resnicow's authority + the Aetna proof
            point. Hidden for now; restore by un-commenting the line below
            when the credential treatment lands its final form. */}
        {/* <CredentialBlock /> */}

        {/* Proof points strip — the section's final beat. Six figures
            that sit together as one drumroll. */}
        <ProofPointsStrip />
      </div>
    </section>
  );
}

function PrincipleRow({
  principle,
  isLast,
}: {
  principle: Principle;
  isLast: boolean;
}) {
  const { ref, inView } = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      data-revealed={inView ? "true" : "false"}
      className={`grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 py-8 md:gap-x-8 md:py-10 ${
        !isLast ? "border-b border-ink/10" : ""
      }`}
    >
      <div className="reveal-row flex flex-col gap-2 [transition-delay:0ms]">
        <span className="text-[13px] font-medium tabular-nums text-brand-700">
          {principle.index}
        </span>
        <span aria-hidden className="block h-px w-8 bg-ink/10" />
      </div>
      <p className="reveal-row max-w-3xl font-serif text-row font-normal leading-[1.18] text-ink [transition-delay:120ms]">
        {principle.lead}
      </p>
      <span aria-hidden />
      <p className="reveal-row max-w-2xl body-prose [transition-delay:280ms]">
        {principle.body}
      </p>
    </li>
  );
}

function CredentialBlock() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-revealed={inView ? "true" : "false"}
      className="mt-24 md:mt-32"
    >
      <div className="flex items-baseline justify-between gap-4 border-t border-ink/15 pt-6">
        <p className="eyebrow-muted">The credential behind the method</p>
        <p className="font-serif text-[13px] italic text-ink/45">
          Chief science officer
        </p>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h3
            className="reveal-row max-w-2xl font-serif text-section font-normal text-ink [transition-delay:0ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Dr. Kenneth Resnicow.{" "}
            <span className="text-ink-muted">
              One of the world&rsquo;s foremost authorities on
              Motivational Interviewing in healthcare.
            </span>
          </h3>
          <p className="reveal-row mt-7 max-w-xl body-prose [transition-delay:160ms]">
            His work spans research that has shaped how the world&rsquo;s
            largest health plans and governments deliver behavioral care,
            including Kaiser, Aetna, and international ministries of
            health.
          </p>

          <ResearchGrid active={inView} />
        </div>

        <div className="lg:col-span-5">
          {/* Aetna anchor — the operational proof of the method. The
              53 → 76 treatment mirrors the home CustomerStories card
              so the same outcome is recognizable across the site. */}
          <figure
            className="reveal-row rounded-2xl border border-ink/10 bg-paper-warm p-8 md:p-10 [transition-delay:280ms]"
            style={{
              boxShadow:
                "0 1px 2px rgba(15,20,25,0.04), 0 18px 44px -22px rgba(15,20,25,0.18)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Aetna_Logo.svg"
              alt="Aetna"
              className="h-7 w-auto md:h-8"
              draggable={false}
          loading="lazy"
          decoding="async"
        />
            <p className="mt-6 font-serif text-5xl font-normal leading-none tracking-tight text-ink tabular-nums md:text-6xl">
              53%{" "}
              <span className="text-brand-600">&rarr;</span>{" "}
              76%
            </p>
            <p className="mt-4 text-[15px] font-medium text-ink-soft md:text-base">
              Member engagement, after nurse coaches were trained in Dr.
              Resnicow&rsquo;s MI framework.{" "}
              <span className="text-ink">Dropouts fell by more than half.</span>
            </p>
            <figcaption className="source-line mt-7">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-brand"
              />
              Aetna disease management programs
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}

function ResearchGrid({ active }: { active: boolean }) {
  return (
    <dl className="reveal-stagger mt-12 grid grid-cols-3 gap-x-6 gap-y-2 sm:divide-x sm:divide-ink/12 md:gap-x-0">
      {RESEARCH_STATS.map((s, i) => (
        <div
          key={s.label}
          className={`flex flex-col gap-3 py-1 ${
            i === 0 ? "sm:pr-7" : i === RESEARCH_STATS.length - 1 ? "sm:pl-7" : "sm:px-7"
          }`}
        >
          <dt className="font-serif text-stat-md font-normal leading-[0.94] text-ink tabular-nums">
            {s.prefix ? <span className="text-ink-muted">{s.prefix}</span> : null}
            <CountUp target={s.target} grouped={s.grouped} active={active} delayMs={300 + i * 110} />
            {s.suffix ? <span className="text-brand-600">{s.suffix}</span> : null}
          </dt>
          <dd className="text-sm font-medium text-ink-soft">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProofPointsStrip() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mt-24 md:mt-32">
      <div className="flex items-baseline justify-between gap-4 border-t border-ink/15 pt-6">
        <p className="eyebrow-muted">The proof, gathered</p>
        <p className="font-serif text-[13px] italic text-ink/45">
          06 outcomes
        </p>
      </div>
      <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 md:gap-y-12">
        {PROOF_POINTS.map((p, i) => (
          <li
            key={p.label}
            className="flex flex-col gap-3"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition:
                "opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1)",
              transitionDelay: `${160 + i * 90}ms`,
            }}
          >
            <p className="font-serif text-stat-md font-normal leading-[0.94] text-ink tabular-nums">
              {p.lead}
            </p>
            <p className="max-w-[28ch] text-[14.5px] font-medium leading-snug text-ink-soft md:text-[15.5px]">
              {p.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CountUp({
  target,
  grouped,
  active,
  delayMs = 0,
}: {
  target: number;
  grouped?: boolean;
  active: boolean;
  delayMs?: number;
}) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setValue(target);
      return;
    }

    const duration = 1400;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t + delayMs;
      const elapsed = t - start;
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, target, delayMs]);

  const display = grouped ? value.toLocaleString("en-US") : value.toString();
  return <>{display}</>;
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
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
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}
