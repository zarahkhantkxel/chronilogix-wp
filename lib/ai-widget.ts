// Bridge to the NextLevel AI agents widget loaded by the inline script in
// app/layout.tsx. The widget mounts itself onto document.body outside React's
// tree, so page CTAs reach it through this module rather than through props.

interface AiAgentsWebWidget {
  init: (config: Record<string, unknown>) => void;
  show: () => void;
  isOpened: () => boolean;
  destroy: () => void;
}

declare global {
  interface Window {
    AiAgentsWebWidget?: AiAgentsWebWidget;
    // Resolves true once the widget script loaded and init() ran, false if the
    // script failed. Set by the loader before the script starts fetching, so
    // a CTA clicked mid-load still waits rather than no-oping.
    AiAgentsWebWidgetReady?: Promise<boolean>;
    AiAgentsWebWidgetLoaded?: boolean;
    // Starts loading the widget now (idempotent). The layout defers it until
    // after page load, so a CTA clicked earlier kicks it off on demand.
    loadAiAgentsWidget?: () => Promise<boolean> | undefined;
  }
}

// Resolves once the widget is loaded and initialised; starts loading it on
// demand if the layout's interaction trigger hasn't fired yet.
async function widgetReady(): Promise<AiAgentsWebWidget | null> {
  if (typeof window === "undefined") return null;

  const ready = await (window.AiAgentsWebWidgetReady ??
    window.loadAiAgentsWidget?.() ??
    Promise.resolve(false));
  return ready && window.AiAgentsWebWidget ? window.AiAgentsWebWidget : null;
}

/**
 * Open the coach widget. Safe to call before the widget finishes loading —
 * it waits on the loader's readiness promise first. Resolves false when the
 * widget is unavailable so callers can fall back if they want to.
 */
export async function openAiWidget(): Promise<boolean> {
  const widget = await widgetReady();
  if (!widget) return false;

  widget.show();
  return true;
}

// ── "Talk to Coach" ─────────────────────────────────────────────────────
// The widget renders its own DOM outside React, so state is read from its
// class names. These are the vendor's markup, not ours: if NextLevel renames
// them, talkToCoach() degrades to show() without the attention animation.
const WIDGET = {
  minimized: ".sp-ai-widget-main-container",
  expandButton: ".sp-ai-expand-container",
  transcribe: ".sp-ai-widget-transcribe",
  transcribeCard: ".sp-ai-widget-transcribe-component-container",
  launcher: ".sp-ai-static-widget-container",
  launcherCard: ".sp-ai-static-widget-component-container",
};

// Time for the widget's own open transition before we animate it.
const OPEN_SETTLE_MS = 450;
// After init() the widget fetches its settings before drawing anything
// (~2s on chronilogix.com), so a first click can arrive before it renders.
const RENDER_TIMEOUT_MS = 6000;
const BRAND_RGB = "255, 116, 52"; // brand accent orange

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isVisible = (selector: string) => {
  const el = document.querySelector<HTMLElement>(selector);
  return !!el && el.getBoundingClientRect().width > 0;
};

const anyViewVisible = () =>
  isVisible(WIDGET.minimized) ||
  isVisible(WIDGET.transcribe) ||
  isVisible(WIDGET.launcher);

// Whether the widget has drawn itself at least once. Until it has, it is
// still initialising, and show() must not be called (see talkToCoach).
const hasRendered = () =>
  !!document.querySelector(
    `${WIDGET.minimized}, ${WIDGET.transcribe}, ${WIDGET.launcher}`,
  );

async function waitForView(timeoutMs: number): Promise<boolean> {
  const start = performance.now();
  while (!anyViewVisible()) {
    if (performance.now() - start > timeoutMs) return false;
    await sleep(50);
  }
  return true;
}

/** [outer element to move, inner card to ripple] for whichever view is open. */
function getOpenPopup(): [HTMLElement | null, HTMLElement | null] {
  if (isVisible(WIDGET.transcribe)) {
    return [
      document.querySelector<HTMLElement>(WIDGET.transcribe),
      document.querySelector<HTMLElement>(WIDGET.transcribeCard),
    ];
  }
  return [
    document.querySelector<HTMLElement>(WIDGET.launcher),
    document.querySelector<HTMLElement>(WIDGET.launcherCard),
  ];
}

