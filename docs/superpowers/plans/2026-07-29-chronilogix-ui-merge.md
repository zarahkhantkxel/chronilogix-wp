# Chronilogix UI Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the three un-merged UI commits from `/Users/zarah.sajjad/Documents/Chronilogix` into the headless-WordPress frontend `/Users/zarah.sajjad/Documents/next-wp-main`, adding ACF fields and seeded WordPress content for the new `/partner-solutions` page.

**Architecture:** The two repos diverged after `bea0cee`. Upstream files are ported with `git merge-file` 3-way merges (base = `Chronilogix@bea0cee`, ours = the prop-refactored `next-wp-main` file, theirs = `Chronilogix@HEAD`) so the existing ACF prop plumbing survives. The new page follows the established pattern: prop-driven components with module-level `DEFAULTS`, an async server-component page reading `getPageAcf(slug)`, a code-defined ACF field group in the `chronilogix-acf` mu-plugin, and a re-runnable seeder. ACF→props mapping is extracted into a pure, unit-tested `lib/partnerSolutions.ts` so both the page and the Nav share one mapper.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4, Vitest, WordPress + ACF Pro (Local by Flywheel at `chronologix.local`), wp-cli via the `wpx` wrapper.

## Global Constraints

- **`next-wp-main` is NOT a git repository.** There are no commit steps. Every task ends with a verification step instead. Do not run `git init`; do not create commits.
- Source repo `/Users/zarah.sajjad/Documents/Chronilogix` is read-only for this work. Never write to it. Read historical versions with `git -C /Users/zarah.sajjad/Documents/Chronilogix show <rev>:<path>`.
- Scratchpad for intermediate merge artifacts: `/private/tmp/claude-924138849/-Users-zarah-sajjad-Documents-next-wp-main/1fe6bc7f-269e-4cfd-9be0-8bc08a66432c/scratchpad`. Referred to below as `$SP`.
- Merge base revision is exactly `bea0cee`. Upstream head is exactly `9cf57bd` (also reachable as `HEAD`).
- ACF returns `false` (not `undefined` or `[]`) for an empty repeater. Every collection read from ACF must pass through an `arr()`-style guard before `.map()`. This applies at **every** nesting level.
- All ACF image fields use `'return_format' => 'url'` so they arrive as plain URL strings.
- Every field group registers with `'show_in_rest' => 1` and `'location' => chronilogix_acf_page_location('<slug>')`.
- Components must render byte-identically to their `DEFAULTS` when WordPress is empty or unreachable. Never introduce a code path that renders blank on missing ACF data.
- ACF field group files live at `/Users/zarah.sajjad/Local Sites/chronologix/app/public/wp-content/mu-plugins/chronilogix-acf/`. Referred to below as `$MU`.
- Seeders live at `next-wp-main/wordpress/acf-seeds/` and are run with `export PATH="$HOME/.local/bin:$PATH"; wpx eval-file wordpress/acf-seeds/<file>.php`.
- Do NOT add `zenn-demo.mp4`. The `video.src` value `/video/zenn-demo.mp4` ports verbatim even though the file does not exist; this matches the source repo and existing `components/widget/SectionGuide.tsx`.
- Do NOT port `CAPABILITIES` from the source `partnerData.tsx`, and do NOT port the `glyph` / `iconVariant` fields on `Bundle`. Nothing renders them.

## File Structure

**Created:**

| Path | Responsibility |
|---|---|
| `lib/partnerSolutions.ts` | Pure ACF→props mappers + TOC builder. No React, no fetch. |
| `__tests__/lib/partnerSolutions.test.ts` | Unit tests for the above. |
| `components/partnerSolutions/partnerData.ts` | `PartnerLogo` / `Bundle` types + `PARTNER_LOGOS` / `BUNDLES` defaults. |
| `components/partnerSolutions/PartnerLogoChip.tsx` | White chip wrapper normalising mismatched logo backgrounds. |
| `components/partnerSolutions/PartnerHero.tsx` | `/partner-solutions` opener. |
| `components/partnerSolutions/PartnerBundle.tsx` | One bundle section; 3 graphic variants. |
| `components/partnerSolutions/YourSolutionPanel.tsx` | Closing panel + `#book-a-demo` CTA slab. |
| `components/nav/NavClient.tsx` | The entire existing Nav client implementation, relocated + extended. |
| `app/partner-solutions/page.tsx` | Async server component for the route. |
| `public/partners/*` | 6 logo assets (copied). |
| `$MU/partner-solutions.php` | ACF field group. |
| `wordpress/acf-seeds/seed-partner-solutions.php` | Content seeder. |

**Modified:**

| Path | Change |
|---|---|
| `components/Footer.tsx` | Padding + carousel spacing (clean 3-way merge). |
| `components/sections/HeroV5.tsx` | `min-[900px]` responsive rework (2 conflicts). |
| `components/howItWorks/HiwAudience.tsx` | Pinned scroll carousel (5 conflicts + identifier sweep). |
| `components/Nav.tsx` | Reduced to a thin async server component. |

---

### Task 1: Port Footer and HeroV5

Pure presentational changes. `Footer.tsx` merges with zero conflicts; `HeroV5.tsx` has exactly two, both the same shape — upstream changed styling in a block where `next-wp-main` had replaced hardcoded content with props.

**Files:**
- Modify: `components/Footer.tsx`
- Modify: `components/sections/HeroV5.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing. No exported signatures change. `HeroV5`'s `content` prop shape and `PhoneFrame`'s props (`phase`, `activeIndex`, `typingFor`, `chat`, `phoneSrc`, `avatarSrc`) are unchanged.

- [ ] **Step 1: Set up the merge inputs**

```bash
CH=/Users/zarah.sajjad/Documents/Chronilogix
WP=/Users/zarah.sajjad/Documents/next-wp-main
SP=/private/tmp/claude-924138849/-Users-zarah-sajjad-Documents-next-wp-main/1fe6bc7f-269e-4cfd-9be0-8bc08a66432c/scratchpad
mkdir -p "$SP/merge"

for f in components/Footer.tsx components/sections/HeroV5.tsx; do
  n=$(basename "$f")
  git -C "$CH" show "bea0cee:$f" > "$SP/merge/$n.base"
  git -C "$CH" show "9cf57bd:$f" > "$SP/merge/$n.theirs"
  cp "$WP/$f" "$SP/merge/$n.ours"
  cp "$SP/merge/$n.ours" "$SP/merge/$n.merged"
  git merge-file -L ours -L base -L theirs \
    "$SP/merge/$n.merged" "$SP/merge/$n.base" "$SP/merge/$n.theirs"
  echo "$n conflicts: $(grep -c '^<<<<<<<' "$SP/merge/$n.merged")"
done
```

Expected output:
```
Footer.tsx conflicts: 0
HeroV5.tsx conflicts: 2
```

If the conflict counts differ, STOP — the working files have drifted from what this plan was written against. Report the discrepancy rather than guessing.

- [ ] **Step 2: Install the clean Footer merge**

```bash
cp "$SP/merge/Footer.tsx.merged" "$WP/components/Footer.tsx"
```

Then confirm the two expected changes landed by reading the file. The closing `<section>` must now read:

```tsx
<section className="relative overflow-hidden rounded-[28px] bg-paper-warm pt-14 pb-20 md:pt-16 md:pb-28 lg:pt-20">
```

and the marquee wrapper:

```tsx
<div className="relative mt-10 overflow-hidden md:mt-12 lg:mt-12" aria-hidden>
```

- [ ] **Step 3: Copy the conflicted HeroV5 merge into place**

```bash
cp "$SP/merge/HeroV5.tsx.merged" "$WP/components/sections/HeroV5.tsx"
```

The file now contains two conflict blocks. Resolve both in the next two steps.

- [ ] **Step 4: Resolve HeroV5 conflict 1 — the phone frame wrapper**

The conflict looks like this:

```tsx
<<<<<<< ours
            <div className="h-full" style={{ aspectRatio: "1013 / 986" }}>
              <PhoneFrame
                phase={phase}
                activeIndex={activeIndex}
                typingFor={typingFor}
                chat={chat}
                phoneSrc={c.phoneImage}
                avatarSrc={c.avatarImage}
              />
            </div>
=======
            <PhoneFrame
              phase={phase}
              activeIndex={activeIndex}
              typingFor={typingFor}
            />
>>>>>>> theirs
```

Take **theirs' structure** (the intermediate `<div>` is gone — the aspect ratio moved to the parent as a Tailwind class) but **ours' props**. Replace the whole conflict block with:

```tsx
            <PhoneFrame
              phase={phase}
              activeIndex={activeIndex}
              typingFor={typingFor}
              chat={chat}
              phoneSrc={c.phoneImage}
              avatarSrc={c.avatarImage}
            />
```

Verify the parent `<div>` immediately above now carries the upstream classes (this arrived non-conflicted):

```tsx
            className="aspect-[1013/986] h-full max-h-[96%] w-auto max-w-full sm:max-h-[94%] min-[900px]:h-[76%] min-[900px]:max-h-none min-[900px]:w-auto min-[900px]:max-w-none"
```

- [ ] **Step 5: Resolve HeroV5 conflict 2 — the stat pills**

The conflict pits ours' `stats.map()` loop against theirs' three hardcoded pills with an updated `className`. Take **ours' loop** and apply **theirs' className change only** (`lg:justify-start lg:text-[11.5px]` → `min-[900px]:justify-start min-[900px]:text-[11.5px]`). Replace the whole conflict block with:

```tsx
            <dl className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[12px] text-ink-muted md:mt-5 md:gap-2 md:text-[11px] min-[900px]:justify-start min-[900px]:text-[11.5px]">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/8 bg-white/70 px-3 py-1.5 backdrop-blur-sm md:px-3 md:py-1"
                >
                  <dt className="font-medium leading-none text-ink">
                    {stat.value}
                  </dt>
                  <dd className="leading-none">{stat.label}</dd>
                </div>
              ))}
```

- [ ] **Step 6: Confirm no conflict markers remain**

Run:
```bash
grep -n '^<<<<<<<\|^=======$\|^>>>>>>>' "$WP/components/sections/HeroV5.tsx" "$WP/components/Footer.tsx"
```
Expected: no output, exit code 1.

- [ ] **Step 7: Confirm the breakpoint sweep is complete**

Run:
```bash
grep -c 'min-\[900px\]:' "$WP/components/sections/HeroV5.tsx"
```
Expected: `13`.

- [ ] **Step 8: Verify the build**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm lint && pnpm build`
Expected: lint clean, build succeeds. No TypeScript errors in `HeroV5.tsx` or `Footer.tsx`.

