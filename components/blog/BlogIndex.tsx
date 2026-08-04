"use client";

import { useMemo, useState } from "react";
import { BLOG_SORTS, type BlogArticle } from "@/lib/blog";
import { BlogCardArt } from "./BlogCardArt";

const PAGE_SIZE = 6;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 transition-transform duration-200 ease-out-quart motion-reduce:transition-none ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M2 4.5 6 8.5l4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type DropdownProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
};

function Dropdown<T extends string>({ value, options, onChange }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        aria-expanded={open}
        className="inline-flex w-full min-w-[180px] items-center justify-between gap-3 rounded-full border border-ink/10 bg-paper px-5 py-3 text-sm text-ink transition-colors duration-150 ease-out-quart hover:border-ink/20 motion-reduce:transition-none"
      >
        <span>{value}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 mt-2 w-full min-w-[180px] overflow-hidden rounded-2xl border border-ink/5 bg-paper p-1 shadow-lg shadow-ink/10"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <li key={option}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 ease-out-quart motion-reduce:transition-none hover:bg-ink/5 ${
                    selected ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  <span>{option}</span>
                  {selected && (
                    <svg
                      aria-hidden
                      viewBox="0 0 12 12"
                      className="h-3 w-3 text-brand-600"
                    >
                      <path
                        d="m2.5 6.5 2.5 2.5L9.5 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

type BlogIndexProps = {
  articles: BlogArticle[];
  topics: string[];
};

export function BlogIndex({ articles, topics }: BlogIndexProps) {
  const [topic, setTopic] = useState<string>("All topics");
  const [sort, setSort] = useState<(typeof BLOG_SORTS)[number]>("Latest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list = articles.filter((article) =>
      topic === "All topics" ? true : article.topic === topic,
    );
    const sorted = [...list].sort((a, b) => {
      if (sort === "Oldest") {
        return a.date.localeCompare(b.date);
      }
      // Most read — no analytics yet, treat as Latest in reverse alphabetical
      // by title as a deterministic stand-in until real metrics arrive.
      if (sort === "Most read") {
        return a.title.localeCompare(b.title);
      }
      return b.date.localeCompare(a.date);
    });
    return sorted;
  }, [articles, topic, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const onTopicChange = (next: string) => {
    setTopic(next);
    setPage(1);
  };
  const onSortChange = (next: (typeof BLOG_SORTS)[number]) => {
    setSort(next);
    setPage(1);
  };

  return (
    <section className="border-t border-ink/[0.06] py-16 md:py-20">
      <div className="container-page">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Dropdown
              label="Topic"
              value={topic}
              options={topics}
              onChange={onTopicChange}
            />
            <Dropdown
              label="Sort"
              value={sort}
              options={BLOG_SORTS}
              onChange={onSortChange}
            />
          </div>
          <div className="text-sm text-ink-muted">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((article) => (
            <a
              key={article.slug}
              href={`/resources/blog/${article.slug}`}
              className="group/card flex flex-col gap-4"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <BlogCardArt article={article} />
              </div>
              <div className="flex flex-col gap-2 px-1">
                <div className="text-base font-medium leading-snug text-ink line-clamp-2 md:text-lg">
                  {article.title}
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span>{article.tag}</span>
                  <span className="h-1 w-1 rounded-full bg-ink-muted/40" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {pageItems.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-ink/10 bg-paper-warm/60 px-8 py-16 text-center text-sm text-ink-muted">
            No articles in this topic yet. Try a different filter.
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-ink-muted">
              Page {safePage} of {pageCount}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-soft transition-colors duration-150 ease-out-quart hover:border-ink/20 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
              >
                <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
                  <path
                    d="M7.5 2 3.5 6l4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => {
                const active = n === safePage;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm transition-colors duration-150 ease-out-quart motion-reduce:transition-none ${
                      active
                        ? "bg-ink text-white"
                        : "text-ink-soft hover:bg-ink/[0.05]"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={safePage === pageCount}
                aria-label="Next page"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-soft transition-colors duration-150 ease-out-quart hover:border-ink/20 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
              >
                <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
                  <path
                    d="m4.5 2 4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
