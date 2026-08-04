/**
 * Nav — server shell. The interactive nav lives in
 * `components/nav/NavClient.tsx`; this wrapper exists so the Solutions
 * dropdown's Partner Solutions promo card can render WordPress-managed
 * partner logos while the nav itself stays a client component.
 *
 * The logos and card copy come from the `partner-solutions` page's ACF fields,
 * the same source the /partner-solutions page reads, so the menu card and the
 * page can never drift. `getPageAcf` is graceful (returns null on any failure)
 * and `NavClient` falls back to its built-in defaults, so the nav renders
 * identically when WordPress is empty or unreachable.
 *
 * Every call site renders `<Nav />` from a server component, so an async
 * component composes without changes. The fetch is deduped by the shared
 * 1-hour fetch cache and tagged `acf-partner-solutions`.
 */
import { getPageAcf } from "@/lib/acf";
import { mapPartnerLogos } from "@/lib/partnerSolutions";
import { NavClient } from "@/components/nav/NavClient";

export async function Nav() {
  const s = (await getPageAcf<Record<string, any>>("partner-solutions")) ?? {};

  return (
    <NavClient
      partnerLogos={mapPartnerLogos(s)}
      partnerCard={{
        title: s.nav_card_title,
        hook: s.nav_card_hook,
      }}
    />
  );
}
