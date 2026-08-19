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
          loading="lazy"
          decoding="async"
        />
    </span>
  );
}
