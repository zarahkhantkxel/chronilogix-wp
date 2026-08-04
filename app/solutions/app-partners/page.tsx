import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { CoachLauncher } from "@/components/CoachLauncher";
import { AppPartnersHero } from "@/components/solutions/appPartners/AppPartnersHero";
import { AppPartnersProblem } from "@/components/solutions/appPartners/AppPartnersProblem";
import { AppPartnersPillars } from "@/components/solutions/appPartners/AppPartnersPillars";
import { AppPartnersDiagram } from "@/components/solutions/appPartners/AppPartnersDiagram";
import { AppPartnersNumbers } from "@/components/solutions/appPartners/AppPartnersNumbers";
import { AppPartnersDistribution } from "@/components/solutions/appPartners/AppPartnersDistribution";
import { AppPartnersProof } from "@/components/solutions/appPartners/AppPartnersProof";
import { AppPartnersTrust } from "@/components/solutions/appPartners/AppPartnersTrust";
import { AppPartnersFAQ } from "@/components/solutions/appPartners/AppPartnersFAQ";
import { AppPartnersClosingCTA } from "@/components/solutions/appPartners/AppPartnersClosingCTA";
import { getPageAcf } from "@/lib/acf";
import { PageNav, type TocItem } from "@/components/widget/pageNav";

// "On this page" wayfinder, keyed to the app-partner narrative arc.
const APP_PARTNERS_TOC: TocItem[] = [
  { id: null, label: "Overview" },
  { id: "ap-problem-label", label: "The problem" },
  { id: "ap-pillars-label", label: "Pillars" },
  { id: "ap-diagram-label", label: "How it fits" },
  { id: "ap-numbers-label", label: "The numbers" },
  { id: "ap-distro-label", label: "Distribution" },
  { id: "ap-proof-label", label: "Proof" },
  { id: "ap-trust-label", label: "Trust" },
  { id: "ap-faq-label", label: "FAQ" },
  { id: "book-a-demo", label: "Book a demo" },
];

export const metadata: Metadata = {
  title: "App Partners · Chronilogix",
  description:
    "Chronilogix is the clinical coaching intelligence layer built to live inside other products. Embed Dr. Ken Resnicow's thirty years of Motivational Interviewing research inside your wellness app, with no behavioral-science team to hire.",
};

// ACF returns `false` (not undefined) for an empty repeater, so guard every
// collection before mapping.
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

export default async function AppPartnersPage() {
  const s =
    (await getPageAcf<Record<string, any>>("solutions-app-partners")) ?? {};

  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        {/* Single padded card system — same rhythm as /about and
            /solutions/brokers. Every section is a rounded card on the
            outer paper surface; the dark Proof slab sits inside the same
            padded group so it reads as a rounded dark card, not a
            full-bleed interruption. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <AppPartnersHero
            content={{
              eyebrow: s.hero_eyebrow,
              headingBright: s.hero_heading_bright,
              headingMuted: s.hero_heading_muted,
              intro: s.hero_intro,
              primaryLabel: s.hero_primary_label,
              primaryUrl: s.hero_primary_url,
              secondaryLabel: s.hero_secondary_label,
              secondaryUrl: s.hero_secondary_url,
            }}
          />
          <AppPartnersProblem
            content={{
              eyebrow: s.problem_eyebrow,
              headingLead: s.problem_heading_lead,
              headingMuted: s.problem_heading_muted,
              lead: s.problem_lead,
              closing: s.problem_closing,
              roadmapYouHeading: s.problem_roadmap_you_heading,
              roadmapCompetitorHeading: s.problem_roadmap_competitor_heading,
              roadmapYouTickets: arr(s.problem_you_tickets).map((r: any) => ({
                title: r.title,
                priority: r.priority,
                variant: r.variant || undefined,
              })),
              roadmapCompetitorTickets: arr(s.problem_competitor_tickets).map(
                (r: any) => ({
                  title: r.title,
                  priority: r.priority,
                  variant: r.variant || undefined,
                }),
              ),
            }}
          />
          <AppPartnersPillars
            content={{
              eyebrow: s.pillars_eyebrow,
              heading: s.pillars_heading,
              pillars: arr(s.pillars_items).map((r: any) => ({
                title: r.title,
                body: r.body,
              })),
            }}
          />
          <AppPartnersDiagram
            content={{
              eyebrow: s.diagram_eyebrow,
              heading: s.diagram_heading,
              engineTitle: s.diagram_engine_title,
              engineCards: arr(s.diagram_engine_cards).map((r: any) => ({
                title: r.title,
                body: r.body,
              })),
              captions: arr(s.diagram_captions).map((r: any) => ({
                label: r.label,
                body: r.body,
              })),
            }}
          />
          <AppPartnersNumbers
            content={{
              eyebrow: s.numbers_eyebrow,
              heading: s.numbers_heading,
              rangeLabel: s.numbers_range_label,
              footnote: s.numbers_footnote,
              metrics: arr(s.numbers_metrics).map((r: any) => ({
                lead: r.lead,
                caption: r.caption,
                comparison: r.comparison,
              })),
            }}
          />
          <AppPartnersDistribution
            content={{
              eyebrow: s.distribution_eyebrow,
              heading: s.distribution_heading,
              body1: s.distribution_body1,
              body2: s.distribution_body2,
              deals: arr(s.distribution_deals).map((r: any) => ({
                label: r.label,
                caption: r.caption,
              })),
            }}
          />
          <AppPartnersProof
            content={{
              label: s.proof_label,
              quote: s.proof_quote,
              attribution: s.proof_attribution,
              footer: s.proof_footer,
            }}
          />
          <AppPartnersTrust
            content={{
              eyebrow: s.trust_eyebrow,
              heading: s.trust_heading,
              lines: arr(s.trust_lines).map((r: any) => r.line),
              complianceLabel: s.trust_compliance_label,
              complianceBody: s.trust_compliance_body,
            }}
          />
          <AppPartnersFAQ
            content={{
              eyebrow: s.faq_eyebrow,
              heading: s.faq_heading,
              intro: s.faq_intro,
              questions: arr(s.faq_questions).map((r: any) => ({
                q: r.q,
                a: r.a,
              })),
            }}
          />
          <AppPartnersClosingCTA
            content={{
              eyebrow: s.cta_eyebrow,
              headingLead: s.cta_heading_lead,
              headingBrand: s.cta_heading_brand,
              body: s.cta_body,
              primaryLabel: s.cta_primary_label,
              primaryUrl: s.cta_primary_url,
              secondaryLabel: s.cta_secondary_label,
              secondaryUrl: s.cta_secondary_url,
              footer: s.cta_footer,
            }}
          />
        </div>
      </main>

      {/* "On this page" wayfinder, keyed to this page's sections. */}
      <PageNav
        items={APP_PARTNERS_TOC}
        revealId="ap-problem-label"
        navLabel="App partner page sections"
      />

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
