// Partner Solutions — default content for the bundled-solutions showcase.
// Consumed by:
//   • app/partner-solutions/page.tsx                  — the landing page
//   • components/partnerSolutions/PartnerBundle.tsx   — one section per bundle
//   • components/nav/NavClient.tsx                    — the Solutions menu promo card
//
// These are the DEFAULTS: the page and the Nav both prefer ACF content and fall
// back to these so the UI renders identically when WordPress is empty or down.
//
// The narrative reframes the pitch from "buy AI coaching" to "Chronilogix makes
// your existing product more valuable." Chronilogix stays the subject of every
// resolution; the partner is the surface it extends.
//
// NOTE: distinct from the App Partners *persona* (/solutions/app-partners,
// "embed Chronilogix inside your product"). This is the case-study showcase of
// live bundles.

// Partner-supplied logo. Displayed inside a white chip on busy surfaces so the
// mismatched source backgrounds (transparent PNG, white WEBP, white JPEG) read
// as one consistent set.
export type PartnerLogo = {
  src: string;
  alt: string;
};

// Background-stripped, auto-cropped transparent versions of the supplied logos
// (originals kept alongside in public/partners/) so they sit cleanly on any
// surface with no white box.
export const PARTNER_LOGOS: PartnerLogo[] = [
  { src: "/partners/balance-for-life-logo.png", alt: "Balance for Life" },
  { src: "/partners/medimart-logo.png", alt: "Medimart" },
  { src: "/partners/hibiscus-health-logo.png", alt: "Hibiscus Health" },
];

export type BundleGraphic = "video" | "list" | "steps";

export type BundleVideo = {
  poster: string;
  src: string;
  runtime: string;
  eyebrow: string;
  title: string;
  blurb: string;
  /** Orange-italic credit line under the caption. */
  credit: string;
};

export type BundleStep = {
  heading: string;
  body: string;
  /** Renders under a light divider as a compact middot list. */
  meta?: string;
};

export type Bundle = {
  /** Stable key; drives the TOC id "ps-<key>-label" and the icon mapping. */
  key: string;
  /** 1-based display number; even values flip the layout (graphic on left). */
  index: number;
  /** "ZENN + Balance for Life" — the bundle title. */
  title: string;
  /** Eyebrow category line. */
  category: string;
  /** Narrative paragraphs at the top of the text column. */
  lead: string[];
  /** Inline description list (bullet rows), shown under the lead. */
  pointers: string[];
  /** Header above the inline list; omit to hide (e.g. when the lead ends in a
   *  colon that already introduces the list). */
  pointersHeading?: string;
  /** Paragraph shown after the inline list (the resolution line). */
  leadAfter?: string;
  /** Brand-italic pull line. Rendered inside the graphic card. */
  tagline: string;
  /** Which graphic fills the other column. */
  graphic: BundleGraphic;
  /** For graphic: "list" — the items rendered (icon rows) inside the card. */
  graphicList?: string[];
  /** Header for the graphic list. */
  graphicHeading?: string;
  /** Optional footnote under the graphic list — a light divider then a small
   *  italic grey line. */
  graphicFootnote?: string;
  /** For graphic: "steps" — staggered blocks (icon · heading · body · meta). */
  graphicSteps?: BundleStep[];
  /** The partner's logo (Chronilogix is the platform, not shown as a logo). */
  logo: PartnerLogo;
  /** For graphic: "video" — the demo thumbnail (same asset as the homepage). */
  video?: BundleVideo;
};

export const BUNDLES: Bundle[] = [
  {
    key: "zenn",
    index: 1,
    title: "ZENN + Balance for Life",
    category: "AI-Powered Behavioral Wellness",
    lead: [
      "Balance for Life provides an excellent wellness platform. ZENN, powered by Chronilogix, provides the continuous behavioral coaching between moments that keeps members engaged.",
      "Instead of opening the app only occasionally, members have a trusted AI coach available 24/7 that remembers their goals, conversations, and progress.",
    ],
    pointers: [
      "Continuous behavioral coaching",
      "Higher member engagement",
      "Increased retention",
      "Better emotional wellbeing",
      "A more valuable wellness platform",
    ],
    pointersHeading: "Together they deliver",
    tagline: "A wellness platform with a coach that never sleeps.",
    graphic: "video",
    logo: PARTNER_LOGOS[0],
    video: {
      poster: "/video/zenn-demo-poster.jpg",
      src: "/video/zenn-demo.mp4",
      runtime: "4:06",
      eyebrow: "Live demo",
      title: "See Chronilogix, white-labeled as Zenn",
      blurb: "Our platform in action, running inside a partner's own app.",
      credit: "ZENN powered by Chronilogix",
    },
  },
  {
    key: "medimart",
    index: 2,
    title: "Medimart + Chronilogix",
    category: "Affordable Medications + Better Outcomes",
    lead: [
      "Getting affordable medications is only half the battle. Patients still need help:",
    ],
    pointers: [
      "Remembering medications",
      "Staying motivated",
      "Changing behaviors",
      "Improving nutrition",
      "Managing diabetes",
      "Coping with anxiety and depression",
    ],
    leadAfter:
      "Together, Medimart and Chronilogix combine affordable medications with free AI coaching for diabetes and mental health, helping patients bridge the gap between receiving a prescription and achieving better health outcomes.",
    tagline: "Lower prescription costs. Better health outcomes.",
    graphic: "list",
    graphicHeading: "With Medimart + Chronilogix",
    graphicFootnote: "Prescriptions that reach the outcome",
    graphicList: [
      "Lower medication costs",
      "Better medication adherence",
      "Diabetes coaching",
      "Mental health support",
      "Improved long-term outcomes",
    ],
    logo: PARTNER_LOGOS[1],
  },
  {
    key: "hibiscus",
    index: 3,
    title: "Hibiscus Health + Chronilogix",
    category: "Screening Meets Sustained Behavior Change",
    lead: [
      "Hibiscus Health helps identify health risks through advanced scanning technology. Chronilogix transforms those insights into personalized action by delivering ongoing AI coaching based on each individual's results, goals, behaviors, and progress.",
      "Instead of receiving a report and being left on their own, members receive continuous support to help them make meaningful lifestyle changes.",
    ],
    pointers: [
      "Early risk identification",
      "Personalized coaching informed by scan results",
      "Chronic disease prevention",
      "Continuous engagement between healthcare visits",
      "Better long-term health outcomes",
    ],
    pointersHeading: "Together they deliver",
    tagline: "Scan. Understand. Improve.",
    graphic: "steps",
    graphicSteps: [
      {
        heading: "Scan",
        body: "Advanced scanning technology flags health risks early — before they surface as claims.",
        meta: "Biomarkers · vitals · risk factors",
      },
      {
        heading: "Understand",
        body: "Chronilogix turns each result into a personalized plan built around the member's goals and behaviors.",
        meta: "Results · goals · progress",
      },
      {
        heading: "Improve",
        body: "Ongoing AI coaching between visits drives meaningful, lasting lifestyle change.",
        meta: "24/7 support · continuous care",
      },
    ],
    logo: PARTNER_LOGOS[2],
  },
];

// Copy for the Partner Solutions promo card in the Solutions nav menu.
export const NAV_CARD_DEFAULTS = {
  title: "Partner Solutions",
  hook: "See how Chronilogix makes existing healthcare products more valuable.",
};
