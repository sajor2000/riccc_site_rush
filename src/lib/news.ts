import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface NewsItem {
  slug: string;
  title: string;
  /** ISO date string, YYYY-MM-DD. */
  date: string;
  image?: string;
  imageAlt?: string;
  location?: string;
  excerpt?: string;
  /** Team member slugs (see content/team/*.mdx) for author linking. */
  authors: string[];
  /** Markdown body after the frontmatter. */
  body: string;
}

export function getAllNews(): NewsItem[] {
  const newsDir = path.join(process.cwd(), "content/news");

  if (!fs.existsSync(newsDir)) return [];

  const files = fs.readdirSync(newsDir).filter((f) => f.endsWith(".mdx"));

  const items = files.map((file) => {
    const raw = fs.readFileSync(path.join(newsDir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, "");

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      image: data.image || undefined,
      imageAlt: data.image_alt || undefined,
      location: data.location || undefined,
      excerpt: data.excerpt || undefined,
      authors: Array.isArray(data.authors) ? (data.authors as string[]) : [],
      body: content.trim(),
    };
  });

  // Most recent first; empty dates sort last.
  return items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

/** Returns a single news item by slug, or null if none exists. */
export function getNewsBySlug(slug: string): NewsItem | null {
  return getAllNews().find((item) => item.slug === slug) ?? null;
}

/** Formats an ISO date (YYYY-MM-DD) as e.g. "May 6, 2026". Returns "" if unparseable. */
export function formatNewsDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
