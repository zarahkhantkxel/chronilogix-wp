"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  GlyphTile,
  LINK_PERSONAS,
  PersonaDetailPopup,
  type PopupPersona,
  POPUP_PERSONAS,
} from "@/components/personas/personaData";
import {
  NAV_CARD_DEFAULTS,
  PARTNER_LOGOS,
  type PartnerLogo,
} from "@/components/partnerSolutions/partnerData";
import { PartnerLogoChip } from "@/components/partnerSolutions/PartnerLogoChip";

type MenuItem = {
  href: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  // Non-navigating placeholder for personas whose deep-dive pages are on
  // the roadmap but not shipped for the POC. Renders muted with a "Soon"
  // chip and disables the anchor.
  soon?: boolean;
};

type MenuGroup = { heading: string; items: MenuItem[] };

type FeaturedArticle = {
  href: string;
  title: string;
  tag: string;
  readTime: string;
  // Inline gradient stops for the card surface — keeps the component
  // self-contained until real article art is wired up.
  gradient: string;
  eyebrow?: string;
};

type MegaMenu = {
  groups: MenuGroup[];
  featured: { heading: string; articles: FeaturedArticle[] };
};

type NavLink = {
  href: string;
  label: string;
  megaMenu?: MegaMenu;
  // Solutions uses a bespoke panel driven by the shared persona model
  // rather than a generic MegaMenu: sub-page personas on the left,
  // popup personas on the right.
  personaMenu?: boolean;
  // Optional gradient glyph shown before the label — used to make the
  // Solutions tab stand out among the plain-text nav items.
  icon?: ReactNode;
};

// Brand-gradient glyph for the Solutions tab. A 2×2 tile grid ("catalog of
// solutions") filled with the brand orange ramp so the item pops on both the
// light nav surface and the dark hero. Unique gradient id avoids SVG defs
// collisions elsewhere on the page.
const SolutionsIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    aria-hidden
    className="shrink-0"
  >
    <defs>
      <linearGradient id="solutions-nav-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FB9C5E" />
        <stop offset="55%" stopColor="#FF7434" />
        <stop offset="100%" stopColor="#B84614" />
      </linearGradient>
    </defs>
    <g fill="url(#solutions-nav-grad)">
      <rect x="1.5" y="1.5" width="5.6" height="5.6" rx="1.7" />
      <rect x="8.9" y="1.5" width="5.6" height="5.6" rx="1.7" />
      <rect x="1.5" y="8.9" width="5.6" height="5.6" rx="1.7" />
      <rect x="8.9" y="8.9" width="5.6" height="5.6" rx="1.7" />
    </g>
  </svg>
);

// Icon container — small illustration block, taking direct inspiration
// from the MIExplainer process cards and Solution agent cards: a soft
// warm base (cream / peach) with a diffused radial glow, then a milky
// wash reading it as photographic rather than flat. NOT a solid
// saturated orange tile. Three variants distribute across the nine
// icons so the mega-menu reads like a small gallery of illustrations
// rather than a uniform row of chips.
//
// Icon glyphs are filled brand-800 (deep terracotta) — the same warm
// tone we'd use for a chip label — so they read as chapter marks on the
// illustration rather than as UI chrome.

type IconVariant = "peach" | "coral" | "ember";

