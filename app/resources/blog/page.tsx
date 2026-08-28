import type { Metadata } from "next";
import { BLOG_PUBLISHED } from "@/app/sitemap";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogFeatured } from "@/components/blog/BlogFeatured";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { BlogNewsletter } from "@/components/blog/BlogNewsletter";
import { getBlogArticles, getBlogTopics } from "@/lib/blog";

export const metadata: Metadata = {
  title: "In Practice · Chronilogix Blog",
  description:
    "Where behavioral science meets clinical-grade AI. Research, product notes, and field reports from the Chronilogix team.",
  // Resources has not launched. The route resolves and is unlinked, which
  // keeps it out of the sitemap, but neither of those stops a crawler that
  // reaches it another way — a shared link, a referrer log, an external
  // mention. noindex is the only instruction that actually keeps it out of an
  // index, and unlike a robots Disallow it also removes anything already
  // indexed. Reads the sitemap's flag so all three lift together at launch.
  ...(BLOG_PUBLISHED ? {} : { robots: { index: false, follow: false } }),
};

export default async function BlogPage() {
  const articles = await getBlogArticles();
  const topics = getBlogTopics(articles);

  return (
    <>
      <Nav />
      <main className="bg-paper-warm/40">
        <BlogHero />
        <BlogFeatured articles={articles} />
        <BlogIndex articles={articles} topics={topics} />
        <BlogNewsletter />
      </main>
      <Footer />
    </>
  );
}
