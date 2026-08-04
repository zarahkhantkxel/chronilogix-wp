import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BlogCardArt } from "@/components/blog/BlogCardArt";
import { BlogNewsletter } from "@/components/blog/BlogNewsletter";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { getBlogArticle, getBlogArticles } from "@/lib/blog";
import { getAllPostSlugs } from "@/lib/wordpress";

type Params = Promise<{ slug: string }>;

// Every published WordPress post gets a static path at build time.
export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogArticle(slug);
  if (!result) {
    return { title: "Article not found · Chronilogix Blog" };
  }
  return {
    title: `${result.article.title} · Chronilogix Blog`,
    description: result.article.dek || result.article.title,
  };
}

export default async function BlogArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const result = await getBlogArticle(slug);

  if (!result) {
    notFound();
  }

  const { article, blocks } = result;
  const isLight = article.textTone === "light";

  // Three other articles for the "More from the blog" rail.
  const all = await getBlogArticles();
  const currentIndex = all.findIndex((a) => a.slug === article.slug);
  const related = Array.from({ length: 3 }, (_, i) =>
    currentIndex >= 0 ? all[(currentIndex + 1 + i) % all.length] : all[i],
  ).filter((a): a is NonNullable<typeof a> => Boolean(a) && a.slug !== article.slug);

  return (
    <>
      <Nav />
      <main className="bg-paper-warm/40">
        {/* Header hero — mirrors the BlogCardArt gradient treatment: the
            article gradient as the surface, a soft radial highlight, and
            light/dark content per the article's textTone. */}
        <header className="pt-20 md:pt-24">
          <div className="container-page">
            <div
              className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${article.gradient}`}
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

              <div className="relative px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-28">
                <div className="mx-auto max-w-3xl text-center">
                  <p
                    className={`text-[13px] font-medium uppercase tracking-[0.16em] ${
                      isLight ? "text-white/80" : "text-ink-soft/75"
                    }`}
                  >
                    {article.eyebrow ?? article.tag}
                  </p>

                  <h1
                    className={`mt-5 font-serif text-display font-normal tracking-[-0.018em] ${
                      isLight ? "text-white" : "text-ink"
                    }`}
                    style={{ textWrap: "balance" } as React.CSSProperties}
                  >
                    {article.title}
                  </h1>

                  {article.dek && (
                    <p
                      className={`mx-auto mt-6 max-w-[58ch] text-base leading-relaxed md:text-lg ${
                        isLight ? "text-white/85" : "text-ink-soft"
                      }`}
                    >
                      {article.dek}
                    </p>
                  )}

                  {/* Meta row — date, read time, tag, byline. */}
                  <div
                    className={`mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm ${
                      isLight ? "text-white/75" : "text-ink-muted"
                    }`}
                  >
                    <span>{article.formattedDate}</span>
                    <span
                      aria-hidden
                      className={`h-1 w-1 rounded-full ${
                        isLight ? "bg-white/50" : "bg-ink-muted/40"
                      }`}
                    />
                    <span>{article.readTime}</span>
                    <span
                      aria-hidden
                      className={`h-1 w-1 rounded-full ${
                        isLight ? "bg-white/50" : "bg-ink-muted/40"
                      }`}
                    />
                    <span>{article.tag}</span>
                    <span
                      aria-hidden
                      className={`h-1 w-1 rounded-full ${
                        isLight ? "bg-white/50" : "bg-ink-muted/40"
                      }`}
                    />
                    <span>By the Chronilogix Team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article body — rendered from the ACF block content (para/heading/
            list/callout/stat) through the shared on-brand ArticleBody, exactly
            as in the source app. */}
        <article className="py-16 md:py-20">
          <div className="container-page">
            <ArticleBody blocks={blocks} />
          </div>
        </article>

        {/* More from the blog — three other articles. */}
        {related.length > 0 && (
          <section className="border-t border-ink/[0.06] py-16 md:py-20">
            <div className="container-page">
              <h2 className="text-section font-serif font-normal text-ink">
                More from the blog
              </h2>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <a
                    key={item.slug}
                    href={`/resources/blog/${item.slug}`}
                    className="group/card flex flex-col gap-4"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                      <BlogCardArt article={item} />
                    </div>
                    <div className="flex flex-col gap-2 px-1">
                      <div className="text-base font-medium leading-snug text-ink line-clamp-2 md:text-lg">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-ink-muted">
                        <span>{item.tag}</span>
                        <span className="h-1 w-1 rounded-full bg-ink-muted/40" />
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <BlogNewsletter />
      </main>
      <Footer />
    </>
  );
}
