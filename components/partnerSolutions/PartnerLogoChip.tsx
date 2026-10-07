"use client";

import Image from "next/image";
import type { PartnerLogo } from "@/components/partnerSolutions/partnerData";
import { useAfterLoad } from "@/components/hooks/useAfterLoad";

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
  // Only rendered inside the (initially closed) nav menus. Even with
  // loading="lazy" Chrome fetches them immediately (the hidden panel sits at
  // the top of the page), so wait until the page has loaded.
  const ready = useAfterLoad();
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_8px_20px_-14px_rgba(20,8,2,0.35)] ${pad} ${className}`}
    >
      {/* width/height seed the aspect ratio + srcset (~4:1 logo canvases);
          imgClassName sizes it. */}
      {ready ? (
        <Image
          src={logo.src}
          alt={logo.alt}
          width={160}
          height={40}
          className={imgClassName}
          draggable={false}
        />
      ) : (
        <span role="img" aria-label={logo.alt} className={imgClassName} />
      )}
    </span>
  );
}
