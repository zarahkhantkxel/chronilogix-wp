import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CoreCapabilities } from "@/components/sections/CoreCapabilities";
import { HiwHero } from "@/components/howItWorks/HiwHero";
import { HiwAgents } from "@/components/howItWorks/HiwAgents";
// Hidden for now — restore by un-commenting the import and the <HiwMethod /> render below.
// import { HiwMethod } from "@/components/howItWorks/HiwMethod";
import { HiwReply } from "@/components/howItWorks/HiwReply";
// HiwSession (the four-stage Onboarding → Daily → Goal → Reporting walkthrough)
// is preserved on disk for easy revert, but the product page now uses HiwReply —
// a single-moment dissection of how a Chronilogix reply gets made — in its place.
// Hidden for now — restore by un-commenting the import and the <HiwConsistency /> render below.
// import { HiwConsistency } from "@/components/howItWorks/HiwConsistency";
import { HiwAudience } from "@/components/howItWorks/HiwAudience";
// Hidden for now — restore by un-commenting the import and the <HiwFeel /> render below.
// import { HiwFeel } from "@/components/howItWorks/HiwFeel";
import { HiwIntegration } from "@/components/howItWorks/HiwIntegration";
import { HiwPlatform } from "@/components/howItWorks/HiwPlatform";
import { PageNav, type TocItem } from "@/components/widget/pageNav";
import { getPageAcf } from "@/lib/acf";

// "On this page" wayfinder — traces the product arc a buyer scans:
// overview → the reply close-up → the two coaches → capabilities → who it's
// for → deployment → platform.
const PRODUCT_TOC: TocItem[] = [
  { id: null, label: "Overview" },
  { id: "reply", label: "The reply" },
  { id: "agents", label: "The coaches" },
  { id: "capabilities", label: "Capabilities" },
  { id: "audience", label: "Who it's for" },
  { id: "integration", label: "Integration" },
  { id: "platform", label: "Platform" },
];

export const metadata: Metadata = {
  title: "Product · Chronilogix",
  description:
    "Two coaches built on thirty years of Motivational Interviewing. Roni for chronic care, Millie for mental health. How Chronilogix turns Dr. Ken Resnicow's life's work into a 24/7 AI coaching platform.",
};

// ACF returns `false` (not undefined) for an empty repeater, so guard every
// collection before mapping.
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

/**
 * Product page.
 *
 * Narrative arc:
 *   Tier 1 — Hero + Agents (rounded, gapped). The two coaches and what
 *     they each do, surfaced before the visitor has to scroll for them.
 *   Tier 2 — Method → Session → Consistency → Audience → Feel
 *     (full-bleed, interlinked). The deep argument: why it works,
 *     how a session unfolds, why AI delivers it consistently, who the
 *     system is for, and what it actually feels like to use.
 *   Tier 3 — CoreCapabilities + ClosingCTA (rounded, gapped). The
 *     platform capability summary lifted from the homepage, then the
 *     closing call to action.
 */
export default async function ProductPage() {
  const s = (await getPageAcf<Record<string, any>>("product")) ?? {};

  return (
    <>
      <Nav />
      <main className="flex flex-col">
        {/* Tier 1 — opening: rounded, gapped, matches the home shell.
            HiwReply sits second so the buyer sees the close-up proof of
            one Chronilogix reply right after the hero, before the deeper
            coach + capability material. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <HiwHero
            content={{
              subheadline: s.hero_subheadline,
              headlineLines: arr(s.hero_headline_lines).map((r: any) => ({
                text: r.text,
                tone: r.tone,
              })),
              agents: arr(s.hero_agents).map((r: any) => ({
                name: r.name,
                role: r.role,
                avatar: r.avatar,
                ctaHref: r.cta_href,
              })),
            }}
          />
          <HiwReply
            content={{
              headingLead: s.reply_heading_lead,
              headingEmph: s.reply_heading_emph,
              dissectionEyebrow: s.reply_dissection_eyebrow,
              memberViewEyebrow: s.reply_member_view_eyebrow,
              memberName: s.reply_member_name,
              memberMessage: s.reply_member_message,
              coachName: s.reply_coach_name,
              coachAvatar: s.reply_coach_avatar,
              coachReply: s.reply_coach_reply,
              thinkingLabel: s.reply_thinking_label,
              reasoningRows: arr(s.reply_reasoning_rows).map((r: any) => ({
                label: r.label,
                value: r.value,
              })),
              mockupImage: s.reply_mockup_image,
              mockupAlt: s.reply_mockup_alt,
            }}
          />
          <HiwAgents
            content={{
              eyebrow: s.agents_eyebrow,
              headingLead: s.agents_heading_lead,
              headingMuted: s.agents_heading_muted,
              paragraph1: s.agents_paragraph1,
              paragraph2: s.agents_paragraph2,
            }}
          />
          <CoreCapabilities
            content={{
              headingLead: s.caps_heading_lead,
              headingEmph: s.caps_heading_emph,
              intro: s.caps_intro,
              blocks: arr(s.caps_blocks).map((r: any) => ({
                eyebrow: r.eyebrow,
                heading: r.heading,
              })),
              privacyEyebrow: s.caps_privacy_eyebrow,
              privacyHeadingLead: s.caps_privacy_heading_lead,
              privacyHeadingEmph: s.caps_privacy_heading_emph,
              trustPillars: arr(s.caps_trust_pillars).map((r: any) => ({
                title: r.title,
                body: r.body,
              })),
            }}
          />
        </div>

        {/* Tier 2 — the argument: full-bleed, no gaps. */}
        <div className="flex flex-col">
          <HiwAudience
            content={{
              srHeading: s.audience_sr_heading,
              profiles: arr(s.audience_profiles).map((r: any) => ({
                label: r.label,
                intro: r.intro,
                headline: [r.headline1, r.headline2] as [string, string],
                description: r.description,
                extendedLabel: r.extended_label || undefined,
                extended: r.extended || undefined,
                pull:
                  r.pull_lead || r.pull_caption
                    ? { lead: r.pull_lead, caption: r.pull_caption }
                    : undefined,
              })),
            }}
          />
        </div>

        {/* Tier 3 — deployment + platform: rounded, gapped. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <HiwIntegration
            content={{
              headingLead: s.integration_heading_lead,
              headingMuted: s.integration_heading_muted,
              intro: s.integration_intro,
              paths: arr(s.integration_paths).map((r: any) => ({
                index: r.index,
                label: r.label,
                heading: r.heading,
                body: r.body,
              })),
              infraLabel: s.integration_infra_label,
              infraText: s.integration_infra_text,
            }}
          />
          <HiwPlatform
            content={{
              headingLead: s.platform_heading_lead,
              headingMuted: s.platform_heading_muted,
              intro: s.platform_intro,
              rows: arr(s.platform_rows).map((r: any) => ({
                eyebrow: r.eyebrow,
                heading: r.heading,
              })),
              modules: arr(s.platform_modules).map((r: any) => ({
                name: r.name,
                domain: r.domain,
              })),
            }}
          />
        </div>
      </main>
      <Footer />
      <PageNav items={PRODUCT_TOC} revealId="reply" navLabel="Product sections" />
    </>
  );
}