---

### Task 2: Port the HiwAudience pinned scroll carousel

The largest port. Upstream rewrote the section's scroll behaviour while `next-wp-main` had refactored it to read `PROFILES` from props. `git merge-file` produces 5 conflicts **and** silently leaves 11 references to upstream's module-level `STEP_COUNT` / `PROFILES`, which no longer exist in the prop-driven version. TypeScript catches all 11; the sweep in Step 8 fixes them.

**Files:**
- Modify: `components/howItWorks/HiwAudience.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `HiwAudienceProfile` and `HiwAudienceContent` are re-exported **unchanged** — `app/product/page.tsx` and `app/product/v4/page.tsx` must keep compiling with zero edits. A new internal (non-exported) component `SlidingPanels` is added with props `{ profiles: HiwAudienceProfile[]; stepCount: number; railPos: number; active: number; reducedMotion: boolean }`.

- [ ] **Step 1: Produce the 3-way merge**

```bash
CH=/Users/zarah.sajjad/Documents/Chronilogix
WP=/Users/zarah.sajjad/Documents/next-wp-main
SP=/private/tmp/claude-924138849/-Users-zarah-sajjad-Documents-next-wp-main/1fe6bc7f-269e-4cfd-9be0-8bc08a66432c/scratchpad
f=components/howItWorks/HiwAudience.tsx

git -C "$CH" show "bea0cee:$f" > "$SP/merge/HiwAudience.tsx.base"
git -C "$CH" show "9cf57bd:$f" > "$SP/merge/HiwAudience.tsx.theirs"
cp "$WP/$f" "$SP/merge/HiwAudience.tsx.ours"
cp "$SP/merge/HiwAudience.tsx.ours" "$SP/merge/HiwAudience.tsx.merged"
git merge-file -L ours -L base -L theirs \
  "$SP/merge/HiwAudience.tsx.merged" \
  "$SP/merge/HiwAudience.tsx.base" \
  "$SP/merge/HiwAudience.tsx.theirs"
echo "conflicts: $(grep -c '^<<<<<<<' "$SP/merge/HiwAudience.tsx.merged")"
cp "$SP/merge/HiwAudience.tsx.merged" "$WP/$f"
```

Expected: `conflicts: 5`. If it differs, STOP and report.

- [ ] **Step 2: Resolve conflict 1 — auto-advance effect deps**

```tsx
<<<<<<< ours
  }, [active, inView, reducedMotion, stepCount]);
=======
  }, [active, inView, reducedMotion, anyPinned]);
>>>>>>> theirs
```

Both deps are needed — ours' `stepCount` (prop-derived) and theirs' `anyPinned` (new mode flag). Take the union:

```tsx
  }, [active, inView, reducedMotion, stepCount, anyPinned]);
```

- [ ] **Step 3: Resolve conflict 2 — the section body (the big one)**

This conflict spans the entire render tree: ours is the old flat `container-page` layout, theirs is the new tall-spacer + `sticky` + snap-anchor structure. **Take theirs wholesale**, then re-thread ours' props. Replace the whole conflict block (from `<<<<<<< ours` through `>>>>>>> theirs`) with:

```tsx
        ref={scrollWrapRef}
        className={anyPinned ? "relative" : ""}
        style={anyPinned ? { height: `${stepCount * STEP_VH}vh` } : undefined}
      >
        {/* One snap stop per step. `scroll-snap-stop: always` forbids the scroll
            from flinging past a step, so the visitor is stopped on every one. */}
        {anyPinned
          ? profiles.map((p, i) => (
              <div
                key={`snap-${p.key ?? i}`}
                aria-hidden
                className="pointer-events-none absolute inset-x-0"
                style={{
                  top: `${i * STEP_VH}vh`,
                  height: `${STEP_VH}vh`,
                  scrollSnapAlign: "start",
                  scrollSnapStop: "always",
                }}
              />
            ))
          : null}
        <div
          className={
            anyPinned
              ? // flex-col + overflow-y-auto + `my-auto` on the child centres a
                // step that fits and lets a taller one (the content-heavy last
                // step on a narrow phone) scroll into view instead of clipping.
                "sticky top-0 flex h-screen flex-col overflow-y-auto"
              : "relative"
          }
        >
          {/* Top / bottom edge gradients soften the boundary with adjacent
              full-bleed sections — same treatment as the home persona block. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-20"
            style={{
              height: "min(180px, 18vh)",
              background:
                "linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
            style={{
              height: "min(180px, 18vh)",
              background:
                "linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)",
            }}
          />

          <div
            className={`container-page w-full ${
              anyPinned ? "my-auto shrink-0 py-6" : "py-24 md:py-28 lg:py-32"
            }`}
          >
            {/* Tab rail + panel — the home persona pattern. */}
            <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-[300px_1fr] lg:gap-16 xl:grid-cols-[340px_1fr] xl:gap-24">
              <ProfileTabs
                profiles={profiles}
                stepCount={stepCount}
                active={active}
                railPos={railPos}
                continuous={continuous}
                onSelect={handleSelect}
                reducedMotion={reducedMotion}
                autoAdvancing={autoAdvancing}
              />
              {pinnedH ? (
                // 768–1023px — every step panel sits on one horizontal strip
                // that slides with the scroll, one panel per step.
                <SlidingPanels
                  profiles={profiles}
                  stepCount={stepCount}
                  railPos={railPos}
                  active={active}
                  reducedMotion={reducedMotion}
                />
              ) : (
                // Panel animates to the active tab's real content height so the
                // section is exactly as tall as the current step needs.
                <AudiencePanel
                  profile={profile}
                  index={active}
                  reducedMotion={reducedMotion}
                />
              )}
            </div>
          </div>
```

Note three deliberate deviations from theirs: `stepCount`/`profiles` instead of `STEP_COUNT`/`PROFILES`, `key={`snap-${p.key ?? i}`}` because `HiwAudienceProfile.key` is optional in the prop-driven type, and `index={active}` restored on `AudiencePanel` (ours' signature requires it).

- [ ] **Step 4: Resolve conflict 3 — the rail segment**

```tsx
<<<<<<< ours
  // top-down to the active row's center.
  const segment = 100 / stepCount;
=======
  // top-down to the active row's center. In the pinned modes the fill + knob
  // ride the continuous `railPos` so they glide in lockstep with the scroll;
  // the fallback path uses the WAAPI dwell animation below.
  const segment = 100 / STEP_COUNT;
>>>>>>> theirs
```

Take theirs' comment, ours' identifier:

```tsx
  // top-down to the active row's center. In the pinned modes the fill + knob
  // ride the continuous `railPos` so they glide in lockstep with the scroll;
  // the fallback path uses the WAAPI dwell animation below.
  const segment = 100 / stepCount;
```

- [ ] **Step 5: Resolve conflict 4 — fill height and knob position**

```tsx
<<<<<<< ours
    stepCount > 1 ? (active / (stepCount - 1)) * trackHeight : 0;
  const knobTop = trackTop + segment * active;
=======
    STEP_COUNT > 1 ? (pos / (STEP_COUNT - 1)) * trackHeight : 0;
  const knobTop = trackTop + segment * pos;
>>>>>>> theirs
```

Take theirs' logic (it uses the continuous `pos`, which is the whole point of the change) with ours' identifier:

```tsx
    stepCount > 1 ? (pos / (stepCount - 1)) * trackHeight : 0;
  const knobTop = trackTop + segment * pos;
```

- [ ] **Step 6: Resolve conflict 5 — WAAPI effect deps**

```tsx
<<<<<<< ours
  }, [active, autoAdvancing, segment, stepCount, trackHeight, trackTop]);
=======
  }, [active, autoAdvancing, continuous, segment, trackHeight, trackTop]);
>>>>>>> theirs
```

Take the union:

```tsx
  }, [active, autoAdvancing, continuous, segment, stepCount, trackHeight, trackTop]);
```

- [ ] **Step 7: Confirm no conflict markers remain**

Run:
```bash
grep -n '^<<<<<<<\|^=======$\|^>>>>>>>' /Users/zarah.sajjad/Documents/next-wp-main/components/howItWorks/HiwAudience.tsx
```
Expected: no output, exit code 1.

- [ ] **Step 8: Sweep the leaked upstream identifiers**

Run:
```bash
grep -n 'STEP_COUNT\|PROFILES' /Users/zarah.sajjad/Documents/next-wp-main/components/howItWorks/HiwAudience.tsx
```

Everything that remains is inside `SlidingPanels` (new upstream code the merge inserted verbatim) plus one comment. Fix them:

- The comment `// Continuous rail position (0 … STEP_COUNT-1)` → `(0 … stepCount-1)`.
- In the scroll driver effect: `const pos = (scrolled / total) * (STEP_COUNT - 1);` → `(stepCount - 1)`. Add `stepCount` to that effect's dep array (it currently reads `[anyPinned]`, make it `[anyPinned, stepCount]`).
- In `handleSelect`: `top: wrapTop + (idx / (STEP_COUNT - 1)) * total,` → `(stepCount - 1)`.
- In `SlidingPanels`, change the signature to accept the two new props:

```tsx
function SlidingPanels({
  profiles,
  stepCount,
  railPos,
  active,
  reducedMotion,
}: {
  profiles: HiwAudienceProfile[];
  stepCount: number;
  railPos: number;
  active: number;
  reducedMotion: boolean;
}) {
```

- In `SlidingPanels`' returned JSX, replace the strip wrapper and the map:

```tsx
      <div
        className="flex items-start"
        style={{
          width: `${stepCount * 100}%`,
          transform: `translateX(-${(railPos / stepCount) * 100}%)`,
          willChange: "transform",
        }}
      >
        {profiles.map((p, i) => (
          <div
            key={p.key ?? i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="flex-none"
            style={{ width: `${100 / stepCount}%` }}
          >
            <ProfilePanel profile={p} index={i} reducedMotion={reducedMotion} />
          </div>
        ))}
      </div>
```

Note `index={i}` — ours' `ProfilePanel` requires an `index` prop that upstream's call site omitted.

- [ ] **Step 9: Verify the sweep is complete**

Run:
```bash
grep -c 'STEP_COUNT\|PROFILES' /Users/zarah.sajjad/Documents/next-wp-main/components/howItWorks/HiwAudience.tsx
```
Expected: `0`.

- [ ] **Step 10: Verify the mode constants and driver survived**

