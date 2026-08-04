import { SessionWalkthrough } from "@/components/sections/SessionWalkthrough";

/**
 * Product page — experience section.
 *
 * Renders the canonical session walkthrough used on the homepage Solution
 * section (Part 2), inside the product page's own section shell. Keeping
 * the body as a single shared component means tweaks to the four-step
 * treatment land on both pages at once.
 */
export function HiwSession() {
  return (
    <section
      id="session"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40"
    >
      <div className="container-page">
        <SessionWalkthrough hideEyebrow featured />
      </div>
    </section>
  );
}
