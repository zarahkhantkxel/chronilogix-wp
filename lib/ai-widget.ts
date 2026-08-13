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
  }
}

/**
 * Open the coach widget. Safe to call before the widget finishes loading —
 * it waits on the loader's readiness promise first. Resolves false when the
 * widget is unavailable so callers can fall back if they want to.
 */
export async function openAiWidget(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const ready = await (window.AiAgentsWebWidgetReady ?? Promise.resolve(false));
  if (!ready || !window.AiAgentsWebWidget) return false;

  window.AiAgentsWebWidget.show();
  return true;
}