Run:
```bash
grep -n 'STEP_VH\|scrollSnapStop\|scrollSnapType\|const pinnedH\|const anyPinned\|orientationchange' \
  /Users/zarah.sajjad/Documents/next-wp-main/components/howItWorks/HiwAudience.tsx
```
Expected: hits for all six — `const STEP_VH = 100`, `scrollSnapStop: "always"`, the `root.style.scrollSnapType` toggle (two occurrences: set and cleanup), `const pinnedH`, `const anyPinned`, and the `orientationchange` listener pair.

- [ ] **Step 11: Verify the build and the untouched consumers**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm lint && pnpm build`
Expected: clean. Critically, **no errors in `app/product/page.tsx` or `app/product/v4/page.tsx`** — if either fails, the exported prop interface was changed and must be restored.

- [ ] **Step 12: Verify existing tests still pass**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm test`
Expected: all existing suites pass (`lib/utils`, `lib/metadata`, `lib/wordpress`, `api/revalidate`).

---

### Task 3: Partner logo assets and the data module

Establishes the types and default content everything downstream depends on. The assets must land before any seeding, because `chr_media` imports from `CHR_PUBLIC_DIR` which points at `next-wp-main/public`.

**Files:**
- Create: `public/partners/` (6 files, copied)
- Create: `components/partnerSolutions/partnerData.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type PartnerLogo = { src: string; alt: string }`
  - `type BundleGraphic = "video" | "list" | "steps"`
  - `type BundleVideo = { poster: string; src: string; runtime: string; eyebrow: string; title: string; blurb: string; credit: string }`
  - `type BundleStep = { heading: string; body: string; meta?: string }`
  - `type Bundle = { key: string; index: number; title: string; category: string; lead: string[]; pointers: string[]; pointersHeading?: string; leadAfter?: string; tagline: string; graphic: BundleGraphic; graphicList?: string[]; graphicHeading?: string; graphicFootnote?: string; graphicSteps?: BundleStep[]; logo: PartnerLogo; video?: BundleVideo }`
  - `const PARTNER_LOGOS: PartnerLogo[]` (3 entries)
  - `const BUNDLES: Bundle[]` (3 entries)
  - `const NAV_CARD_DEFAULTS: { title: string; hook: string }`

- [ ] **Step 1: Copy the logo assets**

```bash
mkdir -p /Users/zarah.sajjad/Documents/next-wp-main/public/partners
cp /Users/zarah.sajjad/Documents/Chronilogix/public/partners/* \
   /Users/zarah.sajjad/Documents/next-wp-main/public/partners/
ls -1 /Users/zarah.sajjad/Documents/next-wp-main/public/partners/
```

Expected exactly these 6 files:
```
balance-for-life-logo.png
balance-for-life.png
hibiscus-health-logo.png
hibiscus-health.jpeg
medimart-logo.png
medimart.webp
```

- [ ] **Step 2: Create the data module**

