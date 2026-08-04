/**
 * Blog adapter — reads WordPress posts + their ACF fields (field group
 * "Blog Article") and maps them into the shape the Chronilogix blog UI expects.
 *
 * Card design fields (eyebrow/tag/topic/gradient/textTone/read time) and the
 * long-form block body are authored in wp-admin via ACF, so the frontend is a
 * faithful reflection of what editors control. Fetches are graceful: if
 * WordPress is unreachable, empty results are returned and callers degrade.
 */
import { stripHtml } from "@/lib/metadata";
import type { ArticleBlock } from "@/components/blog/article-types";

const baseUrl = process.env.WORDPRESS_URL;
const CACHE_TTL = 3600;
const USER_AGENT = "Next.js WordPress Client";

export type BlogTextTone = "light" | "dark";

export type BlogArticle = {
  slug: string;
  title: string;
  tag: string;
  topic: string;
  readTime: string;
  date: string; // ISO 8601
  formattedDate: string;
  eyebrow?: string;
  gradient: string;
  textTone: BlogTextTone;
  dek: string;
  featured: boolean;
  sidebar: boolean;
};

export const BLOG_SORTS = ["Latest", "Most read", "Oldest"] as const;
export type BlogSort = (typeof BLOG_SORTS)[number];

// Raw shape of a post row from the REST API (only the fields we request).
type PostRow = {
  slug: string;
  title?: { rendered?: string };
  date: string;
  acf?: Record<string, any>;
};

async function fetchPosts(query: string): Promise<PostRow[]> {
  if (!baseUrl) return [];
  const url = `${baseUrl}/wp-json/wp/v2/posts?${query}&_fields=slug,title,date,acf&acf_format=standard`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next: { tags: ["wordpress", "posts", "acf"], revalidate: CACHE_TTL },
    });
    if (!res.ok) return [];
    return (await res.json()) as PostRow[];
  } catch {
    console.warn(`Blog fetch failed: ${url}`);
    return [];
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function postToArticle(post: PostRow): BlogArticle {
  const acf = post.acf ?? {};
  return {
    slug: post.slug,
    title: stripHtml(post.title?.rendered ?? ""),
    tag: acf.tag || acf.topic || "Insights",
    topic: acf.topic || "Insights",
    readTime: acf.read_time || "",
    date: post.date,
    formattedDate: formatDate(post.date),
    eyebrow: acf.eyebrow || undefined,
    gradient:
      acf.gradient || "from-[#0F1419] via-[#1F2937] to-[#3F5572]",
    textTone: acf.text_tone === "dark" ? "dark" : "light",
    dek: acf.dek || "",
    featured: Boolean(acf.featured),
    sidebar: Boolean(acf.sidebar),
  };
}

// Map an ACF Flexible Content `body` value to the ArticleBody block vocabulary.
function toBlocks(body: any): ArticleBlock[] {
  if (!Array.isArray(body)) return [];
  const blocks: ArticleBlock[] = [];
  for (const row of body) {
    switch (row?.acf_fc_layout) {
      case "para":
        blocks.push({ type: "para", text: row.text ?? "" });
        break;
      case "heading":
        blocks.push({ type: "heading", text: row.text ?? "" });
        break;
      case "subheading":
        blocks.push({ type: "subheading", text: row.text ?? "" });
        break;
      case "callout":
        blocks.push({ type: "callout", text: row.text ?? "" });
        break;
      case "stat":
        blocks.push({
          type: "stat",
          value: row.value ?? "",
          label: row.label ?? "",
          source: row.source || undefined,
        });
        break;
      case "list":
        blocks.push({
          type: "list",
          ordered: Boolean(row.ordered),
          items: Array.isArray(row.items)
            ? row.items.map((i: any) => i?.item ?? "").filter(Boolean)
            : [],
        });
        break;
    }
  }
  return blocks;
}

/** All published articles, newest first. */
export async function getBlogArticles(): Promise<BlogArticle[]> {
  const posts = await fetchPosts("per_page=100");
  return posts
    .map(postToArticle)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** A single article + its block body, or null if missing. */
export async function getBlogArticle(
  slug: string,
): Promise<{ article: BlogArticle; blocks: ArticleBlock[] } | null> {
  const posts = await fetchPosts(
    `slug=${encodeURIComponent(slug)}&per_page=1`,
  );
  const post = posts[0];
  if (!post) return null;
  return {
    article: postToArticle(post),
    blocks: toBlocks(post.acf?.body),
  };
}

/** Topic filter options for the index dropdown ("All topics" first). */
export function getBlogTopics(articles: BlogArticle[]): string[] {
  const topics = Array.from(
    new Set(articles.map((a) => a.topic).filter(Boolean)),
  ).sort();
  return ["All topics", ...topics];
}
