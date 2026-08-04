// Long-form article body model for the blog detail route. Each article's
// metadata (slug, title, tag, date, gradient, textTone) lives in
// blog-data.ts; this file describes the rendered body that pairs with it.
//
// Blocks are a small, deliberately constrained vocabulary so every article
// renders in the same on-brand typographic system via ArticleBody.

export type ArticleBlock =
  | { type: "para"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; text: string }
  | { type: "stat"; value: string; label: string; source?: string };

export type ArticleContent = {
  slug: string;
  dek: string;
  blocks: ArticleBlock[];
};
