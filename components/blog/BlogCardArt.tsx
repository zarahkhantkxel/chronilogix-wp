import type { BlogArticle } from "@/lib/blog";

type Props = {
  article: BlogArticle;
  size?: "featured" | "card" | "thumb";
};

// A single reusable "thumbnail" treatment for all blog cards. Uses the
// article's gradient as the surface, overlays a subtle radial highlight,
// and prints an eyebrow + truncated title so each card reads as a
// designed editorial unit until real article art is wired in.
export function BlogCardArt({ article, size = "card" }: Props) {
  const isLight = article.textTone === "light";
  const titleSizing =
    size === "featured"
      ? "text-2xl md:text-3xl lg:text-4xl leading-[1.05] tracking-[-0.018em]"
      : size === "thumb"
        ? "text-sm leading-snug tracking-[-0.005em] line-clamp-3"
        : "text-lg leading-snug tracking-[-0.01em] line-clamp-3";
  const paddingSizing =
    size === "featured" ? "p-8 md:p-10" : size === "thumb" ? "p-3" : "p-5";
  const eyebrowSizing =
    size === "thumb"
      ? "text-[9px] tracking-[0.16em]"
      : "text-[11px] tracking-[0.16em]";

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[inherit] bg-gradient-to-br ${article.gradient}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: isLight
            ? "radial-gradient(circle at 82% 14%, rgba(255,255,255,0.45), transparent 40%)"
            : "radial-gradient(circle at 18% 86%, rgba(15,20,25,0.18), transparent 45%)",
        }}
      />
      <div
        aria-hidden
        className={`absolute inset-0 ${
          isLight
            ? "bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.18)_100%)]"
            : ""
        }`}
      />

      <div className={`relative flex h-full flex-col justify-between ${paddingSizing}`}>
        <div
          className={`font-medium uppercase ${eyebrowSizing} ${
            isLight ? "text-white/85" : "text-ink-soft/75"
          }`}
        >
          {article.eyebrow ?? article.tag}
        </div>
        <div
          className={`font-medium ${titleSizing} ${
            isLight ? "text-white" : "text-ink"
          }`}
        >
          {article.title}
        </div>
      </div>
    </div>
  );
}
