import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LegalCrossLink } from "@/components/legal/LegalCrossLink";
import { PRIVACY_DOC, LEGAL_CONTACT } from "@/components/legal/legal-content";
import { getPageAcf, withAcfDefaults } from "@/lib/acf";

export const metadata: Metadata = {
  title: "Privacy Policy · Chronilogix",
  description:
    "How Chronilogix collects, uses, stores, processes, and protects your information — what we collect, why, who we share it with, how long we keep it, and the rights you hold over it.",
};

export default async function PrivacyPage() {
  // Only the hero and contact fields are ACF-managed. The clause body stays in
  // legal-content.ts on purpose: it is counsel-reviewed copy whose typed block
  // structure (conspicuous notices, definition lists, lettered subsections with
  // their own anchors) has no faithful ACF representation, and a WYSIWYG would
  // let a clause be reworded without review. See docs/legal-open-items.md.
  // "privacy", not "privacy-policy": this is the WordPress post_name, which
  // was deliberately left alone when the public route was renamed. The ACF
  // field group's location rule matches on that slug too, so changing one
  // without the other blanks every field on this page.
  const acf = await getPageAcf<Record<string, string>>("privacy");
  const c = withAcfDefaults(
    {
      eyebrow: PRIVACY_DOC.eyebrow,
      title: PRIVACY_DOC.title,
      titleTail: PRIVACY_DOC.titleTail,
      intro: PRIVACY_DOC.intro,
      updated: PRIVACY_DOC.updated,
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
            sections={PRIVACY_DOC.sections}
            contactEmail={c.contactEmail}
            preamble={PRIVACY_DOC.preamble}
          />
          <LegalCrossLink
            companionHref="/terms-and-conditions"
            companionLabel="Terms & Conditions"
            companionBlurb="The agreement governing your use of Chronilogix — including the medical and crisis disclaimers, the arbitration clause, and the class action waiver."
            contactEmail={c.contactEmail}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