Create `components/partnerSolutions/partnerData.ts`. Note the extension is `.ts`, not `.tsx` — there is no JSX in this file (the source repo's `.tsx` extension was vestigial).

```ts
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
```

- [ ] **Step 3: Verify it typechecks**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm build`
Expected: build succeeds. The module is not yet imported anywhere, so this only proves it compiles.

---

### Task 4: The ACF mapping layer (TDD)

Pure functions that turn a raw ACF payload into the typed shapes from Task 3. Extracted into `lib/` rather than inlined in the page so (a) the Nav and the page share one mapper and can't drift, and (b) the nested-repeater `false` handling — the codebase's most-documented ACF gotcha — is unit tested.

**Files:**
- Create: `lib/partnerSolutions.ts`
- Test: `__tests__/lib/partnerSolutions.test.ts`

**Interfaces:**
- Consumes: `PartnerLogo`, `Bundle`, `BundleStep`, `PARTNER_LOGOS`, `BUNDLES` from `@/components/partnerSolutions/partnerData`.
- Produces:
  - `mapPartnerLogos(acf: Record<string, any> | null | undefined): PartnerLogo[]`
  - `mapBundles(acf: Record<string, any> | null | undefined): Bundle[]`
  - `buildPartnerToc(bundles: Bundle[]): { id: string | null; label: string }[]`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/lib/partnerSolutions.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  mapPartnerLogos,
  mapBundles,
  buildPartnerToc,
} from "@/lib/partnerSolutions";
import {
  PARTNER_LOGOS,
  BUNDLES,
} from "@/components/partnerSolutions/partnerData";

describe("mapPartnerLogos", () => {
  it("falls back to defaults when acf is null", () => {
    expect(mapPartnerLogos(null)).toEqual(PARTNER_LOGOS);
  });

  it("falls back to defaults when the repeater is ACF's empty `false`", () => {
    expect(mapPartnerLogos({ partner_logos: false })).toEqual(PARTNER_LOGOS);
  });

  it("falls back to defaults when the repeater is an empty array", () => {
    expect(mapPartnerLogos({ partner_logos: [] })).toEqual(PARTNER_LOGOS);
  });

  it("maps logo rows to src/alt", () => {
    const acf = {
      partner_logos: [
        { logo: "https://wp.test/a.png", alt: "Partner A" },
        { logo: "https://wp.test/b.png", alt: "Partner B" },
      ],
    };
    expect(mapPartnerLogos(acf)).toEqual([
      { src: "https://wp.test/a.png", alt: "Partner A" },
      { src: "https://wp.test/b.png", alt: "Partner B" },
    ]);
  });

  it("drops rows with no image", () => {
    const acf = {
      partner_logos: [
        { logo: "", alt: "Empty" },
        { logo: "https://wp.test/b.png", alt: "Partner B" },
      ],
    };
    expect(mapPartnerLogos(acf)).toEqual([
      { src: "https://wp.test/b.png", alt: "Partner B" },
    ]);
  });
});

describe("mapBundles", () => {
  it("falls back to defaults when acf is null", () => {
    expect(mapBundles(null)).toEqual(BUNDLES);
  });

  it("falls back to defaults when the repeater is ACF's empty `false`", () => {
    expect(mapBundles({ bundles: false })).toEqual(BUNDLES);
  });

  it("assigns a 1-based index by position", () => {
    const acf = {
      bundles: [
        { key: "a", title: "A", graphic: "list", logo: "/a.png" },
        { key: "b", title: "B", graphic: "list", logo: "/b.png" },
        { key: "c", title: "C", graphic: "list", logo: "/c.png" },
      ],
    };
    expect(mapBundles(acf).map((b) => b.index)).toEqual([1, 2, 3]);
  });

  it("guards nested repeaters that come back as `false`", () => {
    const acf = {
      bundles: [
        {
          key: "a",
          title: "A",
          graphic: "list",
          logo: "/a.png",
          lead: false,
          pointers: false,
          graphic_list: false,
          graphic_steps: false,
        },
      ],
    };
    const [b] = mapBundles(acf);
    expect(b.lead).toEqual([]);
    expect(b.pointers).toEqual([]);
    expect(b.graphicList).toEqual([]);
    expect(b.graphicSteps).toEqual([]);
  });

  it("flattens nested text repeaters to string arrays", () => {
    const acf = {
      bundles: [
        {
          key: "a",
          title: "A",
          graphic: "list",
          logo: "/a.png",
          lead: [{ text: "para one" }, { text: "para two" }],
          pointers: [{ text: "point one" }],
          graphic_list: [{ text: "outcome one" }],
        },
      ],
    };
    const [b] = mapBundles(acf);
    expect(b.lead).toEqual(["para one", "para two"]);
    expect(b.pointers).toEqual(["point one"]);
    expect(b.graphicList).toEqual(["outcome one"]);
  });

  it("maps nested step rows and drops an empty meta", () => {
    const acf = {
      bundles: [
        {
          key: "a",
          title: "A",
          graphic: "steps",
          logo: "/a.png",
          graphic_steps: [
            { heading: "Scan", body: "body one", meta: "m1 · m2" },
            { heading: "Improve", body: "body two", meta: "" },
          ],
        },
      ],
    };
    const [b] = mapBundles(acf);
    expect(b.graphicSteps).toEqual([
      { heading: "Scan", body: "body one", meta: "m1 · m2" },
      { heading: "Improve", body: "body two" },
    ]);
  });

  it("builds the video object only for the video graphic", () => {
    const acf = {
      bundles: [
        {
          key: "zenn",
          title: "Z",
          graphic: "video",
          logo: "/z.png",
          video_poster: "/p.jpg",
          video_src: "/v.mp4",
          video_runtime: "4:06",
          video_eyebrow: "Live demo",
          video_title: "Watch",
          video_blurb: "A blurb",
          video_credit: "Credit line",
        },
        {
          key: "other",
          title: "O",
          graphic: "list",
          logo: "/o.png",
          video_poster: "/p.jpg",
        },
      ],
    };
    const [zenn, other] = mapBundles(acf);
    expect(zenn.video).toEqual({
      poster: "/p.jpg",
      src: "/v.mp4",
      runtime: "4:06",
      eyebrow: "Live demo",
      title: "Watch",
      blurb: "A blurb",
      credit: "Credit line",
    });
    expect(other.video).toBeUndefined();
  });

  it("defaults an unrecognised graphic to list", () => {
    const acf = {
      bundles: [{ key: "a", title: "A", graphic: "wat", logo: "/a.png" }],
    };
    expect(mapBundles(acf)[0].graphic).toBe("list");
  });

  it("drops optional strings that are empty", () => {
    const acf = {
      bundles: [
        {
          key: "a",
          title: "A",
          graphic: "list",
          logo: "/a.png",
          pointers_heading: "",
          lead_after: "",
          graphic_heading: "",
          graphic_footnote: "",
        },
      ],
    };
    const [b] = mapBundles(acf);
    expect(b.pointersHeading).toBeUndefined();
    expect(b.leadAfter).toBeUndefined();
    expect(b.graphicHeading).toBeUndefined();
    expect(b.graphicFootnote).toBeUndefined();
  });
});

describe("buildPartnerToc", () => {
  it("brackets one entry per bundle with the fixed head and tail", () => {
    const bundles = [
      { key: "zenn", title: "ZENN + Balance for Life" },
      { key: "medimart", title: "Medimart + Chronilogix" },
    ] as any;
    expect(buildPartnerToc(bundles)).toEqual([
      { id: null, label: "Overview" },
      { id: "ps-zenn-label", label: "ZENN + Balance for Life" },
      { id: "ps-medimart-label", label: "Medimart + Chronilogix" },
      { id: "ps-your-solution-label", label: "Your solution" },
      { id: "book-a-demo", label: "Book a demo" },
    ]);
  });

  it("still emits the head and tail with no bundles", () => {
    expect(buildPartnerToc([])).toEqual([
      { id: null, label: "Overview" },
      { id: "ps-your-solution-label", label: "Your solution" },
      { id: "book-a-demo", label: "Book a demo" },
    ]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm vitest run __tests__/lib/partnerSolutions.test.ts`
Expected: FAIL — `Failed to resolve import "@/lib/partnerSolutions"`.

- [ ] **Step 3: Write the implementation**

Create `lib/partnerSolutions.ts`:

```ts
/**
 * ACF → props mapping for the Partner Solutions page.
 *
 * Kept out of the page component so `app/partner-solutions/page.tsx` and
 * `components/Nav.tsx` share one mapper and cannot drift, and so the nested
 * repeater handling is unit testable.
 *
 * ACF returns `false` (not `undefined` or `[]`) for an empty repeater, at every
 * nesting level — hence `arr()` on both the outer `bundles` list and each of its
 * inner collections.
 */
import {
  BUNDLES,
  PARTNER_LOGOS,
  type Bundle,
  type BundleGraphic,
  type BundleStep,
  type PartnerLogo,
} from "@/components/partnerSolutions/partnerData";

/** Coerce an ACF repeater value to an array. */
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

/** Drop empty strings so a blank ACF field falls through to the default. */
const str = (x: unknown): string | undefined => {
  const s = typeof x === "string" ? x.trim() : "";
  return s === "" ? undefined : s;
};

/** Flatten a repeater of single-text-field rows to a string array. */
const textRows = (x: unknown): string[] =>
  arr(x)
    .map((r: any) => str(r?.text))
    .filter((s): s is string => !!s);

const GRAPHICS: BundleGraphic[] = ["video", "list", "steps"];

/**
 * Partner logos for the hero proof row and the Solutions nav promo card.
 * Falls back to the built-in defaults when the repeater is empty or absent.
 */
export function mapPartnerLogos(
  acf: Record<string, any> | null | undefined,
): PartnerLogo[] {
  const rows = arr(acf?.partner_logos)
    .map((r: any) => {
      const src = str(r?.logo);
      return src ? { src, alt: str(r?.alt) ?? "" } : null;
    })
    .filter((l): l is PartnerLogo => l !== null);

  return rows.length ? rows : PARTNER_LOGOS;
}

/**
 * The partner bundles. `index` is derived from position (1-based) rather than
 * stored, since its only job is the even/odd layout flip.
 */
export function mapBundles(
  acf: Record<string, any> | null | undefined,
): Bundle[] {
  const rows = arr(acf?.bundles).map((r: any, i: number): Bundle => {
    const graphic = GRAPHICS.includes(r?.graphic) ? r.graphic : "list";

    const steps: BundleStep[] = arr(r?.graphic_steps)
      .map((s: any) => {
        const heading = str(s?.heading);
        if (!heading) return null;
        const meta = str(s?.meta);
        return meta
          ? { heading, body: str(s?.body) ?? "", meta }
          : { heading, body: str(s?.body) ?? "" };
      })
      .filter((s): s is BundleStep => s !== null);

    const bundle: Bundle = {
      key: str(r?.key) ?? `bundle-${i + 1}`,
      index: i + 1,
      title: str(r?.title) ?? "",
      category: str(r?.category) ?? "",
      lead: textRows(r?.lead),
      pointers: textRows(r?.pointers),
      pointersHeading: str(r?.pointers_heading),
      leadAfter: str(r?.lead_after),
      tagline: str(r?.tagline) ?? "",
      graphic,
      graphicList: textRows(r?.graphic_list),
      graphicHeading: str(r?.graphic_heading),
      graphicFootnote: str(r?.graphic_footnote),
      graphicSteps: steps,
      logo: {
        src: str(r?.logo) ?? "",
        alt: str(r?.logo_alt) ?? "",
      },
    };

    if (graphic === "video") {
      bundle.video = {
        poster: str(r?.video_poster) ?? "",
        src: str(r?.video_src) ?? "",
        runtime: str(r?.video_runtime) ?? "",
        eyebrow: str(r?.video_eyebrow) ?? "",
        title: str(r?.video_title) ?? "",
        blurb: str(r?.video_blurb) ?? "",
        credit: str(r?.video_credit) ?? "",
      };
    }

    return bundle;
  });

  return rows.length ? rows : BUNDLES;
}

export type PartnerTocItem = { id: string | null; label: string };

/**
 * "On this page" wayfinder, derived from the bundles so adding a partner in
 * WordPress updates the TOC with no code change. The tail entries are the two
 * ids YourSolutionPanel carries: `ps-your-solution-label` on its <h2> and
 * `book-a-demo` on the <section> itself.
 */
export function buildPartnerToc(bundles: Bundle[]): PartnerTocItem[] {
  return [
    { id: null, label: "Overview" },
    ...bundles.map((b) => ({
      id: `ps-${b.key}-label`,
      label: b.title,
    })),
    { id: "ps-your-solution-label", label: "Your solution" },
    { id: "book-a-demo", label: "Book a demo" },
  ];
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm vitest run __tests__/lib/partnerSolutions.test.ts`
Expected: PASS, 18 tests.

- [ ] **Step 5: Run the full suite and build**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm test && pnpm lint && pnpm build`
Expected: all suites pass, lint clean, build succeeds.

---

### Task 5: Partner Solutions components

Four presentational components, ported from upstream and made prop-driven with `DEFAULTS` per the site convention.

**Files:**
- Create: `components/partnerSolutions/PartnerLogoChip.tsx`
- Create: `components/partnerSolutions/PartnerHero.tsx`
- Create: `components/partnerSolutions/PartnerBundle.tsx`
- Create: `components/partnerSolutions/YourSolutionPanel.tsx`

**Interfaces:**
- Consumes: `PartnerLogo`, `Bundle`, `PARTNER_LOGOS` from `@/components/partnerSolutions/partnerData`; `useReveal` from `@/components/hooks/useReveal`.
- Produces:
  - `PartnerLogoChip({ logo, className?, imgClassName?, pad? })`
  - `PartnerHero({ content? })` where `content?: PartnerHeroContent = { eyebrow?, headingLead?, headingBrand?, intro?, subintro?, ctaLabel?, ctaUrl?, logos? }`
  - `PartnerBundle({ bundle })` — `bundle: Bundle`
  - `YourSolutionPanel({ content? })` where `content?: YourSolutionContent = { headingBrand?, headingRest?, subLead?, subBrand?, body?, bodyBrand?, ctaHeadingLead?, ctaHeadingMuted?, ctaBody?, ctaLabel?, ctaUrl? }`

- [ ] **Step 1: Copy the four components across verbatim**

```bash
CH=/Users/zarah.sajjad/Documents/Chronilogix
WP=/Users/zarah.sajjad/Documents/next-wp-main
for n in PartnerLogoChip PartnerHero PartnerBundle YourSolutionPanel; do
  cp "$CH/components/partnerSolutions/$n.tsx" "$WP/components/partnerSolutions/$n.tsx"
done
```

- [ ] **Step 2: Fix the data-module import paths**

`PartnerLogoChip.tsx` and `PartnerBundle.tsx` import from `@/components/partnerSolutions/partnerData`, which now resolves to the `.ts` file created in Task 3 — the path is unchanged and no edit is needed. Confirm:

```bash
grep -rn "partnerData" /Users/zarah.sajjad/Documents/next-wp-main/components/partnerSolutions/
```
Expected: type-only imports in `PartnerLogoChip.tsx` and `PartnerBundle.tsx`, plus a `PARTNER_LOGOS` value import in `PartnerHero.tsx`. No `.tsx` extension appears in any specifier.

- [ ] **Step 3: Make `PartnerLogoChip` independent of the data module**

`PartnerLogoChip.tsx` needs no behavioural change, but keep it as-is — it already takes `logo` as a prop. Verify the file matches:

```tsx
import type { PartnerLogo } from "@/components/partnerSolutions/partnerData";

// Partner logos arrive on mismatched backgrounds (transparent PNG, white
// WEBP, white JPEG) — and all three are square canvases with generous
// internal padding. A white rounded chip normalizes the backgrounds; the
// caller controls the logo size via imgClassName (height-based for tight
// proof rows, `w-full` to fill a column) and chip padding via `pad`.
export function PartnerLogoChip({
  logo,
  className = "",
  imgClassName = "h-6 w-auto object-contain md:h-7",
  pad = "px-2.5 py-1.5",
}: {
  logo: PartnerLogo;
  className?: string;
  imgClassName?: string;
  pad?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_8px_20px_-14px_rgba(20,8,2,0.35)] ${pad} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.alt}
        className={imgClassName}
        draggable={false}
      />
    </span>
  );
}
```

- [ ] **Step 4: Make `PartnerHero` prop-driven**

Replace the top of `PartnerHero.tsx` (everything from the imports down to and including the `export function PartnerHero() {` line) with:

```tsx
"use client";

import { useReveal } from "@/components/hooks/useReveal";
import {
  PARTNER_LOGOS,
  type PartnerLogo,
} from "@/components/partnerSolutions/partnerData";

export type PartnerHeroContent = {
  eyebrow?: string;
  headingLead?: string;
  headingBrand?: string;
  intro?: string;
  subintro?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  logos?: PartnerLogo[];
};

const DEFAULTS = {
  eyebrow: "Partner Solutions",
  headingLead: "Extend Your Solution.",
  headingBrand: "Increase Your Value.",
  intro:
    "Chronilogix doesn’t replace your product — we make it smarter, more engaging, and more effective through continuous AI coaching.",
  subintro: "Three examples of how we bundle with industry leaders.",
  ctaLabel: "Book a Demo",
  ctaUrl: "#book-a-demo",
  logos: PARTNER_LOGOS,
};

/**
 * PartnerHero — /partner-solutions opener. Reframes the pitch: Chronilogix
 * doesn't replace your product, it extends it. The partner logos sit under
 * the CTA as proof that industry leaders already bundle with Chronilogix.
 *
 * Reuses the warm gradient + stacked radial-glow shell from VendorsHero,
 * with a simpler CSS reveal (useReveal + .reveal-row) rather than the
 * per-word RAF reveal.
 */
export function PartnerHero({ content }: { content?: PartnerHeroContent }) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const c = { ...DEFAULTS, ...content };
  const logos = c.logos?.length ? c.logos : DEFAULTS.logos;
```

Then substitute the hardcoded copy in the JSX below with the `c.*` values, keeping every class and wrapper element untouched:

- eyebrow `<p>` body → `{c.eyebrow}`
- `<h1>` body → `{c.headingLead}{" "}` then `<span className="italic text-brand-700">{c.headingBrand}</span>`
- intro `<p>` body → `{c.intro}`
- sub-intro `<p>` body → `{c.subintro}`
- CTA `<a href="#book-a-demo">` → `<a href={c.ctaUrl}>`, and its leading text node → `{c.ctaLabel}` (keep the trailing `<svg>` arrow exactly as-is)
- `PARTNER_LOGOS.map((logo) => (` → `logos.map((logo) => (`

Remove the now-stale `{/* TODO: Calendly URL */}` comment above the CTA, since the URL is configurable in WordPress.

- [ ] **Step 5: Make `YourSolutionPanel` prop-driven**

Replace the top of `YourSolutionPanel.tsx` (imports through the `export function` line) with:

```tsx
"use client";

import { useReveal } from "@/components/hooks/useReveal";

export type YourSolutionContent = {
  headingBrand?: string;
  headingRest?: string;
  subLead?: string;
  subBrand?: string;
  body?: string;
  bodyBrand?: string;
  ctaHeadingLead?: string;
  ctaHeadingMuted?: string;
  ctaBody?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

const DEFAULTS = {
  headingBrand: "Your Solution",
  headingRest: "+ Chronilogix",
  subLead: "Imagine what AI coaching could do for",
  subBrand: "your organization.",
  body: "Whether you provide wellness programs, digital health platforms, pharmacies, medical devices, health screenings, employer benefits, disease management, remote monitoring, nutrition, or telehealth —",
  bodyBrand: "there’s a coaching layer to add.",
  ctaHeadingLead: "Already have a healthcare solution?",
  ctaHeadingMuted: "Let’s build something better together.",
  ctaBody:
    "Chronilogix can add a clinically grounded, Motivational Interviewing-based AI coaching layer that increases engagement, improves outcomes, and creates new value for your members.",
  ctaLabel: "Book a Demo",
  ctaUrl: "#book-a-demo",
};

/**
 * YourSolutionPanel — the fourth panel + closing CTA. Turns the three
 * examples into an open invitation: whatever the visitor already runs,
 * Chronilogix can add the coaching layer on top. Chronilogix is the subject
 * of the resolution and the sign-off. Carries id="book-a-demo" so every
 * page CTA resolves here.
 */
export function YourSolutionPanel({
  content,
}: {
  content?: YourSolutionContent;
}) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const c = { ...DEFAULTS, ...content };
```

Then substitute in the JSX, keeping every class, gradient and wrapper untouched:

- `<h2 id="ps-your-solution-label">` body → `<span className="italic text-brand-700">{c.headingBrand}</span>{" "}{c.headingRest}`
- `<h3>` body → `{c.subLead}{" "}` then `<span className="italic text-brand-700">{c.subBrand}</span>`
- the prose `<p>` body → `{c.body}{" "}` then `<span className="text-brand-700">{c.bodyBrand}</span>`
- `<h4>` body → `{c.ctaHeadingLead}{" "}` then `<span className="text-paper/60">{c.ctaHeadingMuted}</span>`
- the CTA `<p>` body → `{c.ctaBody}`
- `<a href="#book-a-demo">` → `<a href={c.ctaUrl}>`, leading text node → `{c.ctaLabel}` (keep the `<svg>` arrow)

Keep `id="book-a-demo"` on the `<section>` and `id="ps-your-solution-label"` on the `<h2>` — `buildPartnerToc` targets both. Remove the `{/* TODO: Calendly URL */}` comment.

- [ ] **Step 6: Leave `PartnerBundle` as-is**

`PartnerBundle.tsx` already takes its content entirely through the `bundle` prop, so it needs no refactor. Two things to verify rather than change:

1. `graphicListIcons(bundle.key)` switches on the literal `"medimart"`. This keeps working because `key` is an ACF field seeded with that value. Do not change it.
2. The `Bundle` type import must resolve to Task 3's module and must not reference the dropped `glyph` / `iconVariant` fields.

Run:
```bash
grep -n 'glyph\|iconVariant' /Users/zarah.sajjad/Documents/next-wp-main/components/partnerSolutions/PartnerBundle.tsx
```
Expected: only two comment-line hits (the `• glyph —` docblock line and the `list/glyph graphic cards` comment). No property access. Leave the comments alone.

- [ ] **Step 7: Verify the build**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm lint && pnpm build`
Expected: clean. Components are not yet routed, so this proves compilation only.

---

### Task 6: Split the Nav and wire the partner promo card

`Nav` currently is one `"use client"` file rendered from 16 server pages/layouts. It must read ACF partner logos, so it splits into an async server shell plus the existing client implementation.

**Files:**
- Create: `components/nav/NavClient.tsx` (from the existing `components/Nav.tsx`)
- Modify: `components/Nav.tsx` (reduced to the server shell)

**Interfaces:**
- Consumes: `mapPartnerLogos` from `@/lib/partnerSolutions`; `getPageAcf` from `@/lib/acf`; `PARTNER_LOGOS`, `NAV_CARD_DEFAULTS`, `PartnerLogo` from `@/components/partnerSolutions/partnerData`; `PartnerLogoChip`.
- Produces: `Nav()` — an **async** server component taking no props, still exported from `@/components/Nav`. All 16 existing `<Nav />` call sites stay byte-identical. `NavClient({ partnerLogos?, partnerCard? })` is internal to this task's two files.

- [ ] **Step 1: Merge the upstream Nav changes into the current file**

Upstream's Nav changes merge with **zero conflicts** against the `next-wp-main` copy.

```bash
CH=/Users/zarah.sajjad/Documents/Chronilogix
WP=/Users/zarah.sajjad/Documents/next-wp-main
SP=/private/tmp/claude-924138849/-Users-zarah-sajjad-Documents-next-wp-main/1fe6bc7f-269e-4cfd-9be0-8bc08a66432c/scratchpad
f=components/Nav.tsx

git -C "$CH" show "bea0cee:$f" > "$SP/merge/Nav.tsx.base"
git -C "$CH" show "9cf57bd:$f" > "$SP/merge/Nav.tsx.theirs"
cp "$WP/$f" "$SP/merge/Nav.tsx.ours"
cp "$SP/merge/Nav.tsx.ours" "$SP/merge/Nav.tsx.merged"
git merge-file -L ours -L base -L theirs \
  "$SP/merge/Nav.tsx.merged" "$SP/merge/Nav.tsx.base" "$SP/merge/Nav.tsx.theirs"
echo "conflicts: $(grep -c '^<<<<<<<' "$SP/merge/Nav.tsx.merged")"
```

Expected: `conflicts: 0`. If not, STOP and report.

- [ ] **Step 2: Install the merged file as `NavClient.tsx`**

```bash
mkdir -p /Users/zarah.sajjad/Documents/next-wp-main/components/nav
cp "$SP/merge/Nav.tsx.merged" \
   /Users/zarah.sajjad/Documents/next-wp-main/components/nav/NavClient.tsx
```

Note: `components/nav/mobile-nav.tsx` already exists in that directory — it is unrelated starter-template code. Do not touch it.

- [ ] **Step 3: Verify the upstream additions landed**

Run:
```bash
grep -c 'SolutionsIcon\|PartnerSolutionsMenuCard\|PARTNER_CARD_BG\|w-\[940px\]\|lg:gap-5 xl:gap-8' \
  /Users/zarah.sajjad/Documents/next-wp-main/components/nav/NavClient.tsx
```
Expected: a non-zero count covering all five markers. Individually confirm each is present:
- `const SolutionsIcon = (` — the 2×2 gradient tile glyph
- `icon?: ReactNode;` on the `NavLink` type, and `icon: SolutionsIcon` on the Solutions entry in `NAV_LINKS`
- `{link.icon}` rendered in the desktop trigger **and** in the mobile accordion `<span className="flex items-center gap-2">`
- `const PARTNER_CARD_BG =` and `function PartnerSolutionsMenuCard()`
- `<PartnerSolutionsMenuCard />` inside `SolutionsPanel`'s left column, panel `w-[940px]`, grid `grid-cols-[1fr_1.11fr]`
- the partner promo `<a href="/partner-solutions">` at the top of `SolutionsMobileMenu`
- nav row `lg:px-8`, links `lg:flex items-center gap-5 xl:gap-8`, link wrapper `relative flex items-center`

- [ ] **Step 4: Rename the export and add the two props**

In `components/nav/NavClient.tsx`:

Change `export function Nav() {` to:

```tsx
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
```

Update the import that the merge brought in from upstream — it currently reads:

```tsx
import { PARTNER_LOGOS } from "@/components/partnerSolutions/partnerData";
import { PartnerLogoChip } from "@/components/partnerSolutions/PartnerLogoChip";
```

Change the first line to also pull the defaults and the type:

```tsx
import {
  NAV_CARD_DEFAULTS,
  PARTNER_LOGOS,
  type PartnerLogo,
} from "@/components/partnerSolutions/partnerData";
import { PartnerLogoChip } from "@/components/partnerSolutions/PartnerLogoChip";
```

- [ ] **Step 5: Thread `logos` and `card` down to the two promo cards**

`PartnerSolutionsMenuCard` and the mobile promo block both currently read the module-level `PARTNER_LOGOS` and hardcoded copy. `PartnerSolutionsMenuCard` is a sibling function, so give it props:

```tsx
function PartnerSolutionsMenuCard({
  logos,
  card,
}: {
  logos: PartnerLogo[];
  card: { title: string; hook: string };
}) {
```

Inside it, replace `Partner Solutions` with `{card.title}`, the hook sentence with `{card.hook}`, and `PARTNER_LOGOS.map` with `logos.map`.

`SolutionsPanel` renders it, so `SolutionsPanel` must accept and forward them too. Extend its props:

```tsx
function SolutionsPanel({
  onOpenPersona,
  logos,
  card,
}: {
  onOpenPersona: (key: string) => void;
  logos: PartnerLogo[];
  card: { title: string; hook: string };
}) {
```

and its render site inside it:

```tsx
          <PartnerSolutionsMenuCard logos={logos} card={card} />
```

Do the same for `SolutionsMobileMenu` — add `logos` and `card` to its props, then in its promo `<a>` replace the two hardcoded strings with `{card.title}` / `{card.hook}` and `PARTNER_LOGOS.map` with `logos.map`.

Finally, in `NavClient`'s JSX, pass `logos={logos} card={card}` to both `<SolutionsPanel …>` and `<SolutionsMobileMenu …>`.

- [ ] **Step 6: Confirm no stray module-level logo reads remain**

Run:
```bash
grep -n 'PARTNER_LOGOS' /Users/zarah.sajjad/Documents/next-wp-main/components/nav/NavClient.tsx
```
Expected: exactly two hits — the import, and the `partnerLogos?.length ? partnerLogos : PARTNER_LOGOS` fallback. No `.map` call on it.

- [ ] **Step 7: Replace `components/Nav.tsx` with the server shell**

Overwrite `components/Nav.tsx` entirely:

```tsx
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
```

Note this passes `nav_card_title` / `nav_card_hook` straight through, so both may be `undefined` when WordPress is empty — which is exactly why Step 4 used explicit `||` fallbacks in `NavClient` rather than a spread.

- [ ] **Step 8: Verify no call site needed changing**

Run:
```bash
grep -rn 'from "@/components/Nav"' /Users/zarah.sajjad/Documents/next-wp-main/app | wc -l
```
Expected: `16`. Every one still imports `{ Nav }` from the same path.

- [ ] **Step 9: Verify the build**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm lint && pnpm build`
Expected: clean. If any page errors with "async Client Component", that page is a client component and needs investigating — all 16 were server components when this plan was written.

- [ ] **Step 10: Verify the nav renders with WordPress absent**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && WORDPRESS_URL= pnpm build`
Expected: build succeeds — `getPageAcf` short-circuits to `null` on an unset `baseUrl` and the defaults render.

---

### Task 7: The `/partner-solutions` route

**Files:**
- Create: `app/partner-solutions/page.tsx`

**Interfaces:**
- Consumes: `mapBundles`, `mapPartnerLogos`, `buildPartnerToc` from `@/lib/partnerSolutions`; `getPageAcf`; the four components from Task 5; `Nav`, `Footer`, `PageLoader`, `CoachLauncher`, `PageNav`.
- Produces: the route. Nothing imports from it.

- [ ] **Step 1: Create the page**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { Footer } from "@/components/Footer";
import { CoachLauncher } from "@/components/CoachLauncher";
import { PartnerHero } from "@/components/partnerSolutions/PartnerHero";
import { PartnerBundle } from "@/components/partnerSolutions/PartnerBundle";
import { YourSolutionPanel } from "@/components/partnerSolutions/YourSolutionPanel";
import { getPageAcf } from "@/lib/acf";
import {
  buildPartnerToc,
  mapBundles,
  mapPartnerLogos,
} from "@/lib/partnerSolutions";
import { PageNav } from "@/components/widget/pageNav";

export const metadata: Metadata = {
  title: "Partner Solutions · Chronilogix",
  description:
    "Chronilogix doesn't replace your product — it makes it smarter, more engaging, and more effective through continuous AI coaching. See how industry leaders like Balance for Life, Medimart, and Hibiscus Health extend their solutions with Chronilogix.",
};

/**
 * /partner-solutions — the bundled-solutions showcase. Reframes the pitch
 * from "buy AI coaching" to "Chronilogix makes your existing product more
 * valuable," with live partner bundles as light case studies and an open
 * "Your Solution + Chronilogix" invitation to close.
 *
 * Section order:
 *   1. Hero                — Extend Your Solution. Increase Your Value.
 *   2..n. Bundles          — one case study per partner (ACF-driven)
 *   last. Your Solution    — the open invitation + closing CTA (#book-a-demo)
 *
 * The "On this page" wayfinder is derived from the bundles, so adding a
 * partner in WordPress updates it with no code change.
 */
export default async function PartnerSolutionsPage() {
  const s = (await getPageAcf<Record<string, any>>("partner-solutions")) ?? {};

  const bundles = mapBundles(s);
  const toc = buildPartnerToc(bundles);

  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        {/* Single padded card system — same rhythm as /solutions/*. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <PartnerHero
            content={{
              eyebrow: s.hero_eyebrow,
              headingLead: s.hero_heading_lead,
              headingBrand: s.hero_heading_brand,
              intro: s.hero_intro,
              subintro: s.hero_subintro,
              ctaLabel: s.hero_cta_label,
              ctaUrl: s.hero_cta_url,
              logos: mapPartnerLogos(s),
            }}
          />
          {bundles.map((bundle) => (
            <PartnerBundle key={bundle.key} bundle={bundle} />
          ))}
          <YourSolutionPanel
            content={{
              headingBrand: s.closing_heading_brand,
              headingRest: s.closing_heading_rest,
              subLead: s.closing_sub_lead,
              subBrand: s.closing_sub_brand,
              body: s.closing_body,
              bodyBrand: s.closing_body_brand,
              ctaHeadingLead: s.cta_heading_lead,
              ctaHeadingMuted: s.cta_heading_muted,
              ctaBody: s.cta_body,
              ctaLabel: s.cta_label,
              ctaUrl: s.cta_url,
            }}
          />
        </div>
      </main>

      <Footer />

      {/* "On this page" wayfinder, derived from the bundles. */}
      <PageNav
        items={toc}
        revealId={bundles[0] ? `ps-${bundles[0].key}-label` : undefined}
        navLabel="Partner solutions sections"
      />

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
```

- [ ] **Step 2: Check `PageNav`'s `revealId` accepts `undefined`**

Run:
```bash
grep -n 'revealId' /Users/zarah.sajjad/Documents/next-wp-main/components/widget/pageNav.tsx
```
If `revealId` is typed as a required `string`, change the page to pass a plain string fallback instead:

```tsx
        revealId={bundles[0] ? `ps-${bundles[0].key}-label` : "book-a-demo"}
```

Do not widen `pageNav.tsx`'s own types — it is shared by nine other pages.

- [ ] **Step 3: Verify the build and the route**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm lint && pnpm build`
Expected: clean, and the build output lists `/partner-solutions` among the routes.

- [ ] **Step 4: Verify the page renders on defaults**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm dev`

Load `http://localhost:3000/partner-solutions`. WordPress has no `partner-solutions` page yet, so `getPageAcf` returns `null` and everything must render from `DEFAULTS`:
- hero with three logos under the CTA
- three bundle sections — ZENN (video poster, play button), Medimart (2-up icon list, `col-span-2` last row, footnote), Hibiscus (three connected step blocks)
- bundles 1 and 3 with the graphic on the right, bundle 2 flipped (graphic on the left — `index % 2 === 0`)
- closing panel with the dark CTA slab
- PageNav listing Overview → 3 bundles → Your solution → Book a demo

Also open the Solutions nav dropdown and confirm the Partner Solutions promo card renders with three chipped logos, and that the Solutions nav item shows the gradient glyph. Stop the dev server when done.

---

### Task 8: ACF field group

**Files:**
- Create: `/Users/zarah.sajjad/Local Sites/chronologix/app/public/wp-content/mu-plugins/chronilogix-acf/partner-solutions.php`

**Interfaces:**
- Consumes: `chronilogix_acf_page_location($slug)` from the parent mu-plugin.
- Produces: field names read by `lib/partnerSolutions.ts` and `app/partner-solutions/page.tsx` — `hero_eyebrow`, `hero_heading_lead`, `hero_heading_brand`, `hero_intro`, `hero_subintro`, `hero_cta_label`, `hero_cta_url`, `partner_logos[{logo,alt}]`, `nav_card_title`, `nav_card_hook`, `bundles[{key,title,category,lead[{text}],pointers_heading,pointers[{text}],lead_after,tagline,graphic,graphic_heading,graphic_list[{text}],graphic_footnote,graphic_steps[{heading,body,meta}],logo,logo_alt,video_poster,video_src,video_runtime,video_eyebrow,video_title,video_blurb,video_credit}]`, `closing_heading_brand`, `closing_heading_rest`, `closing_sub_lead`, `closing_sub_brand`, `closing_body`, `closing_body_brand`, `cta_heading_lead`, `cta_heading_muted`, `cta_body`, `cta_label`, `cta_url`.

- [ ] **Step 1: Confirm the mu-plugin auto-loads new files**

Run:
```bash
sed -n '40,80p' "/Users/zarah.sajjad/Local Sites/chronologix/app/public/wp-content/mu-plugins/chronilogix-acf.php"
```

Read how sibling files are included. If it globs the `chronilogix-acf/` directory, the new file loads automatically. If it lists files explicitly, add `partner-solutions.php` to that list in this step.

- [ ] **Step 2: Create the field group**

```php
<?php
/**
 * ACF field group for the Partner Solutions page (slug: partner-solutions).
 * Tab per section. Image fields return a URL string. Repeaters model repeating
 * collections; `bundles` nests repeaters for its paragraph/pointer/step lists.
 *
 * The partner_logos repeater feeds two surfaces: the hero proof row on this
 * page, and the Partner Solutions promo card in the Solutions nav menu (read by
 * components/Nav.tsx via the same page slug).
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_partner_solutions',
    'title'        => 'Partner Solutions',
    'location'     => chronilogix_acf_page_location('partner-solutions'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'fields'       => [

        // ── Hero ────────────────────────────────────────────────────────────
        [ 'key'=>'field_ps_hero_tab', 'label'=>'Hero', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ps_hero_eyebrow', 'label'=>'Eyebrow', 'name'=>'hero_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_ps_hero_heading_lead', 'label'=>'Heading (lead)', 'name'=>'hero_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_ps_hero_heading_brand', 'label'=>'Heading (italic brand)', 'name'=>'hero_heading_brand', 'type'=>'text' ],
        [ 'key'=>'field_ps_hero_intro', 'label'=>'Intro paragraph', 'name'=>'hero_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_ps_hero_subintro', 'label'=>'Sub-intro (quiet line)', 'name'=>'hero_subintro', 'type'=>'text' ],
        [ 'key'=>'field_ps_hero_cta_label', 'label'=>'CTA label', 'name'=>'hero_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_ps_hero_cta_url', 'label'=>'CTA url', 'name'=>'hero_cta_url', 'type'=>'text' ],

        // ── Partner logos ───────────────────────────────────────────────────
        [ 'key'=>'field_ps_logos_tab', 'label'=>'Partner logos', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ps_partner_logos', 'label'=>'Partner logos (hero proof row + Solutions nav card)', 'name'=>'partner_logos', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ps_partner_logos_logo', 'label'=>'Logo (transparent PNG preferred)', 'name'=>'logo', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_ps_partner_logos_alt', 'label'=>'Alt text', 'name'=>'alt', 'type'=>'text' ],
        ] ],

        // ── Nav card ────────────────────────────────────────────────────────
        [ 'key'=>'field_ps_nav_tab', 'label'=>'Nav card', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ps_nav_card_title', 'label'=>'Solutions menu card — title', 'name'=>'nav_card_title', 'type'=>'text' ],
        [ 'key'=>'field_ps_nav_card_hook', 'label'=>'Solutions menu card — hook', 'name'=>'nav_card_hook', 'type'=>'textarea' ],

        // ── Bundles ─────────────────────────────────────────────────────────
        [ 'key'=>'field_ps_bundles_tab', 'label'=>'Bundles', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ps_bundles', 'label'=>'Partner bundles (order sets the layout flip)', 'name'=>'bundles', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ps_b_key', 'label'=>'Key (slug; drives the "on this page" anchor)', 'name'=>'key', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_category', 'label'=>'Category eyebrow', 'name'=>'category', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_lead', 'label'=>'Lead paragraphs', 'name'=>'lead', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_ps_b_lead_text', 'label'=>'Paragraph', 'name'=>'text', 'type'=>'textarea' ],
            ] ],
            [ 'key'=>'field_ps_b_pointers_heading', 'label'=>'Pointers heading (leave empty to hide)', 'name'=>'pointers_heading', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_pointers', 'label'=>'Pointers (bullet rows)', 'name'=>'pointers', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_ps_b_pointers_text', 'label'=>'Pointer', 'name'=>'text', 'type'=>'text' ],
            ] ],
            [ 'key'=>'field_ps_b_lead_after', 'label'=>'Resolution paragraph (after the pointers)', 'name'=>'lead_after', 'type'=>'textarea' ],
            [ 'key'=>'field_ps_b_tagline', 'label'=>'Tagline (italic serif, inside the graphic card)', 'name'=>'tagline', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_graphic', 'label'=>'Graphic type', 'name'=>'graphic', 'type'=>'select', 'choices'=>[
                'video' => 'Video (demo card)',
                'list'  => 'List (icon-tile grid)',
                'steps' => 'Steps (connected blocks)',
            ], 'default_value'=>'list', 'return_format'=>'value' ],
            [ 'key'=>'field_ps_b_graphic_heading', 'label'=>'Graphic list heading', 'name'=>'graphic_heading', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_graphic_list', 'label'=>'Graphic list items', 'name'=>'graphic_list', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_ps_b_graphic_list_text', 'label'=>'Item', 'name'=>'text', 'type'=>'text' ],
            ] ],
            [ 'key'=>'field_ps_b_graphic_footnote', 'label'=>'Graphic list footnote', 'name'=>'graphic_footnote', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_graphic_steps', 'label'=>'Graphic steps', 'name'=>'graphic_steps', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_ps_b_graphic_steps_heading', 'label'=>'Heading', 'name'=>'heading', 'type'=>'text' ],
                [ 'key'=>'field_ps_b_graphic_steps_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
                [ 'key'=>'field_ps_b_graphic_steps_meta', 'label'=>'Meta (middot list)', 'name'=>'meta', 'type'=>'text' ],
            ] ],
            [ 'key'=>'field_ps_b_logo', 'label'=>'Partner logo', 'name'=>'logo', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_ps_b_logo_alt', 'label'=>'Partner logo alt text', 'name'=>'logo_alt', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_video_poster', 'label'=>'Video poster', 'name'=>'video_poster', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_ps_b_video_src', 'label'=>'Video src (path or url)', 'name'=>'video_src', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_video_runtime', 'label'=>'Video runtime', 'name'=>'video_runtime', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_video_eyebrow', 'label'=>'Video eyebrow', 'name'=>'video_eyebrow', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_video_title', 'label'=>'Video title', 'name'=>'video_title', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_video_blurb', 'label'=>'Video blurb', 'name'=>'video_blurb', 'type'=>'textarea' ],
            [ 'key'=>'field_ps_b_video_credit', 'label'=>'Video credit line', 'name'=>'video_credit', 'type'=>'text' ],
        ] ],

        // ── Closing panel ───────────────────────────────────────────────────
        [ 'key'=>'field_ps_closing_tab', 'label'=>'Closing', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ps_closing_heading_brand', 'label'=>'Heading (italic brand)', 'name'=>'closing_heading_brand', 'type'=>'text' ],
        [ 'key'=>'field_ps_closing_heading_rest', 'label'=>'Heading (rest)', 'name'=>'closing_heading_rest', 'type'=>'text' ],
        [ 'key'=>'field_ps_closing_sub_lead', 'label'=>'Sub-heading (lead)', 'name'=>'closing_sub_lead', 'type'=>'text' ],
        [ 'key'=>'field_ps_closing_sub_brand', 'label'=>'Sub-heading (italic brand)', 'name'=>'closing_sub_brand', 'type'=>'text' ],
        [ 'key'=>'field_ps_closing_body', 'label'=>'Body', 'name'=>'closing_body', 'type'=>'textarea' ],
        [ 'key'=>'field_ps_closing_body_brand', 'label'=>'Body (brand-tinted tail)', 'name'=>'closing_body_brand', 'type'=>'text' ],
        [ 'key'=>'field_ps_cta_heading_lead', 'label'=>'CTA heading (bright)', 'name'=>'cta_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_ps_cta_heading_muted', 'label'=>'CTA heading (muted)', 'name'=>'cta_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_ps_cta_body', 'label'=>'CTA body', 'name'=>'cta_body', 'type'=>'textarea' ],
        [ 'key'=>'field_ps_cta_label', 'label'=>'CTA label', 'name'=>'cta_label', 'type'=>'text' ],
        [ 'key'=>'field_ps_cta_url', 'label'=>'CTA url', 'name'=>'cta_url', 'type'=>'text' ],
    ],
]);
```

- [ ] **Step 3: Verify the PHP parses**

Run:
```bash
PHP="$HOME/Library/Application Support/Local/lightning-services/php-8.2.29+0/bin/darwin-arm64/bin/php"
"$PHP" -l "/Users/zarah.sajjad/Local Sites/chronologix/app/public/wp-content/mu-plugins/chronilogix-acf/partner-solutions.php"
```
Expected: `No syntax errors detected`.

If that PHP path no longer exists, find it with:
```bash
ls ~/Library/Application\ Support/Local/lightning-services/ | grep php
```

- [ ] **Step 4: Verify the group registers**

Confirm the Local site is running (check the Local app, or `curl -sI http://chronologix.local | head -1`), then:

```bash
export PATH="$HOME/.local/bin:$PATH"
wpx eval 'var_dump( (bool) acf_get_local_field_group("group_partner_solutions") );'
```
Expected: `bool(true)`.

If `wpx` is not found or the DB socket has moved, re-find the socket and fix the wrapper:
```bash
find ~/Library/Application\ Support/Local/run -name mysqld.sock
```

---

### Task 9: Seed the WordPress content

**Files:**
- Create: `wordpress/acf-seeds/seed-partner-solutions.php`

**Interfaces:**
- Consumes: `chr_page`, `chr_media`, `chr_fields` from `wordpress/acf-seeds/_helpers.php`; the field names from Task 8.
- Produces: a published WordPress Page at slug `partner-solutions` with all fields populated.

- [ ] **Step 1: Read a sibling seeder for the exact conventions**

Run:
```bash
sed -n '1,40p' /Users/zarah.sajjad/Documents/next-wp-main/wordpress/acf-seeds/seed-solutions-app-partners.php
```

Match its header, `_helpers.php` require style, and `WP_CLI::success` sign-off. Follow whatever it does rather than inventing a new shape.

- [ ] **Step 2: Write the seeder**

Create `wordpress/acf-seeds/seed-partner-solutions.php`:

```php
<?php
/**
 * Seed the Partner Solutions page (slug: partner-solutions).
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-partner-solutions.php
 * Idempotent — the page is matched by slug and media is imported once.
 */

require_once __DIR__ . '/_helpers.php';

$page_id = chr_page('partner-solutions', 'Partner Solutions');
if (!$page_id) {
    WP_CLI::error('could not resolve the partner-solutions page');
}

$balance  = chr_media('partners/balance-for-life-logo.png');
$medimart = chr_media('partners/medimart-logo.png');
$hibiscus = chr_media('partners/hibiscus-health-logo.png');
$poster   = chr_media('video/zenn-demo-poster.jpg');

chr_fields($page_id, [
    // ── Hero ────────────────────────────────────────────────────────────
    'hero_eyebrow'      => 'Partner Solutions',
    'hero_heading_lead' => 'Extend Your Solution.',
    'hero_heading_brand' => 'Increase Your Value.',
    'hero_intro'        => 'Chronilogix doesn’t replace your product — we make it smarter, more engaging, and more effective through continuous AI coaching.',
    'hero_subintro'     => 'Three examples of how we bundle with industry leaders.',
    'hero_cta_label'    => 'Book a Demo',
    'hero_cta_url'      => '#book-a-demo',

    // ── Partner logos (hero proof row + Solutions nav card) ──────────────
    'partner_logos' => [
        [ 'logo' => $balance,  'alt' => 'Balance for Life' ],
        [ 'logo' => $medimart, 'alt' => 'Medimart' ],
        [ 'logo' => $hibiscus, 'alt' => 'Hibiscus Health' ],
    ],

    // ── Nav card ────────────────────────────────────────────────────────
    'nav_card_title' => 'Partner Solutions',
    'nav_card_hook'  => 'See how Chronilogix makes existing healthcare products more valuable.',

    // ── Bundles ─────────────────────────────────────────────────────────
    'bundles' => [
        [
            'key'      => 'zenn',
            'title'    => 'ZENN + Balance for Life',
            'category' => 'AI-Powered Behavioral Wellness',
            'lead'     => [
                [ 'text' => 'Balance for Life provides an excellent wellness platform. ZENN, powered by Chronilogix, provides the continuous behavioral coaching between moments that keeps members engaged.' ],
                [ 'text' => 'Instead of opening the app only occasionally, members have a trusted AI coach available 24/7 that remembers their goals, conversations, and progress.' ],
            ],
            'pointers_heading' => 'Together they deliver',
            'pointers' => [
                [ 'text' => 'Continuous behavioral coaching' ],
                [ 'text' => 'Higher member engagement' ],
                [ 'text' => 'Increased retention' ],
                [ 'text' => 'Better emotional wellbeing' ],
                [ 'text' => 'A more valuable wellness platform' ],
            ],
            'lead_after' => '',
            'tagline'    => 'A wellness platform with a coach that never sleeps.',
            'graphic'    => 'video',
            'logo'       => $balance,
            'logo_alt'   => 'Balance for Life',
            'video_poster'  => $poster,
            'video_src'     => '/video/zenn-demo.mp4',
            'video_runtime' => '4:06',
            'video_eyebrow' => 'Live demo',
            'video_title'   => 'See Chronilogix, white-labeled as Zenn',
            'video_blurb'   => 'Our platform in action, running inside a partner’s own app.',
            'video_credit'  => 'ZENN powered by Chronilogix',
        ],
        [
            'key'      => 'medimart',
            'title'    => 'Medimart + Chronilogix',
            'category' => 'Affordable Medications + Better Outcomes',
            'lead'     => [
                [ 'text' => 'Getting affordable medications is only half the battle. Patients still need help:' ],
            ],
            'pointers_heading' => '',
            'pointers' => [
                [ 'text' => 'Remembering medications' ],
                [ 'text' => 'Staying motivated' ],
                [ 'text' => 'Changing behaviors' ],
                [ 'text' => 'Improving nutrition' ],
                [ 'text' => 'Managing diabetes' ],
                [ 'text' => 'Coping with anxiety and depression' ],
            ],
            'lead_after' => 'Together, Medimart and Chronilogix combine affordable medications with free AI coaching for diabetes and mental health, helping patients bridge the gap between receiving a prescription and achieving better health outcomes.',
            'tagline'    => 'Lower prescription costs. Better health outcomes.',
            'graphic'    => 'list',
            'graphic_heading' => 'With Medimart + Chronilogix',
            'graphic_list' => [
                [ 'text' => 'Lower medication costs' ],
                [ 'text' => 'Better medication adherence' ],
                [ 'text' => 'Diabetes coaching' ],
                [ 'text' => 'Mental health support' ],
                [ 'text' => 'Improved long-term outcomes' ],
            ],
            'graphic_footnote' => 'Prescriptions that reach the outcome',
            'logo'     => $medimart,
            'logo_alt' => 'Medimart',
        ],
        [
            'key'      => 'hibiscus',
            'title'    => 'Hibiscus Health + Chronilogix',
            'category' => 'Screening Meets Sustained Behavior Change',
            'lead'     => [
                [ 'text' => 'Hibiscus Health helps identify health risks through advanced scanning technology. Chronilogix transforms those insights into personalized action by delivering ongoing AI coaching based on each individual’s results, goals, behaviors, and progress.' ],
                [ 'text' => 'Instead of receiving a report and being left on their own, members receive continuous support to help them make meaningful lifestyle changes.' ],
            ],
            'pointers_heading' => 'Together they deliver',
            'pointers' => [
                [ 'text' => 'Early risk identification' ],
                [ 'text' => 'Personalized coaching informed by scan results' ],
                [ 'text' => 'Chronic disease prevention' ],
                [ 'text' => 'Continuous engagement between healthcare visits' ],
                [ 'text' => 'Better long-term health outcomes' ],
            ],
            'lead_after' => '',
            'tagline'    => 'Scan. Understand. Improve.',
            'graphic'    => 'steps',
            'graphic_steps' => [
                [
                    'heading' => 'Scan',
                    'body'    => 'Advanced scanning technology flags health risks early — before they surface as claims.',
                    'meta'    => 'Biomarkers · vitals · risk factors',
                ],
                [
                    'heading' => 'Understand',
                    'body'    => 'Chronilogix turns each result into a personalized plan built around the member’s goals and behaviors.',
                    'meta'    => 'Results · goals · progress',
                ],
                [
                    'heading' => 'Improve',
                    'body'    => 'Ongoing AI coaching between visits drives meaningful, lasting lifestyle change.',
                    'meta'    => '24/7 support · continuous care',
                ],
            ],
            'logo'     => $hibiscus,
            'logo_alt' => 'Hibiscus Health',
        ],
    ],

    // ── Closing panel ───────────────────────────────────────────────────
    'closing_heading_brand' => 'Your Solution',
    'closing_heading_rest'  => '+ Chronilogix',
    'closing_sub_lead'      => 'Imagine what AI coaching could do for',
    'closing_sub_brand'     => 'your organization.',
    'closing_body'          => 'Whether you provide wellness programs, digital health platforms, pharmacies, medical devices, health screenings, employer benefits, disease management, remote monitoring, nutrition, or telehealth —',
    'closing_body_brand'    => 'there’s a coaching layer to add.',
    'cta_heading_lead'      => 'Already have a healthcare solution?',
    'cta_heading_muted'     => 'Let’s build something better together.',
    'cta_body'              => 'Chronilogix can add a clinically grounded, Motivational Interviewing-based AI coaching layer that increases engagement, improves outcomes, and creates new value for your members.',
    'cta_label'             => 'Book a Demo',
    'cta_url'               => '#book-a-demo',
]);

WP_CLI::success("Seeded Partner Solutions (page {$page_id}).");
```

Note the copy uses real curly quotes (`’`) to match the source's `&rsquo;` entities.

- [ ] **Step 3: Verify the PHP parses**

Run:
```bash
PHP="$HOME/Library/Application Support/Local/lightning-services/php-8.2.29+0/bin/darwin-arm64/bin/php"
"$PHP" -l /Users/zarah.sajjad/Documents/next-wp-main/wordpress/acf-seeds/seed-partner-solutions.php
```
Expected: `No syntax errors detected`.

- [ ] **Step 4: Run the seeder**

```bash
cd /Users/zarah.sajjad/Documents/next-wp-main
export PATH="$HOME/.local/bin:$PATH"
wpx eval-file wordpress/acf-seeds/seed-partner-solutions.php
```
Expected: `Success: Seeded Partner Solutions (page NNN).` and no `media missing:` warnings. A `media missing:` warning means Task 3 Step 1 did not copy the assets.

- [ ] **Step 5: Re-run to prove idempotency**

Run the same command again.
Expected: the same success line, and still no `media missing:` warnings. Then confirm no duplicate attachments were created:

```bash
wpx eval 'echo count(get_posts(["post_type"=>"attachment","posts_per_page"=>-1,"fields"=>"ids","meta_key"=>"_chr_src","meta_value"=>"partners/balance-for-life-logo.png"])), "\n";'
```
Expected: `1`.

- [ ] **Step 6: Verify the REST payload**

```bash
curl -s 'http://chronologix.local/wp-json/wp/v2/pages?slug=partner-solutions&_fields=acf&acf_format=standard&per_page=1' \
  | python3 -m json.tool | head -60
```

Confirm:
- `partner_logos` is an array of 3 objects whose `logo` values are **absolute URL strings**, not numeric attachment IDs. Numeric IDs mean `acf_format=standard` or `return_format` is wrong.
- `bundles` is an array of 3 objects.
- `bundles[0].lead` is an array of 2 objects each with a `text` key (proves the nested repeater round-tripped).
- `bundles[2].graphic_steps` is an array of 3 objects with `heading` / `body` / `meta`.
- `bundles[0].graphic` is the string `"video"`.

- [ ] **Step 7: Verify the rendered page uses WordPress content**

Run `pnpm dev` and load `http://localhost:3000/partner-solutions`.

Confirm the logo `src` attributes now point at `chronologix.local/wp-content/uploads/...` rather than `/partners/*.png` — that proves ACF content is winning over the defaults. Check the same on the Solutions nav dropdown promo card. The page must look identical to the defaults render from Task 7 Step 4.

- [ ] **Step 8: Full verification sweep**

Run: `cd /Users/zarah.sajjad/Documents/next-wp-main && pnpm lint && pnpm test && pnpm build`
Expected: lint clean, all tests pass, build succeeds with `/partner-solutions` in the route list.

Then the manual checks the spec calls for:
- `/product` — the carousel pins and releases; it snaps one step at a time and cannot be flung past a step. Check at ≥1024px (rail beside content), at <1024px (rail above a sliding strip), and with `prefers-reduced-motion: reduce` in devtools (no pinning, tap + auto-advance).
- Scroll past the pinned section and confirm the rest of the page scrolls normally — `document.documentElement.style.scrollSnapType` must be empty once the section is out of view.
- `/` — hero at 899px vs 901px viewport width to confirm the `min-[900px]` boundary behaves.
- `WORDPRESS_URL= pnpm build && WORDPRESS_URL= pnpm start` — every page still renders on defaults.

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
|---|---|
| §1 `HiwAudience` port | Task 2 |
| §1 `HeroV5` port | Task 1 |
| §1 `Footer` port | Task 1 |
| §2 Nav split + server shell | Task 6 |
| §2 Nav upstream additions (glyph, promo cards, gaps) | Task 6 Steps 3–5 |
| §3 five components, prop-driven | Tasks 3, 5 |
| §3 dropped `CAPABILITIES` / `glyph` / `iconVariant` | Task 3 Step 2, Task 5 Step 6 |
| §3 derived `index` | Task 4 (`mapBundles`), Task 3 type doc |
| §3 derived `PARTNER_TOC` | Task 4 (`buildPartnerToc`), Task 7 |
| §3 `zenn-demo.mp4` ports as-is | Task 3 Step 2, Task 9 Step 2 |
| §4 field group | Task 8 |
| §4 assets copied before seeding | Task 3 Step 1 |
| §4 seeder | Task 9 |
| Graceful degradation | Task 6 Step 10, Task 7 Step 4, Task 9 Step 8 |
| `arr()` guard at every nesting level | Task 4 (tested) |
| Verification list | Task 9 Step 8 |

No gaps.

**Type consistency:** `Bundle` / `PartnerLogo` / `BundleStep` / `BundleGraphic` / `BundleVideo` are declared once in Task 3 and consumed by the same names in Tasks 4, 5, 6, 7. `mapBundles` / `mapPartnerLogos` / `buildPartnerToc` keep identical signatures across Tasks 4, 6, 7. `NavClient`'s props (`partnerLogos`, `partnerCard`) match what `Nav` passes in Task 6 Step 7. ACF field names in Task 8 match every read in Task 4's implementation and Task 7's page, and every write in Task 9's seeder. `HiwAudienceProfile` / `HiwAudienceContent` are explicitly frozen in Task 2's Interfaces block.

**Placeholder scan:** clean. Every code step carries the actual code. The two steps that legitimately branch on an unknown — Task 7 Step 2 (`PageNav`'s `revealId` optionality) and Task 8 Step 1 (whether the mu-plugin globs or lists its includes) — state both outcomes and what to do in each, rather than deferring the decision.
