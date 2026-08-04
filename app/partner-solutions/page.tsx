import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { Footer } from "@/components/Footer";
import { CoachLauncher } from "@/components/CoachLauncher";
import { PartnerHero } from "@/components/partnerSolutions/PartnerHero";
import { PartnerBundle } from "@/components/partnerSolutions/PartnerBundle";
import { YourSolutionPanel } from "@/components/partnerSolutions/YourSolutionPanel";
import { getPageAcf } from "@/lib/acf";
import {
  buildPartnerToc,
  mapBundles,
  mapPartnerLogos,
} from "@/lib/partnerSolutions";
import { PageNav } from "@/components/widget/pageNav";

export const metadata: Metadata = {
  title: "Partner Solutions · Chronilogix",
  description:
    "Chronilogix doesn't replace your product — it makes it smarter, more engaging, and more effective through continuous AI coaching. See how industry leaders like Balance for Life, Medimart, and Hibiscus Health extend their solutions with Chronilogix.",
};

/**
 * /partner-solutions — the bundled-solutions showcase. Reframes the pitch
 * from "buy AI coaching" to "Chronilogix makes your existing product more
 * valuable," with live partner bundles as light case studies and an open
 * "Your Solution + Chronilogix" invitation to close.
 *
 * Section order:
 *   1. Hero                — Extend Your Solution. Increase Your Value.
 *   2..n. Bundles          — one case study per partner (ACF-driven)
 *   last. Your Solution    — the open invitation + closing CTA (#book-a-demo)
 *
 * The "On this page" wayfinder is derived from the bundles, so adding a
 * partner in WordPress updates it with no code change.
 */
export default async function PartnerSolutionsPage() {
  const s = (await getPageAcf<Record<string, any>>("partner-solutions")) ?? {};

  const bundles = mapBundles(s);
  const toc = buildPartnerToc(bundles);

  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        {/* Single padded card system — same rhythm as /solutions/*. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <PartnerHero
            content={{
              eyebrow: s.hero_eyebrow,
              headingLead: s.hero_heading_lead,
              headingBrand: s.hero_heading_brand,
              intro: s.hero_intro,
              subintro: s.hero_subintro,
              ctaLabel: s.hero_cta_label,
              ctaUrl: s.hero_cta_url,
              logos: mapPartnerLogos(s),
            }}
          />
          {bundles.map((bundle) => (
            <PartnerBundle key={bundle.key} bundle={bundle} />
          ))}
          <YourSolutionPanel
            content={{
              headingBrand: s.closing_heading_brand,
              headingRest: s.closing_heading_rest,
              subLead: s.closing_sub_lead,
              subBrand: s.closing_sub_brand,
              body: s.closing_body,
              bodyBrand: s.closing_body_brand,
              ctaHeadingLead: s.cta_heading_lead,
              ctaHeadingMuted: s.cta_heading_muted,
              ctaBody: s.cta_body,
              ctaLabel: s.cta_label,
              ctaUrl: s.cta_url,
            }}
          />
        </div>
      </main>

      <Footer />

      {/* "On this page" wayfinder, derived from the bundles. */}
      <PageNav
        items={toc}
        revealId={bundles[0] ? `ps-${bundles[0].key}-label` : null}
        navLabel="Partner solutions sections"
      />

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
