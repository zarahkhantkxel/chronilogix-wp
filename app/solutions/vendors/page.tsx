import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { CoachLauncher } from "@/components/CoachLauncher";
import {
  VendorsAudioProvider,
  VendorsStickyAudio,
} from "@/components/solutions/vendors/vendorsAudio";
import { VendorsHero } from "@/components/solutions/vendors/VendorsHero";
import { VendorsAfterDelivery } from "@/components/solutions/vendors/VendorsAfterDelivery";
import { VendorsUpgrade } from "@/components/solutions/vendors/VendorsUpgrade";
import { VendorsProgramGap } from "@/components/solutions/vendors/VendorsProgramGap";
import { VendorsBehaviorGap } from "@/components/solutions/vendors/VendorsBehaviorGap";
import { VendorsImpact } from "@/components/solutions/vendors/VendorsImpact";
import { VendorsReposition } from "@/components/solutions/vendors/VendorsReposition";
import { VendorsClosingCTA } from "@/components/solutions/vendors/VendorsClosingCTA";
import { getPageAcf } from "@/lib/acf";
import { PageNav, type TocItem } from "@/components/widget/pageNav";

// "On this page" wayfinder, keyed to the vendor narrative arc.
const VENDORS_TOC: TocItem[] = [
  { id: null, label: "Overview" },
  { id: "vendors-after-delivery-label", label: "After delivery" },
  { id: "vendors-upgrade-label", label: "The upgrade" },
  { id: "vendors-program-gap-label", label: "Meet Roni" },
  { id: "vendors-gap-label", label: "The gap" },
  { id: "vendors-impact-label", label: "Impact" },
  { id: "vendors-reposition-label", label: "Reposition" },
  { id: "book-a-demo", label: "Book a demo" },
];

export const metadata: Metadata = {
  title: "Vendors · Chronilogix",
  description:
    "Turn better health benefits into better health outcomes. Chronilogix helps employers, healthcare vendors, health plans, and care providers improve engagement and reduce avoidable healthcare costs through AI-powered behavioral coaching.",
};

// ACF returns `false` (not undefined) for an empty repeater, so guard every
// collection before mapping.
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

/**
 * /solutions/vendors — for chronic-care product vendors: the product
 * ships fine; the challenge is what happens after delivery. The hero's
 * "Play Now" button starts the vendor brief and reveals a full-width
 * sticky player that keeps playing as the visitor scrolls.
 *
 * Section order follows the vendor narrative arc:
 *   1. Hero               — your product works; the challenge is after delivery (+ before/after graph)
 *   2. After Delivery     — the reality vendors face (delivery isn't the finish line)
 *   3. Upgrade            — the turn: Chronilogix is the outcomes upgrade (sits on top)
 *   4. Program Gap        — meet Roni AI (your AI health coach)
 *   5. Behavior Gap       — the behaviour gap (human barriers to adherence)
 *   6. Impact             — the business impact (retention / coaching / cost stats)
 *   7. Reposition         — a better story for buyers (stand out in a crowded market)
 *   8. Closing CTA        — upgrade outcomes without changing your product
 */
export default async function VendorsPage() {
  const s =
    ((await getPageAcf<Record<string, any>>("solutions-vendors")) as Record<
      string,
      any
    >) ?? {};

  return (
    <>
      <PageLoader />
      <Nav />
      <VendorsAudioProvider
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
          {/* Single padded card system — same rhythm as /about,
              /solutions/brokers, /solutions/app-partners. */}
          <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
            <VendorsHero
              content={{
                eyebrow: s.hero_eyebrow,
                headlineLead: s.hero_headline_lead,
                headlineHero: s.hero_headline_hero,
                intro: s.hero_intro,
                ctaLabel: s.hero_cta_label,
                ctaUrl: s.hero_cta_url,
              }}
            />
            <VendorsAfterDelivery
              content={{
                eyebrow: s.after_eyebrow,
                headingLead: s.after_heading_lead,
                headingEmph: s.after_heading_emph,
                body: s.after_body,
                reframeLead: s.after_reframe_lead,
                reframeEmph: s.after_reframe_emph,
                leftLabel: s.after_left_label,
                leftSub: s.after_left_sub,
                rightLabel: s.after_right_label,
                rightSub: s.after_right_sub,
                behaviors: arr(s.after_behaviors).map((r: any) => r.label),
                results: arr(s.after_results).map((r: any) => r.label),
              }}
            />
            <VendorsUpgrade
              content={{
                eyebrow: s.upgrade_eyebrow,
                headingPre: s.upgrade_heading_pre,
                headingEmph: s.upgrade_heading_emph,
                headingPost: s.upgrade_heading_post,
                body: s.upgrade_body,
                properties: arr(s.upgrade_properties).map((r: any) => ({
                  title: r.title,
                  body: r.body,
                })),
              }}
            />
            <VendorsProgramGap
              content={{
                headingLead: s.program_heading_lead,
                headingEmph: s.program_heading_emph,
                body1: s.program_body1,
                body2: s.program_body2,
                pills: arr(s.program_pills).map((r: any) => r.label),
              }}
            />
            <VendorsBehaviorGap
              content={{
                eyebrow: s.behavior_eyebrow,
                headingLead: s.behavior_heading_lead,
                headingEmph: s.behavior_heading_emph,
                body: s.behavior_body,
                image: s.behavior_image,
                imageAlt: s.behavior_image_alt,
                captionLead: s.behavior_caption_lead,
                captionEmph: s.behavior_caption_emph,
                barriers: arr(s.behavior_barriers).map((r: any) => ({
                  title: r.title,
                  body: r.body,
                })),
              }}
            />
            <VendorsImpact
              content={{
                eyebrow: s.impact_eyebrow,
                headingLead: s.impact_heading_lead,
                headingEmph: s.impact_heading_emph,
                body: s.impact_body,
                stats: arr(s.impact_stats).map((r: any) => ({
                  lead: r.lead,
                  title: r.title,
                  body: r.body,
                })),
              }}
            />
            <VendorsReposition
              content={{
                eyebrow: s.reposition_eyebrow,
                headingLead: s.reposition_heading_lead,
                headingEmph: s.reposition_heading_emph,
                body: s.reposition_body,
                leftHeader: s.reposition_left_header,
                rightHeader: s.reposition_right_header,
                reframes: arr(s.reposition_reframes).map((r: any) => ({
                  before: r.before,
                  afterPre: r.after_pre,
                  afterEmph: r.after_emph,
                  afterPost: r.after_post,
                })),
                closingLead: s.reposition_closing_lead,
                closingEmph: s.reposition_closing_emph,
              }}
            />
            <VendorsClosingCTA
              content={{
                eyebrow: s.cta_eyebrow,
                headingLead: s.cta_heading_lead,
                headingEmph: s.cta_heading_emph,
                body: s.cta_body,
                primaryLabel: s.cta_primary_label,
                primaryUrl: s.cta_primary_url,
                secondaryLabel: s.cta_secondary_label,
                secondaryUrl: s.cta_secondary_url,
                carousel: arr(s.cta_carousel).map((r: any) => r.image),
              }}
            />
          </div>
        </main>

        {/* Full-width sticky player, revealed when the hero's Play Now is
            pressed; keeps playing across scroll. */}
        <VendorsStickyAudio />
      </VendorsAudioProvider>

      {/* "On this page" wayfinder, keyed to this page's sections. */}
      <PageNav
        items={VENDORS_TOC}
        revealId="vendors-after-delivery-label"
        navLabel="Vendor page sections"
      />

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