const running = new WeakMap<HTMLElement, Animation[]>();

// Lift + damped spring settle on the popup, with two brand-colour ripples and
// a brightness glint on its card. Web Animations API, so no extra CSS. Under
// reduced motion it is a single soft glow with no movement.
function playAttention() {
  const [outer, card] = getOpenPopup();
  if (!outer) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    card?.animate(
      [
        { boxShadow: `0 0 0 0 rgba(${BRAND_RGB}, 0)` },
        { boxShadow: `0 0 0 4px rgba(${BRAND_RGB}, 0.45)` },
        { boxShadow: `0 0 0 0 rgba(${BRAND_RGB}, 0)` },
      ],
      { duration: 900, easing: "ease-in-out" },
    );
    return;
  }

  // Cancel a running animation so rapid clicks restart smoothly.
  running.get(outer)?.forEach((a) => a.cancel());

  const spring = "cubic-bezier(0.22, 1, 0.36, 1)";
  outer.style.transformOrigin = "bottom right";

  const motion = outer.animate(
    [
      { transform: "translateY(0) scale(1)", easing: spring },
      {
        transform: "translateY(-12px) scale(1.035)",
        offset: 0.2,
        easing: "cubic-bezier(0.5, 0, 0.75, 0)",
      },
      { transform: "translateY(3px) scale(0.988)", offset: 0.42, easing: spring },
      { transform: "translateY(-4px) scale(1.008)", offset: 0.6, easing: spring },
      { transform: "translateY(1px) scale(0.998)", offset: 0.78, easing: spring },
      { transform: "translateY(0) scale(1)" },
    ],
    { duration: 1000, fill: "none" },
  );
  const anims: Animation[] = [motion];

  if (card) {
    const ripple = card.animate(
      [
        {
          boxShadow: `0 0 0 0 rgba(${BRAND_RGB}, 0.55), 0 10px 30px -10px rgba(${BRAND_RGB}, 0)`,
        },
        {
          boxShadow: `0 0 0 6px rgba(${BRAND_RGB}, 0.25), 0 18px 40px -12px rgba(${BRAND_RGB}, 0.45)`,
          offset: 0.35,
        },
        {
          boxShadow: `0 0 0 16px rgba(${BRAND_RGB}, 0), 0 10px 30px -10px rgba(${BRAND_RGB}, 0)`,
        },
      ],
      {
        duration: 750,
        delay: 120,
        iterations: 2,
        easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      },
    );
    const glint = card.animate(
      [
        { filter: "brightness(1)" },
        { filter: "brightness(1.12) saturate(1.1)", offset: 0.25 },
        { filter: "brightness(1)" },
      ],
      { duration: 700, easing: "ease-out" },
    );
    anims.push(ripple, glint);
  }

  running.set(outer, anims);
}

/**
 * Handler for "Talk to Coach" CTAs. Waits for the widget (loading it if
 * needed), then:
 * - still rendering after load → waits for it to appear, then animates
 * - minimized → expands it, then plays the attention animation
 * - expanded (launcher or text chat) → plays the attention animation
 * - closed → shows it, then plays the attention animation
 * Resolves false when the widget is unavailable.
 */
export async function talkToCoach(): Promise<boolean> {
  const widget = await widgetReady();
  if (!widget) return false;

  // After init() the widget opens itself once its settings arrive. Calling
  // show() before that left it blank on chronilogix.com, so while it has
  // never drawn, wait for it instead of showing it.
  if (!hasRendered()) {
    await waitForView(RENDER_TIMEOUT_MS);
  }

  if (isVisible(WIDGET.minimized)) {
    document.querySelector<HTMLElement>(WIDGET.expandButton)?.click();
    await sleep(OPEN_SETTLE_MS);
  } else if (!isVisible(WIDGET.transcribe) && !isVisible(WIDGET.launcher)) {
    widget.show();
    await waitForView(RENDER_TIMEOUT_MS);
    await sleep(OPEN_SETTLE_MS);
  }

  playAttention();
  return true;
}
