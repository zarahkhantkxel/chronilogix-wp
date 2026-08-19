import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { HashLanding } from "@/components/HashLanding";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutScience } from "@/components/about/AboutScience";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutPurpose } from "@/components/about/AboutPurpose";
import { AboutClosingCTA } from "@/components/about/AboutClosingCTA";
import { PageNav, type TocItem } from "@/components/widget/pageNav";
import { getPageAcf } from "@/lib/acf";

// "On this page" wayfinder, keyed to the about page's own sections.
const ABOUT_TOC: TocItem[] = [
  { id: "team", label: "Team" },
  { id: "science", label: "The science" },
  { id: "values", label: "Mission" },
  { id: "timeline", label: "Timeline" },
  { id: "purpose", label: "Purpose" },
  { id: "get-in-touch", label: "Get in touch" },
];

export const metadata: Metadata = {
  title: "About · Chronilogix",
  description:
    "Chronilogix is the AI native behavioral health and chronic care coaching platform built on Dr. Ken Resnicow's three decades of Motivational Interviewing research. Meet the team and the mission behind the work.",
};

// ACF returns `false` (not undefined) for an empty repeater, so guard every
// collection before mapping.
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

export default async function AboutPage() {
  const acf = (await getPageAcf<Record<string, unknown>>("about")) ?? {};
  const s = acf as Record<string, any>;

  return (
    <>
      <PageLoader />
      {/* This page is a deep-link destination — the home page's "About Dr.
          Resnicow" CTA points at /about#science. The image-heavy team grid
          above that anchor keeps moving for a few hundred ms after first
          paint, so the browser's own load-time fragment scroll gets abandoned
          and the visitor lands at the top. HashLanding waits for the layout to
          settle and puts them where they asked to be. Renders nothing. */}
      <HashLanding />
      <Nav />
      <main className="flex flex-col">
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <AboutTeam
            content={{
              headingLead: s.team_heading_lead,
              headingMuted: s.team_heading_muted,
              intro: s.team_intro,
              advisorsLabel: s.team_advisors_label,
              // `role` is the short title, `bio` the sentence(s) of standing
              // beneath it. Both render, so an ACF row with no bio field falls
              // back to an empty string rather than dropping the whole person.
              leaders: arr(s.team_leaders).map((r: any) => ({
                name: r.name,
                role: r.role,
                bio: r.bio ?? "",
                photo: r.photo,
                more:
                  r.more_href || r.more_label
                    ? { href: r.more_href, label: r.more_label }
                    : undefined,
              })),
              advisors: arr(s.team_advisors).map((r: any) => ({
                name: r.name,
                role: r.role,
                bio: r.bio ?? "",
                photo: r.photo,
              })),
            }}
          />
          <AboutScience
            content={{
              eyebrow: s.science_eyebrow,
              headingLine1: s.science_heading_line1,
              headingLine2: s.science_heading_line2,
              prose: s.science_prose,
              aetnaQuote: s.science_aetna_quote,
              metrics: arr(s.science_metrics).map((r: any) => ({
                value: r.value,
                label: r.label,
                sub: r.sub,
              })),
              deployments: arr(s.science_deployments).map((r: any) => r.name),
              portraitImage: s.science_portrait_image,
              portraitName: s.science_portrait_name,
              portraitRole: s.science_portrait_role,
              portraitInstitution1: s.science_portrait_institution1,
              portraitInstitution2: s.science_portrait_institution2,
              blogLabel: s.science_blog_label,
              blogAllLabel: s.science_blog_all_label,
              blogAllHref: s.science_blog_all_href,
              blogCards: arr(s.science_blog_cards).map((r: any) => ({
                title: r.title,
                byline: r.byline,
                href: r.href,
              })),
            }}
          />
          <AboutMission
            content={{
              eyebrow: s.mission_eyebrow,
              headingLead: s.mission_heading_lead,
              headingEmph: s.mission_heading_emph,
              intro: s.mission_intro,
              values: arr(s.mission_values).map((r: any) => ({
                label: r.label,
                body: r.body,
              })),
            }}
          />
          <AboutTimeline
            content={{
              eyebrow: s.timeline_eyebrow,
              headingLead: s.timeline_heading_lead,
              headingMuted: s.timeline_heading_muted,
              intro: s.timeline_intro,
              milestones: arr(s.timeline_milestones).map((r: any) => ({
                era: r.era,
                title: r.title,
                body: r.body,
              })),
            }}
          />
          <AboutPurpose
            content={{
              eyebrow: s.purpose_eyebrow,
              headingLead: s.purpose_heading_lead,
              headingEmph: s.purpose_heading_emph,
              intro1: s.purpose_intro1,
              intro2: s.purpose_intro2,
              intro3: s.purpose_intro3,
              personas: arr(s.purpose_personas).map((r: any) => ({
                lead: r.lead,
                rest: r.rest,
              })),
              reason: s.purpose_reason,
              italicLine: s.purpose_italic_line,
              closing1: s.purpose_closing1,
              closing2: s.purpose_closing2,
              quote: s.purpose_quote,
            }}
          />
          <AboutClosingCTA
            content={{
              headingLead: s.cta_heading_lead,
              headingEmph: s.cta_heading_emph,
              body: s.cta_body,
              primaryLabel: s.cta_primary_label,
              primaryUrl: s.cta_primary_url,
              secondaryLabel: s.cta_secondary_label,
              secondaryUrl: s.cta_secondary_url,
              contactIntro: s.cta_contact_intro,
              contactName: s.cta_contact_name,
              contactRole: s.cta_contact_role,
              contactEmail: s.cta_contact_email,
              contactPhone: s.cta_contact_phone,
              contactPhoneHref: s.cta_contact_phone_href,
              legalLinks: arr(s.cta_legal_links).map((r: any) => ({
                href: r.href,
                label: r.label,
              })),
            }}
          />
        </div>
      </main>

      {/* "On this page" wayfinder, keyed to this page's own section anchors. */}
      <PageNav items={ABOUT_TOC} revealId="science" navLabel="About sections" />

    </>
  );
}
