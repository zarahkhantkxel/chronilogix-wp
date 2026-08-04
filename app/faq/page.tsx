import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CoachLauncher } from "@/components/CoachLauncher";
import { FaqHero } from "@/components/faq/FaqHero";
import { FaqList } from "@/components/faq/FaqList";
import { FaqClosingCta } from "@/components/faq/FaqClosingCta";
import { getPageAcf } from "@/lib/acf";

export const metadata: Metadata = {
  title: "FAQ · Chronilogix",
  description:
    "Plain-language answers to the questions we hear most about Chronilogix — how it works, how care stays safe, how deployment works, and what makes the science defensible.",
};

// ACF returns `false` (not undefined) for an empty repeater, so guard before mapping.
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

export default async function FaqPage() {
  const acf = (await getPageAcf<Record<string, unknown>>("faq")) ?? {};
  const s = acf as Record<string, any>;

  return (
    <>
      <Nav />
      <main className="flex flex-col">
        {/* Padded card shell — same rhythm as About and Product. Each
            section reads as a rounded card on the warm page ground. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <FaqHero
            content={{
              eyebrow: s.hero_eyebrow,
              headingLead: s.hero_heading_lead,
              headingEmph: s.hero_heading_emph,
              body: s.hero_body,
            }}
          />
          <FaqList
            content={{
              groups: arr(s.list_groups).map((g: any) => ({
                key: g.key,
                eyebrow: g.eyebrow,
                heading: g.heading,
                items: arr(g.items).map((it: any) => ({ q: it.q, a: it.a })),
              })),
            }}
          />
          <FaqClosingCta
            content={{
              eyebrow: s.cta_eyebrow,
              headingLead: s.cta_heading_lead,
              headingEmph: s.cta_heading_emph,
              body: s.cta_body,
              primaryLabel: s.cta_primary_label,
              primaryUrl: s.cta_primary_url,
              secondaryLabel: s.cta_secondary_label,
              secondaryUrl: s.cta_secondary_url,
            }}
          />
        </div>
      </main>
      <CoachLauncher />
      <Footer />
    </>
  );
}
