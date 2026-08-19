"use client";

import { useEffect, useRef, useState } from "react";

type Person = {
  name: string;
  /** Short title. The scannable line: what they do here. */
  role: string;
  /** One or two sentences of standing. The line that earns the title. */
  bio: string;
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
    {
      name: "Steven Amiel",
      role: "CEO and Cofounder",
      bio: "Visionary leader with a track record of scaling disruptive healthcare solutions.",
      photo: "/team/steven.png",
    },
    {
      name: "Dr. Kenneth Resnicow",
      role: "Chief Science Officer",
      bio: "Globally recognized expert in Motivational Interviewing, with 30+ years of evidence-based research behind our behavioral and chronic care coaching.",
      photo: "/team/ken.png",
      more: { href: "#science", label: "Read the science" },
    },
    {
      name: "Lou Ramery",
      role: "Chief Marketing Officer",
      bio: "Built and ran the CRM and loyalty programs for Sears and Kmart under Eddie Lampert. Global SVP at Digitas.",
      photo: "/team/lou.png",
    },
    {
      name: "Michael Lazor",
      role: "Fractional CTO",
      bio: "Manages the development team building the platform.",
      photo: "/team/michael.png",
    },
  ],
  advisorsLabel: "Advisory board",
  // Every advisor now has their own portrait — these were previously
  // pointing at the leaders' files as stand-ins. Role is the short title
  // and bio carries the standing, matching the leaders above.
  advisors: [
    {
      name: "Nelson Griswold",
      role: "CEO, NextGen Benefits",
      bio: "One of the benefits industry’s most recognized strategic voices.",
      photo: "/team/nelson.png",
    },
    {
      name: "Geoffrey C. Williams, M.D., Ph.D.",
      role: "Clinical advisor",
      bio: "Global expert in the treatment of behavioral and chronic conditions.",
      photo: "/team/geoffrey.png",
    },
    {
      name: "Julian Lago",
      role: "Advisor",
      bio: "Entrepreneur with deep connections across healthcare and technology. Two healthcare tech exits in the last 24 months.",
      photo: "/team/julian.png",
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

      <div className="container-page relative pt-32 pb-14 md:pt-36 md:pb-16 lg:pt-40 lg:pb-20">
        {/* `text-hero` (max 56px) rather than the arbitrary ramp this
            carried before, which topped out at 5.5rem/88px — larger than
            even the `display` token and well past what the config says
            should be reached for. At that size the heading dwarfed the
            portraits below it and the section opened on type alone; the
            smaller step lets the faces carry their share. */}
        <h1
          className="max-w-[24ch] text-hero font-serif font-normal text-ink"
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
          className="mt-6 max-w-[56ch] body-prose md:mt-7"
          style={reveal(180)}
        >
          {c.intro}
        </p>

        {/* Leader grid — portraits sit on the section's paper-tint with no
            white container chrome. Name + role live below on the paper.

            This grid defines the column the whole team block is built on:
            the advisory row below reuses these exact classes so the two
            rows share one set of column edges. Change the columns or the
            gaps here and you must change them there too, or the rows will
            drift out of alignment. */}
        <ul
          className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-16 lg:mt-20 lg:grid-cols-4 lg:gap-x-28"
          style={reveal(280)}
        >
          {leaders.map((leader, i) => (
            <PersonCard
              key={leader.name}
              person={leader}
              rank="lead"
              style={reveal(280 + i * 80)}
            />
          ))}
        </ul>

        {/* Advisory board — same portrait size and the same grid column as
            the leaders, so the three advisors sit directly under the first
            three leaders and the two rows read as one continuous
            people-band. Only the type beneath the portraits is dialed
            down, which is where the hierarchy between founders and board
            belongs. */}
        <div className="relative mt-20 md:mt-24 lg:mt-28" style={reveal(640)}>
          {/* The label rides the rule that opens this block rather than
              sitting above it as another heading: a hairline divider with
              the pill straddling its left end, the way a fieldset legend
              interrupts its border. It reads as one gesture instead of a
              stacked title, and it makes the boundary between the
              founding team and the board explicit without a second
              full-size heading competing with the h1. White pill on the
              section's paper-tint, so it lifts off the ground. */}
          <div className="relative border-t border-ink/[0.12] pt-16 md:pt-20">
            <p className="absolute -top-[15px] left-0 inline-flex items-center gap-2 rounded-full border border-ink/[0.09] bg-paper py-1.5 pl-3 pr-4 text-[13px] font-medium tracking-[-0.005em] text-ink-soft shadow-[0_1px_2px_rgba(40,25,15,0.04),0_10px_24px_-18px_rgba(40,25,15,0.28)]">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
              />
              {c.advisorsLabel}
            </p>
            {/* Deliberately `lg:grid-cols-4` — the same column and gap
                classes as the leaders grid above, not a 3-up grid sized to
                fit three people. Both <ul>s are block-level children of
                the same `container-page` measure with no horizontal
                padding of their own, so identical classes resolve to
                identical column widths, and each advisor lands directly
                beneath the leader above them. Three advisors on four
                columns leaves the fourth cell empty by nature — there is
                no placeholder card or spacer <li>, and none should be
                added: an empty grid cell is exactly the intent. */}
            <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-28">
              {advisors.map((a, i) => (
                <PersonCard
                  key={a.name}
                  person={a}
                  rank="advisor"
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
  rank,
  style,
}: {
  person: Person;
  /** Which row this card belongs to. Named `rank`, not `size`, because it
   *  no longer changes any dimension — leaders and advisors render at the
   *  same portrait size and on the same grid column. All it still selects
   *  is the type treatment for the name, role, and bio measure, which is
   *  the whole reason the distinction is worth keeping: it is the only
   *  thing left that says "founding team" versus "board". */
  rank: "lead" | "advisor";
  style: React.CSSProperties;
}) {
  const isLead = rank === "lead";
  return (
    <li style={style} className="flex flex-col">
      {/* Circular avatar rather than a rectangular crop: the supplied
          headshots are circular cutouts on a transparent ground, so a
          rectangular frame would slice the circle and leave transparent
          corners. A round frame matches the source crop exactly.

          `aspect-square w-full` rather than fixed pixel steps, so the
          portrait always fills its grid column exactly and the four
          columns read as one continuous full-width band. Size is owned by
          the grid: change the column count or the gap and the portraits
          follow, with no px values left to drift out of sync.

          That is also how the portraits get sized down without the row
          stopping short of the edges. The 4-up gutter is `lg:gap-x-28`
          (112px), far wider than the 24px used when the cards stack: with
          4W + 3G fixed to the content width, spending more on the gutter
          spends less on each column, so the circles shrink while the band
          still runs edge to edge. Reach for the gutter to resize these,
          not for a width on the portrait.

          RESOLUTION CAVEAT: the source files are 400x400, which was the
          crisp ceiling for the previous 192px step at 2x DPR. Filling the
          column puts these near 294px on a wide screen, so on a retina
          display they are upscaled roughly 1.5x and will read slightly
          soft. That is a limit of the supplied assets, not of the layout —
          the fix is higher-resolution originals, not a smaller frame.

          One size for leaders and advisors alike. The advisors used to
          render two steps smaller, which broke the vertical alignment
          between the two rows and made the board read as a footnote to
          the founding team rather than part of the same people-band.
          Hierarchy between the rows is carried by the type below the
          portrait — serif name and brand-colored role for leaders, plain
          sans for advisors — which is enough of a signal without shrinking
          the faces. */}
      <div
        className="relative aspect-square w-full shrink-0 overflow-hidden rounded-full bg-paper ring-1 ring-ink/[0.06]"
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
      <div className="flex w-full flex-col pt-5 md:pt-6">
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
        <p
          className={`mt-2.5 text-[13.5px] leading-relaxed text-ink-muted ${
            isLead ? "max-w-[30ch]" : "max-w-[32ch]"
          }`}
        >
          {person.bio}
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