// Three warm illustration blocks spanning brand-400 → brand-800. Each
// variant keeps the layered radial + linear technique used by the
// MIExplainer visuals — so they still read as small atmospheric
// illustrations rather than flat tiles — but the base palette shifts
// deep enough that white glyphs pop cleanly on all three.
const ICON_BG: Record<IconVariant, string> = {
  // PEACH — lightest of the three. Brand-400 → brand-accent linear, with
  // a deeper terracotta glow rising from the bottom edge (mirrors the
  // Solution AgentCard's "color rises from below" mask).
  peach:
    "radial-gradient(ellipse 70% 85% at 50% 105%, rgba(184,70,20,0.45) 0%, rgba(184,70,20,0) 68%), linear-gradient(180deg, #FB9C5E 0%, #FF7434 100%)",
  // CORAL — mid tone. Brand-accent → brand-700 linear, with a soft
  // peach highlight descending from the top (reads like light resting
  // on the tile).
  coral:
    "radial-gradient(ellipse 65% 70% at 50% -8%, rgba(253,179,125,0.55) 0%, rgba(253,179,125,0) 60%), linear-gradient(180deg, #FF7434 0%, #E45A1C 100%)",
  // EMBER — deepest. Diagonal brand-400 → brand-800 base with two
  // off-axis atmospheric blobs (peach top-left, deep terracotta
  // bottom-right). Mirrors MIExplainer's "blurred pattern + milky
  // wash" but at richer saturation.
  ember:
    "radial-gradient(circle at 28% 32%, rgba(253,179,125,0.5) 0%, rgba(253,179,125,0) 55%), radial-gradient(circle at 74% 74%, rgba(120,40,10,0.42) 0%, rgba(120,40,10,0) 55%), linear-gradient(135deg, #FB9C5E 0%, #B84614 100%)",
};

const Icon = ({
  children,
  variant = "peach",
}: {
  children: ReactNode;
  variant?: IconVariant;
}) => (
  <span
    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_12px_24px_-14px_rgba(184,70,20,0.42)] transition-all duration-200 ease-out-quart group-hover/menuitem:shadow-[0_2px_6px_rgba(15,20,25,0.08),0_16px_30px_-14px_rgba(184,70,20,0.52)] motion-reduce:transition-none"
    style={{ backgroundImage: ICON_BG[variant] }}
  >
    {children}
  </span>
);

// Every glyph is a solid fill in `currentColor` (brand-800) so it reads
// like a chapter mark on the illustration block behind it. Internal
// detail — the play triangle inside a screen, the door on a building,
// the valley between two book pages — uses `fillRule="evenodd"` so the
// warm background gradient shows through the cutouts.
//
// Variants are assigned per icon so the mega-menu reads as three
// distinct illustration types alternating down the list (peach → paper
// → meadow), never two of the same variant back-to-back within a menu.
//
// ── Resources ─────────────────────────────────────────────────────────
// Blog — page with a folded top-right corner. The fold reads at reduced
// opacity so it separates from the page plane.
const DocIcon = (
  <Icon variant="peach">
    <svg viewBox="0 0 20 20" className="h-6 w-6">
      <path
        fill="currentColor"
        d="M6.5 3h4.75L15 6.75V16.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5V3z"
      />
      <path
        fill="currentColor"
        fillOpacity="0.42"
        d="M11.25 3v3.25a.5.5 0 0 0 .5.5H15L11.25 3z"
      />
    </svg>
  </Icon>
);

// Webinars + White Paper are hidden for the POC (see RESOURCES_MENU below).
// Their glyphs are preserved here, commented out, so the two menu items can
// be restored in one step when those resources ship.
//
// Webinars — filled screen with a triangle play button cut out (the
// warm background shows through) and a small stand at the bottom.
// const PlayIcon = (
//   <Icon variant="ember">
//     <svg viewBox="0 0 20 20" className="h-6 w-6">
//       <path
//         fill="currentColor"
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M4 4.5A1 1 0 0 1 5 3.5h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8zm4.5 1.5v5l4.25-2.5L8.5 6z"
//       />
//       <rect x="7" y="15.75" width="6" height="1" rx="0.5" fill="currentColor" />
//     </svg>
//   </Icon>
// );

// White paper — open book: two filled pages meeting at a valley in the
// middle. Each page tapers inward at the top so the spine reads.
// const BookIcon = (
//   <Icon variant="coral">
//     <svg viewBox="0 0 20 20" className="h-6 w-6">
//       <path
//         fill="currentColor"
//         d="M4 4.5h5A1.5 1.5 0 0 1 10 6v10a1.5 1.5 0 0 0-1.5-1.5H4V4.5z"
//       />
//       <path
//         fill="currentColor"
//         d="M16 4.5h-5A1.5 1.5 0 0 0 10 6v10a1.5 1.5 0 0 1 1.5-1.5h4.5V4.5z"
//       />
//     </svg>
//   </Icon>
// );

