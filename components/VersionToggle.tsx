"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Floating version toggle. Lives top-center, low z-index relative to the
// Roni pill, but high enough to sit above page content. Purely a build-time
// preview affordance — should be removed before production.
//
// V4 is the current iteration slot — reintroduced after the earlier
// renumbering pass (V5 → V1, original V1 → /v3). All four explorations are
// surfaced so the full set can be browsed from the preview nav. Purely a
// build-time affordance — should be removed before production.
const VERSIONS = [
  { label: "V1", href: "/" },
  { label: "V2", href: "/v2" },
  { label: "V3", href: "/v3" },
  { label: "V4", href: "/v4" },
] as const;

export function VersionToggle() {
  const pathname = usePathname() ?? "/";
  const activeHref =
    pathname.startsWith("/v4")
      ? "/v4"
      : pathname.startsWith("/v3")
      ? "/v3"
      : pathname.startsWith("/v2")
      ? "/v2"
      : "/";

  return (
    <div
      className="pointer-events-auto fixed left-1/2 top-3 z-[110] hidden -translate-x-1/2 md:block"
      aria-label="Design version toggle"
    >
      <div className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white/85 p-1 shadow-[0_6px_24px_-8px_rgba(15,20,25,0.25)] backdrop-blur">
        {VERSIONS.map((v) => {
          const active = v.href === activeHref;
          return (
            <Link
              key={v.href}
              href={v.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3.5 py-1 text-[12px] font-medium tracking-[-0.005em] transition-colors ${
                active ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              {v.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
