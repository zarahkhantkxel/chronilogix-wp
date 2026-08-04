"use client";

import { useEffect, useRef, useState } from "react";

type Person = {
  name: string;
  role: string;
  // Portrait file under /public.
  photo: string;
  // Optional in-page anchor to a deeper section. Used to hand the reader
  // off to a longer treatment of this person's work (e.g. Resnicow → the
  // science slab) without crowding the card with copy.
  more?: { href: string; label: string };
};

export type AboutTeamContent = {
  headingLead?: string;
  headingMuted?: string;
  intro?: string;
  leaders?: Person[];
  advisorsLabel?: string;
  advisors?: Person[];
};

const DEFAULTS = {
  headingLead: "The people who’ve seen what broken looks like.",
  headingMuted: "And know what better can be.",
  intro:
    "Chronilogix was founded and led by a team that brings together clinical science, healthcare strategy, technology, and the conviction that the people most in need of behavioral support are the least served by the systems designed to help them.",
  leaders: [
    { name: "Steven Amiel", role: "CEO and Cofounder", photo: "/team/steven.png" },
    {
      name: "Dr. Kenneth Resnicow",
      role: "Chief Science Officer",
      photo: "/team/ken.png",
      more: { href: "#science", label: "Read the science" },
    },
    { name: "Lou Ramery", role: "Chief Marketing Officer", photo: "/team/lou.png" },
    { name: "Michael Lazor", role: "Fractional CTO", photo: "/team/michael.png" },
  ],
  advisorsLabel: "Advisory board",
  advisors: [
    {
      name: "Nelson Griswold",
      role: "CEO, NextGen Benefits. One of the benefits industry’s most recognized strategic voices.",
      photo: "/team/steven.png",
    },
    {
      name: "Geoffrey C. Williams, M.D., Ph.D.",
      role: "Global expert in the treatment of behavioral and chronic conditions.",
      photo: "/team/lou.png",
    },
    {
      name: "Julian Lago",
      role: "Entrepreneur and advisor with two healthcare tech exits in the last 24 months.",
      photo: "/team/michael.png",
    },
  ],
} satisfies Required<AboutTeamContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AboutTeam({ content }: { content?: AboutTeamContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const leaders = content?.leaders?.length ? content.leaders : DEFAULTS.leaders;
  const advisors = content?.advisors?.length
    ? content.advisors
    : DEFAULTS.advisors;
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
  });

  return (
    <section
      id="team"
      ref={ref}
      className="relative overflow-hidden rounded-[28px] bg-paper-tint"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 100% 0%, rgba(249,144,77,0.22) 0%, rgba(249,144,77,0.06) 35%, transparent 65%)",
        }}
      />

      <div className="container-page relative pt-36 pb-14 md:pt-44 md:pb-16 lg:pt-52 lg:pb-20">
        <h1
          className="max-w-[20ch] font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]"
          style={
            {
              textWrap: "balance",
              ...reveal(80),
            } as React.CSSProperties
          }
        >
          {c.headingLead}{" "}
          <span className="text-ink-muted">{c.headingMuted}</span>
        </h1>

        <p
          className="mt-10 max-w-[58ch] text-lg leading-relaxed text-ink-soft md:text-xl md:leading-[1.55]"
          style={reveal(180)}
        >
          {c.intro}
        </p>

        {/* Leader grid — portraits sit on the section's paper-tint with no
            white container chrome. The photo IS the surface; name + role
            live below it on the paper, the way the home page handles its
            card content (image fills, no boxed white surface). */}
        <ul
          className="mt-14 grid grid-cols-2 gap-5 md:mt-16 md:gap-6 lg:mt-20 lg:grid-cols-4 lg:gap-7"
          style={reveal(280)}
        >
          {leaders.map((leader, i) => (
            <PersonCard
              key={leader.name}
              person={leader}
              size="lead"
              style={reveal(280 + i * 80)}
            />
          ))}
        </ul>

        {/* Advisory board — same portrait treatment as the leaders so the
            two rows read as one continuous people-band. Compact 3-up grid
            with shorter copy beneath. */}
        <div className="mt-20 md:mt-24 lg:mt-28" style={reveal(640)}>
          {/* The eyebrow and the grid share one centered block so the
              "Advisory board" label hangs above the left edge of the
              first advisor card rather than floating against the section
              edge while the grid sits indented. */}
          <div className="lg:mx-auto lg:max-w-[75%]">
            <p className="eyebrow-subtle">{c.advisorsLabel}</p>
            <ul className="mt-6 grid grid-cols-2 gap-5 md:gap-6 lg:grid-cols-3 lg:gap-7">
              {advisors.map((a, i) => (
                <PersonCard
                  key={a.name}
                  person={a}
                  size="advisor"
                  style={reveal(700 + i * 90)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonCard({
  person,
  size,
  style,
}: {
  person: Person;
  size: "lead" | "advisor";
  style: React.CSSProperties;
}) {
  const isLead = size === "lead";
  return (
    <li style={style} className="flex flex-col">
      {/* The portrait. Rounded, subtle soft shadow so it sits on the paper
          page rather than floating in a hard white box. */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink/[0.06]"
        style={{
          boxShadow:
            "0 1px 2px rgba(40,25,15,0.05), 0 18px 40px -24px rgba(40,25,15,0.22)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={person.photo}
          alt={`Portrait of ${person.name}`}
          draggable={false}
          className="h-full w-full select-none object-cover"
          style={{ objectPosition: "50% 30%" }}
        />
      </div>

      {/* Labels — sit directly on the section paper, no card chrome. */}
      <div className="flex flex-col px-0.5 pt-5 md:pt-6">
        <h3
          className={
            isLead
              ? "font-serif text-[18px] font-normal leading-tight tracking-[-0.012em] text-ink md:text-[20px]"
              : "text-[14.5px] font-medium tracking-[-0.005em] text-ink md:text-[15px]"
          }
        >
          {person.name}
        </h3>
        <p
          className={
            isLead
              ? "mt-1.5 text-[13px] font-medium tracking-[-0.005em] text-brand-700"
              : "mt-1.5 text-[13px] leading-snug text-ink-muted md:text-[13.5px]"
          }
        >
          {person.role}
        </p>
        {person.more ? (
          <a
            href={person.more.href}
            className="group/more mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted transition-colors duration-200 ease-out hover:text-ink"
          >
            {person.more.label}
            <svg
              width="11"
              height="11"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-200 ease-out motion-reduce:transition-none group-hover/more:translate-x-0.5"
            >
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ) : null}
      </div>
    </li>
  );
}
