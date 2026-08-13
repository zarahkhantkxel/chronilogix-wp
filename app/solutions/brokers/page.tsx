import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { BrokersHero } from "@/components/solutions/brokers/BrokersHero";
import { BrokersReality } from "@/components/solutions/brokers/BrokersReality";
import { BrokersStrategy } from "@/components/solutions/brokers/BrokersStrategy";
import { BrokersMemberExperience } from "@/components/solutions/brokers/BrokersMemberExperience";
import { BrokersWhyItWorks } from "@/components/solutions/brokers/BrokersWhyItWorks";
import { BrokersAdvantage } from "@/components/solutions/brokers/BrokersAdvantage";
import { BrokersClosingCTA } from "@/components/solutions/brokers/BrokersClosingCTA";
import {
  BrokersAudioProvider,
  BrokersStickyAudio,
} from "@/components/solutions/brokers/brokersAudio";
import { getPageAcf } from "@/lib/acf";
import { PageNav, type TocItem } from "@/components/widget/pageNav";

// "On this page" wayfinder, keyed to the broker narrative arc.
const BROKERS_TOC: TocItem[] = [
  { id: null, label: "Overview" },
  { id: "brokers-reality-label", label: "The reality" },
  { id: "brokers-strategy-label", label: "The strategy" },
  { id: "how-it-works", label: "How it works" },
  { id: "brokers-why-label", label: "Why it works" },
  { id: "brokers-advantage-label", label: "For brokers" },
  { id: "book-a-demo", label: "Book a demo" },
];

export const metadata: Metadata = {
  title: "Brokers · Chronilogix",
  description:
    "Help your self-funded clients reduce healthcare costs before claims escalate. Chronilogix gives benefits brokers a proactive, AI-powered coaching strategy that addresses chronic conditions, behavioral health, and delayed care at the root — not just another point solution.",
};

// ACF returns `false` (not undefined) for an empty repeater, so guard every
// collection before mapping.
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

export default async function BrokersPage() {
  const s = (await getPageAcf<Record<string, any>>("solutions-brokers")) ?? {};

  return (
    <>
      <PageLoader />
      <Nav />
      <BrokersAudioProvider
        content={{
          audioSrc: s.audio_src,
          trackTitle: s.audio_track_title,
          trackSubtitle: s.audio_track_subtitle,
          transcript: arr(s.audio_transcript).map((r: any) => ({
            t: Number(r.t),
            text: r.text,
          })),
        }}
      >
      <main className="flex flex-col">
        {/* Single padded card system — same rhythm as /about, /solutions/*
            and the home shell. Every section is a rounded card sitting on
            the outer paper surface; the dark slabs live inside this same
            padded group so they read as rounded dark cards, not full-bleed
            interruptions.

            Section order follows the broker narrative arc — why should I
            care? what's causing the problem? why don't current solutions
            work? how does Chronilogix solve it? why is it good for me?
            why should I book a demo?

              1. Hero               — the cost problem, not the product
              2. The Reality        — what's causing the problem
              3. Strategy           — introducing Chronilogix (front door)
              4. Member experience  — meet Roni AI
              5. Why it works       — the business impact for employers
              6. Advantage          — what it means for the broker (payoff)
              7. Closing CTA        — book a demo
        */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <BrokersHero
            content={{
              eyebrow: s.hero_eyebrow,
              headlineLead: s.hero_headline_lead,
              headlineHero: s.hero_headline_hero,
              intro: s.hero_intro,
              ctaLabel: s.hero_cta_label,
              ctaUrl: s.hero_cta_url,
            }}
          />
          <BrokersReality
            content={{
              eyebrow: s.reality_eyebrow,
              headingLead: s.reality_heading_lead,
              headingEmph: s.reality_heading_emph,
              intro: s.reality_intro,
              pressures: arr(s.reality_pressures).map((r: any) => ({
                title: r.title,
                detail: r.detail,
                image: r.image,
                alt: r.alt,
              })),
              closingLead: s.reality_closing_lead,
              closingEmph: s.reality_closing_emph,
            }}
          />
          <BrokersStrategy
            content={{
              eyebrow: s.strategy_eyebrow,
              headingLead: s.strategy_heading_lead,
              headingEmph: s.strategy_heading_emph,
              intro: s.strategy_intro,
              image: s.strategy_image,
              imageAlt: s.strategy_image_alt,
              stats: arr(s.strategy_stats).map((r: any) => ({
                value: r.value,
                caption: r.caption,
              })),
              footerTitle: s.strategy_footer_title,
              footerSubtitle: s.strategy_footer_subtitle,
            }}
          />
          <BrokersMemberExperience
            content={{
              heading: s.member_heading,
              body: s.member_body,
              pivotLead: s.member_pivot_lead,
              pivotEmph: s.member_pivot_emph,
              tags: arr(s.member_tags).map((r: any) => r.label),
            }}
          />
          <BrokersWhyItWorks
            content={{
              eyebrow: s.why_eyebrow,
              headingLead: s.why_heading_lead,
              headingEmph: s.why_heading_emph,
              aside: s.why_aside,
              cards: arr(s.why_cards).map((r: any) => ({
                title: r.title,
                body: r.body,
              })),
            }}
          />
          <BrokersAdvantage
            content={{
              eyebrow: s.advantage_eyebrow,
              headingLead: s.advantage_heading_lead,
              headingEmph: s.advantage_heading_emph,
              intro: s.advantage_intro,
              payoffs: arr(s.advantage_payoffs).map((r: any) => ({
                title: r.title,
                body: r.body,
              })),
            }}
          />
          <BrokersClosingCTA
            content={{
              headingLine1: s.cta_heading_line1,
              headingLine2: s.cta_heading_line2,
              body: s.cta_body,
              primaryLabel: s.cta_primary_label,
              primaryUrl: s.cta_primary_url,
              secondaryLabel: s.cta_secondary_label,
              secondaryUrl: s.cta_secondary_url,
              signoff: s.cta_signoff,
              carousel: arr(s.cta_carousel).map((r: any) => r.image),
            }}
          />
        </div>
      </main>

      {/* Full-width sticky player, revealed when the hero's Play Now is
          pressed; keeps playing across scroll. */}
      <BrokersStickyAudio />
      </BrokersAudioProvider>

      {/* "On this page" wayfinder, keyed to this page's sections. */}
      <PageNav
        items={BROKERS_TOC}
        revealId="brokers-reality-label"
        navLabel="Broker page sections"
      />

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
    </>
  );
}
