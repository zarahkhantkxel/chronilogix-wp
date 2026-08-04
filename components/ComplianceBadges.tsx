type Tone = "light" | "dark";

const BADGES: { label: string; status?: string }[] = [
  { label: "HIPAA Compliant" },
  { label: "SOC 2 Type II", status: "confirm" },
  { label: "GDPR Ready", status: "confirm" },
];

export function ComplianceBadges({ tone = "light" }: { tone?: Tone }) {
  const isDark = tone === "dark";
  return (
    <ul
      className={`flex flex-wrap items-center gap-2 md:gap-3 ${
        isDark ? "text-white/80" : "text-ink-soft"
      }`}
    >
      {BADGES.map((badge) => (
        <li
          key={badge.label}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
            isDark
              ? "border border-white/15 bg-white/5"
              : "border border-ink/10 bg-white"
          }`}
        >
          <CheckMark dark={isDark} />
          <span>{badge.label}</span>
        </li>
      ))}
    </ul>
  );
}

function CheckMark({ dark }: { dark: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={dark ? "text-white" : "text-brand-600"}
    >
      <path
        d="M2 6.5L4.8 9 10 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
