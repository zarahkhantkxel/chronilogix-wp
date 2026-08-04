import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CoreCapabilities } from "@/components/sections/CoreCapabilities";
import { HiwHero } from "@/components/howItWorks/HiwHero";
import { HiwAgentsV4 } from "@/components/howItWorks/HiwAgentsV4";
import { HiwReply } from "@/components/howItWorks/HiwReply";
import { HiwAudience } from "@/components/howItWorks/HiwAudience";
import { HiwIntegration } from "@/components/howItWorks/HiwIntegration";
import { HiwPlatform } from "@/components/howItWorks/HiwPlatform";
import { getPageAcf } from "@/lib/acf";

export const metadata: Metadata = {
  title: "Product V4 · Chronilogix",
  description:
    "V4 iteration of the product page. Same arc as /product, but the coaches section is reframed around Roni AI as the platform engine — with Roni and Millie surfaced as the two clinical personas Roni powers. Aligns the surface with every source doc that names Roni AI as the single coaching engine.",
};

// ACF returns `false` (not undefined) for an empty repeater, so guard every
// collection before mapping.
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

/**
 * Product page — V4 iteration.
 *
 * Mirrors /product exactly, except the coaches section swaps
 * `<HiwAgents />` for `<HiwAgentsV4 />`. That single swap reconciles the
 * gap between the site (two named coaches: Roni + Millie) and every
 * source doc (single engine: Roni AI). V4 frames Roni AI as the
 * umbrella engine, then presents Roni + Millie as the two clinical
 * personas Roni powers.
 *
 * Nothing else about the arc changes:
 *   Tier 1 — HiwHero → HiwReply → HiwAgentsV4 → CoreCapabilities.
 *   Tier 2 — HiwAudience.
 *   Tier 3 — HiwIntegration → HiwPlatform.
 *
 * If the V4 direction is approved, the main /product page can adopt it
 * with a single import swap.
 */
export default async function ProductPageV4() {
  const s = (await getPageAcf<Record<string, any>>("product-v4")) ?? {};

  return (
    <>
      <Nav />
      <main className="flex flex-col">
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <HiwHero
            content={{
              subheadline: s.v4hero_subheadline,
              headlineLines: arr(s.v4hero_headline_lines).map((r: any) => ({
                text: r.text,
                tone: r.tone,
              })),
              agents: arr(s.v4hero_agents).map((r: any) => ({
                name: r.name,
                role: r.role,
                avatar: r.avatar,
                ctaHref: r.cta_href,
              })),
            }}
          />
          <HiwReply
            content={{
              headingLead: s.v4reply_heading_lead,
              headingEmph: s.v4reply_heading_emph,
              dissectionEyebrow: s.v4reply_dissection_eyebrow,
              memberViewEyebrow: s.v4reply_member_view_eyebrow,
              memberName: s.v4reply_member_name,
              memberMessage: s.v4reply_member_message,
              coachName: s.v4reply_coach_name,
              coachAvatar: s.v4reply_coach_avatar,
              coachReply: s.v4reply_coach_reply,
              thinkingLabel: s.v4reply_thinking_label,
              reasoningRows: arr(s.v4reply_reasoning_rows).map((r: any) => ({
                label: r.label,
                value: r.value,
              })),
              mockupImage: s.v4reply_mockup_image,
              mockupAlt: s.v4reply_mockup_alt,
            }}
          />
          <HiwAgentsV4
            content={{
              eyebrow: s.agentsv4_eyebrow,
              headingLead: s.agentsv4_heading_lead,
              headingMuted: s.agentsv4_heading_muted,
              intro: s.agentsv4_intro || undefined,
              engineLabel: s.agentsv4_engine_label,
              engineName: s.agentsv4_engine_name,
              engineNameSuffix: s.agentsv4_engine_name_suffix,
              engineBody: s.agentsv4_engine_body || undefined,
              engineStats: arr(s.agentsv4_engine_stats).map((r: any) => ({
                lead: r.lead,
                label: r.label,
              })),
              personaIntro: s.agentsv4_persona_intro,
              personas: arr(s.agentsv4_personas).map((r: any) => ({
                name: r.name,
                role: r.role,
                scope: r.scope,
                avatar: r.avatar,
                memberLine: r.member_line,
                coachReply: r.coach_reply,
                capabilities: arr(r.capabilities).map((c: any) => c.value),
              })),
              handoff: s.agentsv4_handoff || undefined,
            }}
          />
          <CoreCapabilities
            content={{
              headingLead: s.v4caps_heading_lead,
              headingEmph: s.v4caps_heading_emph,
              intro: s.v4caps_intro,
              blocks: arr(s.v4caps_blocks).map((r: any) => ({
                eyebrow: r.eyebrow,
                heading: r.heading,
              })),
              privacyEyebrow: s.v4caps_privacy_eyebrow,
              privacyHeadingLead: s.v4caps_privacy_heading_lead,
              privacyHeadingEmph: s.v4caps_privacy_heading_emph,
              trustPillars: arr(s.v4caps_trust_pillars).map((r: any) => ({
                title: r.title,
                body: r.body,
              })),
            }}
          />
        </div>

        <div className="flex flex-col">
          <HiwAudience
            content={{
              srHeading: s.v4audience_sr_heading,
              profiles: arr(s.v4audience_profiles).map((r: any) => ({
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

        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <HiwIntegration
            content={{
              headingLead: s.v4integration_heading_lead,
              headingMuted: s.v4integration_heading_muted,
              intro: s.v4integration_intro,
              paths: arr(s.v4integration_paths).map((r: any) => ({
                index: r.index,
                label: r.label,
                heading: r.heading,
                body: r.body,
              })),
              infraLabel: s.v4integration_infra_label,
              infraText: s.v4integration_infra_text,
            }}
          />
          <HiwPlatform
            content={{
              headingLead: s.v4platform_heading_lead,
              headingMuted: s.v4platform_heading_muted,
              intro: s.v4platform_intro,
              rows: arr(s.v4platform_rows).map((r: any) => ({
                eyebrow: r.eyebrow,
                heading: r.heading,
              })),
              modules: arr(s.v4platform_modules).map((r: any) => ({
                name: r.name,
                domain: r.domain,
              })),
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
