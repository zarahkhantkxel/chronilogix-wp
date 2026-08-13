type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
};

export const siteConfig: SiteConfig = {
  site_name: "next-wp",
  site_description: "Starter template for Headless WordPress with Next.js",
  site_domain: "https://next-wp.com",
};

// Destination for every "Book a Demo" CTA across the site. Single source of
// truth so the scheduling link changes in one place.
export const DEMO_BOOKING_URL = "https://calendly.com/stevenamiel";