// Case studies — folder with a raised tab on the top-left. All one
// filled path — the tab lifts the whole folder just above the shelf
// line.
const CaseStudyIcon = (
  <Icon variant="peach">
    <svg viewBox="0 0 20 20" className="h-6 w-6">
      <path
        fill="currentColor"
        d="M3.5 6.5A1 1 0 0 1 4.5 5.5h3.75l1.5 1.5h5.75a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-9.5z"
      />
    </svg>
  </Icon>
);

const RESOURCES_MENU: MegaMenu = {
  groups: [
    {
      heading: "Explore",
      items: [
        { href: "/resources/blog", label: "Blog", description: "Insights, ideas, news", icon: DocIcon },
        // Hidden for the POC — restore alongside the PlayIcon/BookIcon glyphs above.
        // { href: "/resources/webinars", label: "Webinars", description: "Events, demos, discussions", icon: PlayIcon },
        // { href: "/chronilogix-mi-whitepaper.pdf", label: "White Paper", description: "Motivational Interviewing in AI coaches", icon: BookIcon },
        // A single case study for now — points straight at the Aetna story.
        { href: "/case-studies/aetna", label: "Case Studies", description: "How Aetna transformed member engagement", icon: CaseStudyIcon },
      ],
    },
  ],
  featured: {
    heading: "Featured Articles",
    articles: [
      {
        href: "/resources/blog/inside-roni-ai-clinical-grade-coaching-at-scale",
        title: "Inside Roni AI: clinical grade coaching at scale",
        tag: "Insight",
        readTime: "5 min read",
        gradient: "from-[#1F2937] via-[#2C3D55] to-[#3F5572]",
        eyebrow: "Roni AI",
      },
      {
        href: "/resources/blog/motivational-interviewing-engineered-for-every-member",
        title: "Motivational Interviewing, engineered for every member",
        tag: "Research",
        readTime: "4 min read",
        gradient: "from-[#F9904D] via-[#FF7434] to-[#E55A1F]",
        eyebrow: "Method",
      },
    ],
  },
};

const NAV_LINKS: NavLink[] = [
  { href: "/product", label: "Product" },
  { href: "/solutions", label: "Solutions", personaMenu: true, icon: SolutionsIcon },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/resources", label: "Resources", megaMenu: RESOURCES_MENU },
];

