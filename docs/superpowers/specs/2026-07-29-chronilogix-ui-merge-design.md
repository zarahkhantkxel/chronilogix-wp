# Chronilogix UI merge — design

**Date:** 2026-07-29
**Source:** `/Users/zarah.sajjad/Documents/Chronilogix` @ `9cf57bd` (clean working tree)
**Target:** `/Users/zarah.sajjad/Documents/next-wp-main` (headless WP + ACF Pro frontend)

## Problem

The design/POC repo (`Chronilogix`) has moved ahead of the headless WordPress
frontend (`next-wp-main`) by three commits. The frontend needs those UI changes,
plus ACF field groups and seeded WordPress content for anything that carries new
copy.

## Established baseline

The migration snapshot in `next-wp-main` corresponds to **`bea0cee`** (Jul 22,
"Apply client feedback"). Verified merged by content check:

- `components/widget/pageNav.tsx` exists (added in `bea0cee`)
- `public/us-dpp-logo.png` exists (added in `bea0cee`)
- `components/howItWorks/HiwAudience.tsx` matches `bea0cee` verbatim modulo the
  prop-driven refactor
- `CustomerStories.tsx` contains the `bea0cee` proof-section redesign copy
  (Aetna attribution line, CDC / US-DPP source lines)

## Scope — the un-merged delta

| Commit | Date | Change | WordPress impact |
|---|---|---|---|
| `db19dc9` | Jul 27 | New `/partner-solutions` route + 5 components + 6 logo assets | New ACF field group + seed data |
| `db19dc9` | Jul 27 | Nav: Solutions gradient glyph, Partner Solutions promo card (desktop panel + mobile menu), nav gap/padding tweaks | Nav becomes server-fed (see §2) |
| `db19dc9` | Jul 27 | `HeroV5` `min-[900px]` responsive rework; `Footer` padding/carousel spacing | None — pure CSS |
| `b4dab51` + `9cf57bd` | Jul 28–29 | `HiwAudience` pinned scroll-driven step carousel | None — pure interaction; the `PROFILES` data is byte-identical to `bea0cee` |

Out of scope: `bea0cee` and earlier (already merged), `package-lock.json` churn,
root-level raw image drops in the source repo (`Balance for life.png`,
`Hibiscus Health.png`, `Medimart.png`).

## 1. Pure-UI ports

Applied as **ports, not copies** — the prop-driven interfaces and `DEFAULTS`
blocks already in `next-wp-main` are preserved; only the presentation/interaction
layer changes.

### `components/howItWorks/HiwAudience.tsx`

Port the pinned carousel from `b4dab51` + `9cf57bd`:

- Tall spacer (`STEP_COUNT * 100vh`) supplies scroll distance; inner block is
  `sticky top-0 h-screen`.
- One absolutely-positioned snap anchor per step with `scroll-snap-align: start`
  and `scroll-snap-stop: always`, so a fast fling cannot skip a step.
- `scrollSnapType: "y mandatory"` is toggled on `document.documentElement` only
  while the spacer fills the viewport, then cleared — snapping never leaks to the
  rest of the site.
- rAF-throttled scroll driver sets a continuous `railPos` (drives the rail
  fill/knob and the horizontal strip) and a rounded `active` (drives labels and
  content).
- Three modes: `pinned` (≥1024px, motion OK — rail beside content), `pinnedH`
  (<1024px, motion OK — rail above a horizontally sliding strip), `fallback`
  (reduced motion — no pin, tap + 12s auto-advance, existing behaviour).
- `handleSelect` scrolls to the computed offset when pinned instead of setting
  state directly.
- Width detection uses a `resize` + `orientationchange` listener reading
  `window.innerWidth` (not `matchMedia`), so the mode can't get stranded.

`HiwAudienceProfile`, `HiwAudienceContent` and the `DEFAULTS` block are unchanged.
Consumers `/product` and `/product/v4` need no edits, and their existing ACF
fields continue to feed the section.

### `components/sections/HeroV5.tsx`

Swap the `lg:` breakpoint family to `min-[900px]:` across the hero grid, heading,
subtext column, stat pills and the two bottom fade overlays. Take the new phone
sizing: the fade wrapper gets `aspect-[1013/986] h-full max-h-[96%] w-auto
max-w-full sm:max-h-[94%] min-[900px]:h-[76%] …` and `PhoneFrame` renders
directly inside it (the intermediate `aspectRatio` div is removed). Middle band
becomes `items-center` below 900px, `min-[900px]:items-end`.

### `components/Footer.tsx`

Closing section padding `pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40` →
`pt-14 pb-20 md:pt-16 md:pb-28 lg:pt-20`; marquee wrapper
`mt-14 md:mt-16 lg:mt-20` → `mt-10 md:mt-12 lg:mt-12`.

## 2. Nav becomes server-fed

