import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LegalCrossLink } from "@/components/legal/LegalCrossLink";
import { TERMS_DOC, LEGAL_CONTACT } from "@/components/legal/legal-content";
import { getPageAcf, withAcfDefaults } from "@/lib/acf";

export const metadata: Metadata = {
  title: "Terms & Conditions · Chronilogix",
  description:
    "The agreement between you and Chronilogix, Inc. governing your use of the Service — including medical and crisis disclaimers, intellectual property, subscription terms, and dispute resolution.",
};

export default async function TermsPage() {
  // Hero and contact fields only — see the note in app/privacy/page.tsx for why
  // the clause body deliberately stays in legal-content.ts.
  const acf = await getPageAcf<Record<string, string>>("terms");
  const c = withAcfDefaults(
    {
      eyebrow: TERMS_DOC.eyebrow,
      title: TERMS_DOC.title,
      titleTail: TERMS_DOC.titleTail,
      intro: TERMS_DOC.intro,
      updated: TERMS_DOC.updated,
      contactEmail: LEGAL_CONTACT,
    },
    {
      eyebrow: acf?.legal_eyebrow,
      title: acf?.legal_title,
      titleTail: acf?.legal_title_tail,
      intro: acf?.legal_intro,
      updated: acf?.legal_updated,
      contactEmail: acf?.legal_contact_email,
    },
  );

  return (
    <>
      <Nav />
      <main className="flex flex-col">
        {/* Padded card shell — same rhythm as FAQ, About, and Product. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <LegalHero
            eyebrow={c.eyebrow}
            title={c.title}
            titleTail={c.titleTail}
            intro={c.intro}
            updated={c.updated}
          />
          <LegalDocument
            sections={TERMS_DOC.sections}
            contactEmail={c.contactEmail}
            preamble={TERMS_DOC.preamble}
          />
          <LegalCrossLink
            companionHref="/privacy"
            companionLabel="Privacy Policy"
            companionBlurb="What we collect, how we use it, who we share it with, how long we keep it, and the data protection rights you can exercise."
            contactEmail={c.contactEmail}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
