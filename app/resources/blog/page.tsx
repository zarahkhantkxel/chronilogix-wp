import type { Metadata } from "next";
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