export function NavClient({
  partnerLogos,
  partnerCard,
}: {
  partnerLogos?: PartnerLogo[];
  partnerCard?: { title?: string; hook?: string };
}) {
  const logos = partnerLogos?.length ? partnerLogos : PARTNER_LOGOS;
  // Explicit `||` rather than a spread over NAV_CARD_DEFAULTS: the server shell
  // passes keys that may be present-but-undefined, which a spread would keep.
  const card = {
    title: partnerCard?.title || NAV_CARD_DEFAULTS.title,
    hook: partnerCard?.hook || NAV_CARD_DEFAULTS.hook,
  };
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  // Persona popup opened from the Solutions menu (desktop or mobile).
  // Mirrors the WhoWeServe section's popup, driven by the same data.
  const [openPersonaKey, setOpenPersonaKey] = useState<string | null>(null);
  const openPersona = POPUP_PERSONAS.find((p) => p.key === openPersonaKey) ?? null;

  const openPersonaPopup = (key: string) => {
    setOpenMenu(null);
    setOpen(false);
    setOpenPersonaKey(key);
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const dark = document.querySelector<HTMLElement>("[data-nav-tone='dark']");
      if (dark) {
        const r = dark.getBoundingClientRect();
        setOverDark(r.top <= 80 && r.bottom > 80);
      } else {
        setOverDark(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // While the mobile menu is open: lock body scroll, close on Escape, and
  // close automatically if the viewport grows past the desktop breakpoint.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Always use dark-ink styles unless we're explicitly over a dark-toned
  // section (e.g. the AetnaCard, FinalCTA). The hero is now a light pastel
  // surface, so the nav reads as solid from the first paint.
  const solid = !overDark;
  // The mobile menu forces a light surface + dark content regardless of the
  // section behind it, and pins the bar to the very top while open.
  const isSolid = solid || open;

  return (
    <header
      className={`fixed left-0 right-0 z-40 w-full transition-all duration-400 ease-out-quart motion-reduce:transition-none ${
        scrolled || open ? "top-0" : "top-4 md:top-6"
      } ${
        open || (solid && scrolled)
          ? "border-b border-ink/5 bg-paper/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Wider than the site's default container-page (max-w 1240px) so
          the nav breathes on larger monitors, and a taller row height
          gives the links + CTA more vertical whitespace. */}
      <div className="mx-auto grid h-20 w-full max-w-[1440px] grid-cols-3 items-center px-6 md:h-24 md:px-12 lg:px-8 xl:px-20">
        {/* Left: nav links (desktop). Gap tightens at lg so the five links
            fit their grid third without bleeding into the centered logo
            between 1024–1279px; it opens back up to gap-8 at xl. */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 justify-self-start">
          {NAV_LINKS.map((link) => {
            const hasMenu = !!link.megaMenu || !!link.personaMenu;
            const isOpen = openMenu === link.label;
            return (
              <div
                key={link.href}
                className="relative flex items-center"
                onMouseEnter={() => hasMenu && setOpenMenu(link.label)}
                onMouseLeave={() => hasMenu && setOpenMenu(null)}
              >
                {hasMenu ? (
                  <span
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    className={`group/navlink relative inline-flex cursor-default items-center gap-1 bg-transparent p-0 text-sm transition-colors duration-200 ease-out-quart motion-reduce:transition-none ${
                      solid
                        ? "text-ink-soft hover:text-ink"
                        : "text-white/85 hover:text-white"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                    <svg
                      aria-hidden
                      viewBox="0 0 12 12"
                      className={`h-2.5 w-2.5 transition-transform duration-200 ease-out-quart motion-reduce:transition-none ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M2 4.5 6 8.5l4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      aria-hidden
                      className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out-quart group-hover/navlink:scale-x-100 motion-reduce:hidden ${
                        solid ? "bg-ink" : "bg-white"
                      }`}
                    />
                  </span>
                ) : (
                  <a
                    href={link.href}
                    className={`group/navlink relative inline-flex items-center gap-1 text-sm transition-colors duration-200 ease-out-quart motion-reduce:transition-none ${
                      solid
                        ? "text-ink-soft hover:text-ink"
                        : "text-white/85 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out-quart group-hover/navlink:scale-x-100 motion-reduce:hidden ${
                        solid ? "bg-ink" : "bg-white"
                      }`}
                    />
                  </a>
                )}

                {hasMenu && (
                  <div
                    className={`absolute left-0 top-full pt-3 transition-all duration-200 ease-out-quart motion-reduce:transition-none ${
                      isOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0"
                    }`}
                  >
                    {link.personaMenu ? (
                      <SolutionsPanel
                        onOpenPersona={openPersonaPopup}
                        logos={logos}
                        card={card}
                      />
                    ) : (
                      <MegaPanel menu={link.megaMenu!} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        {/* Left slot placeholder on mobile to preserve 3-col balance */}
        <div className="lg:hidden" />

        {/* Center: logo — clicks back to the home page from any route. */}
        <a
          href="/"
          aria-label="Chronilogix home"
          className="flex items-center justify-self-center text-ink"
        >
          <img
            src={
              isSolid
                ? "/Logo%20Packs/Primary%20Logo/Chronilogix_Logo-FullColor.svg"
                : "/Logo%20Packs/Primary%20Logo/Chronilogix_Logo-White.svg"
            }
            alt="Chronilogix"
            className="h-7 w-auto md:h-8"
          />
        </a>

        {/* Right: CTA (desktop) + hamburger (mobile) */}
        <div className="flex items-center justify-self-end gap-3">
          {/* TODO: Calendly URL */}
          <a
            href="#book-a-demo"
            className="hidden btn-primary lg:inline-flex"
          >
            Book a Demo
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden flex h-11 w-11 items-center justify-center rounded-full border outline-none transition-all duration-200 ease-out-quart active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper motion-reduce:transition-none ${
              open
                ? "border-ink/10 bg-ink/[0.05]"
                : isSolid
                  ? "border-ink/10 hover:bg-ink/[0.04]"
                  : "border-white/40 hover:bg-white/10"
            }`}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span
                className={`block h-px w-5 transition-transform duration-300 ease-out-quart motion-reduce:transition-none ${
                  isSolid ? "bg-ink" : "bg-white"
                } ${open ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-5 transition-opacity duration-200 ease-out-quart motion-reduce:transition-none ${
                  isSolid ? "bg-ink" : "bg-white"
                } ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`block h-px w-5 transition-transform duration-300 ease-out-quart motion-reduce:transition-none ${
                  isSolid ? "bg-ink" : "bg-white"
                } ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu — always mounted so it can animate open/closed via
          grid-template-rows (no height measuring). Scrolls internally if the
          content exceeds the viewport. */}
      <div
        id="mobile-nav"
        className={`lg:hidden absolute inset-x-0 top-full transition-all duration-300 ease-out-quart motion-reduce:transition-none ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
          <div className="max-h-[calc(100svh-5rem)] overflow-y-auto overscroll-contain border-t border-ink/5 bg-paper shadow-[0_24px_48px_-24px_rgba(20,8,2,0.28)] md:max-h-[calc(100svh-6rem)]">
            <div className="container-page py-4">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const hasMenu = !!link.megaMenu || !!link.personaMenu;
                  const expanded = mobileExpanded === link.label;
                  if (!hasMenu) {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg py-2.5 text-base text-ink-soft transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
                      >
                        {link.label}
                      </a>
                    );
                  }
                  return (
                    <div key={link.href} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpanded(expanded ? null : link.label)
                        }
                        aria-expanded={expanded}
                        className="flex items-center justify-between py-2.5 text-left text-base text-ink-soft transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
                      >
                        <span className="flex items-center gap-2">
                          {link.icon}
                          {link.label}
                        </span>
                        <svg
                          aria-hidden
                          viewBox="0 0 12 12"
                          className={`h-3 w-3 shrink-0 transition-transform duration-300 ease-out-quart motion-reduce:transition-none ${
                            expanded ? "rotate-180 text-brand-700" : "text-ink-muted"
                          }`}
                        >
                          <path
                            d="M2 4.5 6 8.5l4-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {/* Submenu — grid-rows animates the expand/collapse. */}
                      <div
                        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out-quart motion-reduce:transition-none ${
                          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="ml-3 flex flex-col gap-5 border-l border-ink/10 pb-2 pl-4 pt-2">
                            {link.personaMenu ? (
                              <SolutionsMobileMenu
                                onClose={() => setOpen(false)}
                                onOpenPersona={openPersonaPopup}
                                logos={logos}
                                card={card}
                              />
                            ) : (
                            link.megaMenu!.groups.map((group) => (
                              <div
                                key={group.heading}
                                className="flex flex-col gap-2"
                              >
                                <div className="text-[12px] font-medium tracking-tight text-ink-soft/70">
                                  {group.heading}
                                </div>
                                {group.items.map((item) =>
                                  item.soon ? (
                                    <span
                                      key={item.label}
                                      aria-disabled="true"
                                      className="flex items-center gap-2 text-sm text-ink-muted opacity-70"
                                    >
                                      {item.label}
                                      <span className="rounded-full border border-ink/10 bg-ink/[0.03] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                                        Soon
                                      </span>
                                    </span>
                                  ) : (
                                    <a
                                      key={item.href}
                                      href={item.href}
                                      onClick={() => setOpen(false)}
                                      className="block py-1 text-sm text-ink-soft transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
                                    >
                                      {item.label}
                                    </a>
                                  ),
                                )}
                              </div>
                            ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <a
                  href="#book-a-demo"
                  onClick={() => setOpen(false)}
                  className="btn-primary mt-4 self-start"
                >
                  Book a Demo
                </a>
              </nav>
            </div>
          </div>
      </div>

      {/* Persona detail popup — shared with the homepage's WhoWeServe
          section. Opened from the Solutions menu's right-hand personas
          (Employers, Health Plans, Wellness Platforms, Underserved),
          which have no dedicated sub-page. */}
      <PersonaDetailPopup
        persona={openPersona}
        onClose={() => setOpenPersonaKey(null)}
      />
    </header>
  );
}

// ── Solutions panel ───────────────────────────────────────────────────
//
// Mirrors the Resources mega-menu shape: a slim "Explore in depth" list on
// the left, a gallery of editorial cards on the right.
//   • Left  — the personas with live deep-dive pages (Brokers, Vendors).
//             Rich anchors that navigate to the sub-page.
//   • Right — the personas without a sub-page (Employers, Health Plans,
//             Wellness Platforms, Underserved). Rendered as gradient
//             cards — the same treatment as the Resources "Featured
//             Articles" — that open the shared detail popup on click.

// Quiet audience card — the loud full-bleed gradient covers read as a
// wall of identical orange blocks, so the surface is a calm warm paper
// with a single warm accent (the shared GlyphTile, which also ties this
// column to the "Explore in depth" list on the left). Label + one
// descriptor line, no restated copy. The whole card is the click target
// into the persona popup; the arrow is a quiet affordance that leans in
// on hover.
function PersonaCard({
  persona,
  onOpen,
}: {
  persona: PopupPersona;
  onOpen: (key: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(persona.key)}
      aria-haspopup="dialog"
      className="group flex flex-col gap-4 rounded-2xl bg-paper-warm p-5 text-left ring-1 ring-ink/[0.06] transition-all duration-200 ease-out-quart hover:-translate-y-0.5 hover:bg-paper hover:ring-ink/[0.12] hover:shadow-[0_1px_2px_rgba(15,20,25,0.05),0_18px_32px_-24px_rgba(184,70,20,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 motion-reduce:transition-none"
    >
      <div className="flex items-center justify-between">
        <GlyphTile glyph={persona.glyph} variant={persona.iconVariant} />
        <span
          aria-hidden
          className="text-ink-subtle transition-all duration-200 ease-out-quart group-hover:translate-x-0.5 group-hover:text-brand-700 motion-reduce:transition-none"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-ink">{persona.label}</span>
        <span className="text-xs leading-relaxed text-ink-soft">
          {persona.intro}
        </span>
      </div>
    </button>
  );
}

// Dark slate gradient — matches the "Roni AI" featured card in the Resources
// mega-menu (from-[#1F2937] via-[#2C3D55] to-[#3F5572]) with the same soft
// top-right highlight, so the two dropdown cards read as one family.
const PARTNER_CARD_BG =
  "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 42%), linear-gradient(135deg, #1F2937 0%, #2C3D55 55%, #3F5572 100%)";

// Partner Solutions promo card for the Solutions mega-menu. A gradient
// surface carrying the heading, a one-line hook, and the three partner
// logos in white chips; the whole card links to /partner-solutions.
function PartnerSolutionsMenuCard({
  logos,
  card,
}: {
  logos: PartnerLogo[];
  card: { title: string; hook: string };
}) {
  return (
    <a
      href="/partner-solutions"
      className="group/psc relative mt-auto flex min-h-[188px] flex-col justify-between overflow-hidden rounded-2xl p-6 text-left transition-all duration-200 ease-out-quart hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(15,20,25,0.12),0_24px_44px_-22px_rgba(31,41,55,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 motion-reduce:transition-none"
      style={{ backgroundImage: PARTNER_CARD_BG }}
    >
      <span className="relative">
        <span className="flex items-center justify-between gap-3">
          <span className="text-[14px] font-bold text-white/70">
            {card.title}
          </span>
          <span
            aria-hidden
            className="text-white/85 transition-transform duration-200 ease-out-quart group-hover/psc:translate-x-0.5 motion-reduce:transition-none"
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
        <span className="mt-1.5 block text-[18px] font-bold leading-snug text-white">
          {card.hook}
        </span>
      </span>
      <span className="relative mt-5 grid grid-cols-3 gap-2">
        {logos.map((logo) => (
          <PartnerLogoChip
            key={logo.src}
            logo={logo}
            className="h-12 w-full"
            imgClassName="h-full w-full object-contain"
            pad="px-3 py-2.5"
          />
        ))}
      </span>
    </a>
  );
}

function SolutionsPanel({
  onOpenPersona,
  logos,
  card,
}: {
  onOpenPersona: (key: string) => void;
  logos: PartnerLogo[];
  card: { title: string; hook: string };
}) {
  return (
    <div className="w-[940px] rounded-3xl border border-ink/5 bg-paper p-10 shadow-2xl shadow-ink/10">
      {/* Extra panel width routed into the left column so the Partner
          Solutions card (and its logos) get more room. */}
      <div className="grid grid-cols-[1fr_1.11fr] gap-14">
        <div className="flex flex-col gap-5">
          <div className="text-[12px] font-medium tracking-tight text-ink-soft/70">
            Explore in depth
          </div>
          <ul className="flex flex-col gap-1">
            {LINK_PERSONAS.map((persona) => (
              <li key={persona.key}>
                <a
                  href={persona.href}
                  className="group flex items-start gap-3 rounded-2xl p-2 transition-colors duration-150 ease-out-quart motion-reduce:transition-none hover:bg-ink/[0.04]"
                >
                  <GlyphTile glyph={persona.glyph} variant={persona.iconVariant} />
                  <div className="flex flex-col pt-1">
                    <span className="text-sm font-medium text-ink">
                      {persona.label}
                    </span>
                    <span className="text-xs text-ink-soft">{persona.intro}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {/* Partner Solutions promo — fills the space beneath the two
              sub-page personas and aligns with the lower edge of the
              "More audiences" grid. Distinct from the persona list: this is
              the case-study showcase of live bundles, not a buyer persona. */}
          <PartnerSolutionsMenuCard logos={logos} card={card} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="text-[12px] font-medium tracking-tight text-ink-soft/70">
            More audiences
          </div>
          <div className="grid grid-cols-2 gap-4">
            {POPUP_PERSONAS.map((persona) => (
              <PersonaCard
                key={persona.key}
                persona={persona}
                onOpen={onOpenPersona}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile counterpart of the Solutions panel — the two sub-page personas
// as links, the four popup personas as buttons.
function SolutionsMobileMenu({
  onClose,
  onOpenPersona,
  logos,
  card,
}: {
  onClose: () => void;
  onOpenPersona: (key: string) => void;
  logos: PartnerLogo[];
  card: { title: string; hook: string };
}) {
  return (
    <>
      {/* Partner Solutions promo — first entry, mirrors the desktop card. */}
      <a
        href="/partner-solutions"
        onClick={onClose}
        className="relative block overflow-hidden rounded-2xl p-4"
        style={{ backgroundImage: PARTNER_CARD_BG }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% -10%, rgba(255,255,255,0.28), transparent 60%)",
          }}
        />
        <span className="relative block text-xl font-bold text-white">
          {card.title}
        </span>
        <span className="relative mt-1 block text-[13px] font-bold text-white">
          {card.hook}
        </span>
        <span className="relative mt-4 grid grid-cols-3 gap-2">
          {logos.map((logo) => (
            <PartnerLogoChip
              key={logo.src}
              logo={logo}
              className="h-12 w-full"
              imgClassName="h-full w-full object-contain"
              pad="px-3 py-2.5"
            />
          ))}
        </span>
      </a>

      <div className="flex flex-col gap-2">
        <div className="text-[12px] font-medium tracking-tight text-ink-soft/70">
          Explore in depth
        </div>
        {LINK_PERSONAS.map((persona) => (
          <a
            key={persona.key}
            href={persona.href}
            onClick={onClose}
            className="block py-1 text-sm text-ink-soft transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
          >
            {persona.label}
          </a>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[12px] font-medium tracking-tight text-ink-soft/70">
          More audiences
        </div>
        {POPUP_PERSONAS.map((persona) => (
          <button
            key={persona.key}
            type="button"
            onClick={() => onOpenPersona(persona.key)}
            className="block py-1 text-left text-sm text-ink-soft transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
          >
            {persona.label}
          </button>
        ))}
      </div>
    </>
  );
}

function MegaPanel({ menu }: { menu: MegaMenu }) {
  return (
    <div className="w-[860px] rounded-3xl border border-ink/5 bg-paper p-10 shadow-2xl shadow-ink/10">
      <div className="grid grid-cols-[1fr_1.4fr] gap-14">
        {menu.groups.map((group) => (
          <div key={group.heading} className="flex flex-col gap-5">
            <div className="text-[12px] font-medium tracking-tight text-ink-soft/70">
              {group.heading}
            </div>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                // PDFs and other absolute URLs open in a new tab so they
                // don't lose the visitor's spot in the nav.
                const isExternal =
                  item.href.endsWith(".pdf") ||
                  item.href.startsWith("http");
                if (item.soon) {
                  // Non-navigating placeholder — muted, with a Soon chip.
                  return (
                    <li key={item.label}>
                      <span
                        aria-disabled="true"
                        className="group/menuitem flex cursor-default items-start gap-3 rounded-2xl p-2 opacity-60"
                      >
                        {item.icon}
                        <div className="flex flex-col pt-1">
                          <span className="flex items-center gap-2 text-sm font-medium text-ink">
                            {item.label}
                            <span className="rounded-full border border-ink/10 bg-ink/[0.03] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                              Soon
                            </span>
                          </span>
                          {item.description && (
                            <span className="text-xs text-ink-soft">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </span>
                    </li>
                  );
                }
                return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="group/menuitem flex items-start gap-3 rounded-2xl p-2 transition-colors duration-150 ease-out-quart motion-reduce:transition-none hover:bg-ink/[0.04]"
                  >
                    {item.icon}
                    <div className="flex flex-col pt-1">
                      <span className="text-sm font-medium text-ink">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="text-xs text-ink-soft">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </a>
                </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="flex flex-col gap-6">
          <div className="text-[12px] font-medium tracking-tight text-ink-soft/70">
            {menu.featured.heading}
          </div>
          {/* Two-column featured articles. gap-6 between cards gives the
              pair room to breathe; gap-4 inside each card separates the
              image tile from its title metadata; mt-3 lifts the tag row
              off the title for readability. All three tweaks work
              together to lift the right column out of "tight grid" and
              into an editorial-feature register. */}
          <div className="grid grid-cols-2 gap-6">
            {menu.featured.articles.map((article) => (
              <a
                key={article.href}
                href={article.href}
                className="group/article flex flex-col gap-4"
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${article.gradient}`}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 85% 18%, rgba(255,255,255,0.45), transparent 38%)",
                    }}
                  />
                  {article.eyebrow && (
                    <div className="absolute left-4 top-4 text-[12px] font-medium tracking-tight text-white/90">
                      {article.eyebrow}
                    </div>
                  )}
                  <div className="absolute inset-x-4 bottom-4 text-sm font-medium leading-snug text-white">
                    {article.title.split(":")[0]}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium leading-snug text-ink line-clamp-2 transition-colors duration-150 ease-out-quart motion-reduce:transition-none group-hover/article:text-ink">
                    {article.title}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
                    <span>{article.tag}</span>
                    <span aria-hidden className="block h-3 w-px bg-ink-soft/30" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