The Nav promo card renders the partner logos, and the decision is that logos come
from ACF everywhere. `Nav` is currently `"use client"` and is rendered from 16
server pages/layouts, so it splits in two:

- **`components/nav/NavClient.tsx`** — the current implementation moved verbatim,
  still `"use client"`, plus the `db19dc9` additions:
  - `SolutionsIcon` (2×2 gradient tile glyph) and the optional `icon` field on
    `NavLink`, rendered in both the desktop link and the mobile accordion row
  - `PartnerSolutionsMenuCard` in `SolutionsPanel`, panel widened
    `w-[860px]` → `w-[940px]`, columns `[1fr_1.4fr]` → `[1fr_1.11fr]`
  - Partner promo entry at the top of `SolutionsMobileMenu`
  - Nav row `lg:px-8`, link gaps `lg:gap-5 xl:gap-8`, link wrapper
    `relative flex items-center`
  - Two new optional props: `partnerLogos?: PartnerLogo[]`,
    `partnerCard?: { title?: string; hook?: string }`
- **`components/Nav.tsx`** — becomes a thin async **server** component: awaits
  `getPageAcf("partner-solutions")`, maps `partner_logos` / `nav_card_*`, renders
  `<NavClient partnerLogos={…} partnerCard={…} />`.

All 16 call sites keep `import { Nav } from "@/components/Nav"` and `<Nav />`
unchanged — every one is a server component, so an async `Nav` composes fine.
`NavClient` keeps static `DEFAULTS` pointing at `/partners/*.png`, so the Nav is
byte-identical when WordPress is empty or unreachable, and the Nav card can never
drift from the page.

Cost: one extra ACF fetch per render, deduped by the existing 1-hour `fetch` cache
and tagged `acf-partner-solutions`. The revalidate webhook's
`revalidatePath("/", "layout")` already invalidates it.

## 3. New page `/partner-solutions`

Five components ported and refactored prop-driven (`content` prop + module-level
`DEFAULTS`), matching the `solutions/app-partners` convention:

| File | Notes |
|---|---|
| `components/partnerSolutions/partnerData.ts` | Renamed from `.tsx` — contains no JSX. Holds `PartnerLogo`, `Bundle`, and the `DEFAULTS` data. |
| `components/partnerSolutions/PartnerLogoChip.tsx` | Unchanged (presentational, takes a `logo` prop). |
| `components/partnerSolutions/PartnerHero.tsx` | Takes `content` (eyebrow, heading lead/brand, intro, subintro, CTA label/url, logos). |
| `components/partnerSolutions/PartnerBundle.tsx` | Takes `bundle` + derived `index`. Three graphic variants: `video` (poster → inline `<video>` on click), `list` (icon rows in a blurred card), `steps` (staggered heading/body/meta blocks). |
| `components/partnerSolutions/YourSolutionPanel.tsx` | Takes `content` (closing headings, body, dark CTA slab). Keeps `id="book-a-demo"`. |

Dropped rather than carried into ACF, because nothing renders them:

- `CAPABILITIES` (10 strings) — exported by the source `partnerData.tsx` but
  imported nowhere; `YourSolutionPanel` writes that list as inline prose.
- `glyph` / `iconVariant` on `Bundle` — referenced only in comments.

`bundle.index` becomes derived from array position rather than a stored field; its
only use is the even/odd layout flip (`index % 2 === 0`).

`app/partner-solutions/page.tsx` is an async server component following the
`solutions/app-partners` shape: `getPageAcf("partner-solutions")`, the local
`arr()` guard for repeaters, section components inside the
`flex flex-col gap-2 p-2 md:gap-3 md:p-3` card system, then `<Footer />`,
`<PageNav>`, `<CoachLauncher />`.

`PARTNER_TOC` is **derived from the bundles list** rather than hardcoded, so
adding a partner in WordPress updates the wayfinder with no code change. It is
assembled as, in order:

1. `{ id: null, label: "Overview" }`
2. one `{ id: "ps-<bundle.key>-label", label: <bundle.title> }` per bundle
3. `{ id: "ps-your-solution-label", label: "Your solution" }` — the
   `YourSolutionPanel` `<h2>`
4. `{ id: "book-a-demo", label: "Book a demo" }` — the `YourSolutionPanel`
   `<section>` itself

`revealId` stays keyed to the first bundle's label id.

`metadata` is a static export using the upstream title and description.

The Zenn bundle's `video.src` (`/video/zenn-demo.mp4`) ports as-is. The file does
not exist in either repo — only `zenn-demo-poster.jpg` — so the poster renders and
the play button swaps in a `<video>` that 404s. This matches current behaviour in
both the source repo and the existing `components/widget/SectionGuide.tsx`; the
mp4 can be dropped into `public/video/` later with no code change.

## 4. ACF field group and seeder

### Field group

