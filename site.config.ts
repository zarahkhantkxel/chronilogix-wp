type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
};

// site_domain is not cosmetic: it is the base for every absolute URL in
// sitemap.xml, robots.txt and the OpenGraph/canonical metadata built from
// metadataBase. Left at the starter's value, the published sitemap advertised
// fifteen URLs on next-wp.com — a domain this project does not own — and none
// of the real pages.
export const siteConfig: SiteConfig = {
  site_name: "Chronilogix",
  site_description:
    "Clinical grade AI coaching for behavioral health and chronic care.",
  site_domain: "https://chronilogix.com",
};

// Destination for every "Book a Demo" CTA across the site. Single source of
// truth so the scheduling link changes in one place.
export const DEMO_BOOKING_URL = "https://calendly.com/stevenamiel";
