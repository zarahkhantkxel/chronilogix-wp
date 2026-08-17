import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { SectionGuide } from "@/components/widget/SectionGuide";
import { HeroV5 } from "@/components/sections/HeroV5";
import { StatementV5 } from "@/components/sections/StatementV5";
import { MIExplainer } from "@/components/sections/MIExplainer";
import { ProblemV3 } from "@/components/sections/ProblemV3";
import { Solution } from "@/components/sections/Solution";
import { WhoWeServe } from "@/components/sections/WhoWeServe";
import { AetnaProof } from "@/components/sections/CustomerStories";
import { Testimonials } from "@/components/sections/Testimonials";
import { getPageAcf } from "@/lib/acf";

// Home (V1) — the current canonical design. Content is ACF-driven (WordPress
// page slug "home"). Every section component falls back to its built-in copy
// when a field is empty or WordPress is down.
// ACF returns `false` (not undefined) for an empty repeater, so guard every
// collection before mapping.
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

export default async function HomePage() {
  const acf = (await getPageAcf<Record<string, unknown>>("home")) ?? {};
  const s = acf as Record<string, any>;

  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <div className="flex flex-col">
            <HeroV5
              content={{
                headingLead: s.hero_heading_lead,
                headingHighlight1: s.hero_heading_highlight1,
                headingHighlight2: s.hero_heading_highlight2,
                headingItalic: s.hero_heading_italic,
                headingTail: s.hero_heading_tail,
                subtextLead: s.hero_subtext_lead,
                subtextName: s.hero_subtext_name,
                subtextEmphasis: s.hero_subtext_emphasis,
                ctaLabel: s.hero_cta_label,
                ctaUrl: s.hero_cta_url,
                phoneImage: s.hero_phone_image,
                avatarImage: s.hero_avatar_image,
                stats: arr(s.hero_stats).map((r: any) => ({
                  value: r.value,
                  label: r.label,
                })),
                chat: arr(s.hero_chat).map((r: any) => ({
                  who: r.who,
                  text: r.text,
                  time: r.time,
                })),
              }}
            />
            <StatementV5
              content={{
                line1: s.statement_line1,
                line2: s.statement_line2,
                ctaLabel: s.statement_cta_label,
                ctaUrl: s.statement_cta_url,
                bgFull: s.statement_bg_full,
                bgLow: s.statement_bg_low,
              }}
            />
          </div>
          <MIExplainer
            content={{
              heading: s.mi_heading,
              summary: s.mi_summary,
              ctaLabel: s.mi_cta_label,
              ctaUrl: s.mi_cta_url,
              anatomyBadge: s.mi_anatomy_badge,
              avoidsLabel: s.mi_avoids_label,
              avoids: arr(s.mi_avoids).map((r: any) => r.text),
              doesLabel: s.mi_does_label,
              moves: arr(s.mi_moves).map((r: any) => ({ verb: r.verb, desc: r.desc })),
              comparisonBadge: s.mi_comparison_badge,
              coachMessage: s.mi_coach_message,
              memberMessage: s.mi_member_message,
              genericLabel: s.mi_generic_label,
              genericReply: s.mi_generic_reply,
              chronoLabel: s.mi_chrono_label,
              chronoTag: s.mi_chrono_tag,
              chronoReply: s.mi_chrono_reply,
              scienceEyebrow: s.mi_science_eyebrow,
              scienceHeading: s.mi_science_heading,
              scienceHeadingMuted: s.mi_science_heading_muted,
              scienceBody: s.mi_science_body,
              scienceCtaLabel: s.mi_science_cta_label,
              scienceCtaUrl: s.mi_science_cta_url,
              videoPoster: s.mi_video_poster,
              videoSrc: s.mi_video_src,
              videoRole: s.mi_video_role,
              videoName: s.mi_video_name,
            }}
          />
          <Solution
            content={{
              eyebrow: s.solution_eyebrow,
              headingLine1: s.solution_heading_line1,
              headingLine2: s.solution_heading_line2,
              headingMuted: s.solution_heading_muted,
              primaryCtaLabel: s.solution_primary_cta_label,
              secondaryCtaLabel: s.solution_secondary_cta_label,
              secondaryCtaUrl: s.solution_secondary_cta_url,
              agents: arr(s.solution_agents).map((r: any) => ({
                name: r.name,
                condition: r.condition,
                body: r.body,
                topics: Array.isArray(r.topics)
                  ? r.topics.map((t: any) => t.topic).filter(Boolean)
                  : [],
                featuredQ: r.featured_q,
                featuredA: r.featured_a,
                featuredContext: r.featured_context,
                pattern: r.pattern,
                image: r.image,
                haloColor: r.halo_color,
              })),
            }}
          />
        </div>
        <div className="flex flex-col">
          <ProblemV3
            content={{
              imageUrl: s.problem_image,
              imageAlt: s.problem_image_alt,
              headingLead: s.problem_heading_lead,
              headingRest: s.problem_heading_rest,
              para1: s.problem_para1,
              shortageEyebrow: s.problem_shortage_eyebrow,
              para2: s.problem_para2,
              resolution: s.problem_resolution,
              buttonEyebrow: s.problem_button_eyebrow,
              buttonTitle: s.problem_button_title,
              popupEyebrow: s.problem_popup_eyebrow,
              popupHeading: s.problem_popup_heading,
              observations: arr(s.problem_observations).map((o: any) => o.text),
              facts: arr(s.problem_facts).map((f: any) => ({
                lead: f.lead,
                unit: f.unit,
                body: f.body,
                source: f.source,
                waterfall: f.waterfall
                  ? String(f.waterfall)
                      .split("\n")
                      .map((x: string) => x.trim())
                      .filter(Boolean)
                  : undefined,
              })),
            }}
          />
        </div>
        {/* Field proof sits directly beneath the Problem — name the gap,
            then show the evidence that closing it works. Same rounded-card
            layout as the Solution section (two side-by-side proof cards). */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <AetnaProof
            content={{
              eyebrow: s.stories_eyebrow,
              headingLead: s.stories_heading_lead,
              headingMuted: s.stories_heading_muted,
              intro: s.stories_intro,
              proofs: arr(s.stories_proofs).map((r: any) => ({
                logo: r.logo,
                logoAlt: r.logo_alt,
                stat: r.stat,
                statClass: r.stat_class,
                measure: r.measure,
                clause: r.clause,
                source: r.source,
              })),
            }}
          />
        </div>
        <div className="flex flex-col">
          <WhoWeServe
            content={{
              srHeading: s.serve_sr_heading,
              eyebrow: s.serve_eyebrow,
              headingLead: s.serve_heading_lead,
              headingMuted: s.serve_heading_muted,
              body: s.serve_body,
              ctaLabel: s.serve_cta_label,
              ctaUrl: s.serve_cta_url,
              portraitImage: s.serve_portrait_image,
              portraitAlt: s.serve_portrait_alt,
              personas: Array.isArray(s.serve_personas)
                ? s.serve_personas.map((p: any) =>
                    p.kind === "link"
                      ? {
                          kind: "link",
                          key: p.key,
                          label: p.label,
                          intro: p.intro,
                          hook: p.hook,
                          glyph: p.glyph,
                          iconVariant: p.icon_variant,
                          href: p.href,
                          linkLabel: p.link_label,
                          audio: {
                            src: p.audio_src,
                            title: p.audio_title,
                            durationHint: Number(p.audio_duration),
                          },
                        }
                      : {
                          kind: "popup",
                          key: p.key,
                          label: p.label,
                          intro: p.intro,
                          hook: p.hook,
                          glyph: p.glyph,
                          iconVariant: p.icon_variant,
                          headline: [p.headline_lead, p.headline_muted],
                          description: p.description,
                          metrics:
                            Array.isArray(p.metrics) && p.metrics.length
                              ? p.metrics.map((m: any) => ({
                                  lead: m.lead,
                                  caption: m.caption,
                                  comparison: m.comparison,
                                }))
                              : undefined,
                          signals:
                            Array.isArray(p.signals) && p.signals.length
                              ? p.signals.map((g: any) => ({
                                  label: g.label,
                                  body: g.body,
                                }))
                              : undefined,
                        },
                  )
                : undefined,
            }}
          />
        </div>
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          {/* Member voices close the page. */}
          <div className="flex flex-col overflow-hidden rounded-[28px]">
            <Testimonials
              content={{
                heading: s.testimonials_heading,
                items: arr(s.testimonials_items).map((it: any) => ({
                  name: it.name,
                  quote: it.quote,
                  avatar: it.avatar,
                })),
              }}
            />
          </div>
        </div>
      </main>
      <Footer />

      <SectionGuide />

    </>
  );
}