New `wp-content/mu-plugins/chronilogix-acf/partner-solutions.php`, registered via
`acf_add_local_field_group()` with `'show_in_rest' => 1` and
`'location' => chronilogix_acf_page_location('partner-solutions')`. Tabbed like
its siblings; image fields use `'return_format' => 'url'`.

Key prefix: `field_ps_*`. Group key: `group_partner_solutions`.

| Tab | Field names |
|---|---|
| Hero | `hero_eyebrow`, `hero_heading_lead`, `hero_heading_brand`, `hero_intro`, `hero_subintro`, `hero_cta_label`, `hero_cta_url` |
| Partner logos | `partner_logos` (repeater) → `logo` (image, url), `alt` (text) |
| Nav card | `nav_card_title`, `nav_card_hook` |
| Bundles | `bundles` (repeater) → `key`, `title`, `category`, `lead` (repeater → `text`), `pointers_heading`, `pointers` (repeater → `text`), `lead_after`, `tagline`, `graphic` (select: `video` / `list` / `steps`), `graphic_heading`, `graphic_list` (repeater → `text`), `graphic_footnote`, `graphic_steps` (repeater → `heading`, `body`, `meta`), `logo` (image, url), `logo_alt`, `video_poster` (image, url), `video_src`, `video_runtime`, `video_eyebrow`, `video_title`, `video_blurb`, `video_credit` |
| Closing | `closing_heading_brand`, `closing_heading_rest`, `closing_sub_lead`, `closing_sub_brand`, `closing_body`, `closing_body_brand`, `cta_heading_lead`, `cta_heading_muted`, `cta_body`, `cta_label`, `cta_url` |

`bundles` uses **nested repeaters** (`lead`, `pointers`, `graphic_list`,
`graphic_steps` inside `bundles`). No existing field group in this project nests.
ACF Pro supports it and `acf_format=standard` returns properly nested arrays. The
accepted trade-off is a clunkier repeater-in-repeater admin UX in exchange for
consistency with the site's "flat list = repeater of one text sub-field"
convention (cf. `trust_lines` → `[{ line }]`).

The split headings (`*_lead` / `*_brand`, `*_heading_lead` / `*_heading_muted`)
mirror the existing convention for copy where one clause renders in italic brand
or muted colour — the components own the styling, ACF owns the words.

### Assets

Copy all six files from `Chronilogix/public/partners/` into
`next-wp-main/public/partners/`:

- `balance-for-life-logo.png`, `medimart-logo.png`, `hibiscus-health-logo.png` —
  background-stripped transparent versions used by the UI and by `NavClient`'s
  static defaults
- `balance-for-life.png`, `hibiscus-health.jpeg`, `medimart.webp` — the supplied
  originals, kept alongside per the upstream comment

This must happen before seeding: `chr_media` imports from `CHR_PUBLIC_DIR`
(`/Users/zarah.sajjad/Documents/next-wp-main/public`).

### Seeder

New `wordpress/acf-seeds/seed-partner-solutions.php` following the existing
pattern: `require _helpers.php`, `chr_page('partner-solutions', 'Partner
Solutions')`, `chr_media()` for each logo, `chr_fields()` for the flat fields and
`update_field()` for the repeaters. Re-runnable. Content is the exact upstream
copy from `Chronilogix/components/partnerSolutions/partnerData.tsx`,
`PartnerHero.tsx` and `YourSolutionPanel.tsx`.

Run with:

```
export PATH="$HOME/.local/bin:$PATH"
wpx eval-file wordpress/acf-seeds/seed-partner-solutions.php
```

## Error handling and graceful degradation

Unchanged from the site's existing contract:

- `getPageAcf` returns `null` on any failure; every component falls back to its
  module-level `DEFAULTS`, so the page and the Nav render byte-identically when
  WordPress is empty or down.
- ACF returns `false` (not `undefined`) for an empty repeater — every collection
  goes through the local `arr()` guard before `.map()`.
- Nested repeaters get the same guard at both levels.

## Verification

1. `pnpm lint`
2. `pnpm build`
3. `pnpm test` (existing suite; nothing here touches `lib/utils`, `lib/metadata`,
   `lib/wordpress` or `api/revalidate`)
4. Confirm the Local site `chronologix.local` is running, then run the seeder
5. Load `/partner-solutions` — hero logos, three bundles with their three distinct
   graphics, closing panel, derived PageNav TOC
6. Load `/product` — carousel pins, snaps one step at a time, releases at the end;
   check ≥1024px, <1024px, and with `prefers-reduced-motion: reduce`
7. Open the Solutions nav menu on desktop and mobile — promo card renders
   WordPress-sourced logos
8. Confirm `/` and `/product` still render with `WORDPRESS_URL` unset (defaults
   path)

No new unit tests: the existing suite covers `lib/` only, and none of this work
changes that layer.

## Notes

`next-wp-main` is not a git repository, so this spec is written to disk but not
committed.
