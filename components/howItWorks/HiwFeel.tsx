"use client";

import { useEffect, useRef, useState } from "react";

type Feeling = {
  lead: string;
  body: string;
};

const FEELINGS: Feeling[] = [
  {
    lead: "Heard before helped.",
    body:
      "The coach listens first. Always. The member's own words shape every response. Nobody tells you what you already know you should be doing.",
  },
  {
    lead: "Collaborative, not clinical.",
    body:
      "Goals are set together, at your pace, in your language. The coach doesn't arrive with a care plan. The care plan emerges from the conversation.",
  },
  {
    lead: "Connected to what actually matters to you.",
    body:
      "Roni and Millie don't optimize for metrics. They help members reconnect with their own reasons for change. Family, health, independence, purpose, the feeling of waking up and recognizing yourself. When the reason is yours, the motivation holds.",
  },
  {
    lead: "Safe enough to be honest.",
    body:
      "For many members, this is the first time they have spoken honestly about their struggle. Not because other care wasn't available, but because this felt different. Judgment free isn't a value statement. It's how the conversation is engineered.",
  },
  {
    lead: "Present when nobody else is.",
    body:
      "Whatever time. Whatever day. Whatever is happening. The coach is there.",
  },
];

export function HiwFeel() {
  return (
    <section
      id="feel"
      aria-labelledby="feel-label"
      className="relative bg-white"
    >
      <div className="container-page py-24 md:py-32 lg:py-40">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="eyebrow">The experience</p>
          <h2
            id="feel-label"
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            The first place some people have ever{" "}
            <span className="text-ink-muted">been completely honest.</span>
          </h2>
          <div className="mt-7 max-w-[58ch] space-y-5 body-prose">
            <p>
              There is something that happens when a person realizes they
              will not be judged. When the coach doesn&rsquo;t react to
              the thing they&rsquo;ve been afraid to say. When the
              response is a question, a genuine, curious, open question,
              rather than a correction or a plan.
            </p>
            <p>
              Chronilogix is designed to create that experience,
              consistently, for every member.
            </p>
          </div>
        </div>

        {/* Five statements. Each lives on its own row: kicker on the left,
            body on the right, hairline above. Calm, editorial — the
            section is doing felt-sense work, not list work. */}
        <dl className="mt-20 flex flex-col md:mt-24">
          {FEELINGS.map((f, i) => (
            <FeelingRow key={f.lead} feeling={f} index={i} />
          ))}
        </dl>
      </div>
    </section>
  );
}

function FeelingRow({
  feeling,
  index,
}: {
  feeling: Feeling;
  index: number;
}) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-revealed={inView ? "true" : "false"}
      className={`grid grid-cols-1 gap-y-4 border-t border-ink/10 py-10 md:py-12 lg:grid-cols-12 lg:gap-x-12 ${
        index === FEELINGS.length - 1 ? "border-b" : ""
      }`}
    >
      <dt className="lg:col-span-5">
        <p
          className="reveal-row font-serif text-row font-normal leading-[1.15] text-ink [transition-delay:0ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {feeling.lead}
        </p>
      </dt>
      <dd className="lg:col-span-7">
        <p className="reveal-row max-w-2xl body-prose [transition-delay:180ms]">
          {feeling.body}
        </p>
      </dd>
    </div>
  );
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
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}
