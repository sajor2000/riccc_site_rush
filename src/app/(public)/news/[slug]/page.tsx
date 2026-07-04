import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllNews, getNewsBySlug, formatNewsDate } from "@/lib/news";
import { getAllTeamMembers } from "@/lib/team";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";

export const revalidate = 3600; // ISR: revalidate at most every hour
// News is a fixed set rebuilt on each deploy; unknown slugs should 404, not render on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNews().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);

  if (!item) {
    return { title: "News" };
  }

  const description = item.excerpt || `${item.title} — RICCC at Rush University, Chicago.`;
  const url = `/news/${item.slug}`;

  return {
    title: item.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: item.title,
      description,
      publishedTime: item.date || undefined,
      images: item.image ? [{ url: item.image, alt: item.imageAlt ?? item.title }] : undefined,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);

  if (!item) notFound();

  const dateLabel = formatNewsDate(item.date);
  const paragraphs = item.body
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const members = getAllTeamMembers();
  const nameBySlug = new Map(members.map((m) => [m.slug, m.name]));

  const authorSchema = item.authors
    .filter((s) => nameBySlug.has(s))
    .map((s) => ({
      "@type": "Person",
      name: nameBySlug.get(s),
      url: `${siteConfig.url}/team#${s}`,
    }));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.excerpt || undefined,
    datePublished: item.date || undefined,
    image: item.image ? `${siteConfig.url}${item.image}` : undefined,
    articleSection: "News",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/news/${item.slug}`,
    },
    author:
      authorSchema.length > 0
        ? authorSchema
        : { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/riccc-logo-transparent.webp`,
      },
    },
  };

  return (
    <main className="bg-rush-surface text-rush-on-surface">
      <JsonLd data={articleJsonLd} />

      <article className="max-w-3xl mx-auto px-6 lg:px-8 pt-32 pb-24">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-rush-dark-green hover:text-rush-teal transition-colors mb-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All News
        </Link>

        {(dateLabel || item.location) && (
          <p className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-4">
            {dateLabel}
            {dateLabel && item.location ? " · " : ""}
            {item.location}
          </p>
        )}

        <h1 className="text-3xl md:text-5xl font-bold text-rush-dark-green leading-tight mb-8">
          {item.title}
        </h1>

        {item.image && (
          <div className="mb-10 overflow-hidden border border-rush-outline-variant/30 bg-rush-surface-container-low">
            <Image
              src={item.image}
              alt={item.imageAlt ?? item.title}
              width={1400}
              height={1867}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <div className="space-y-5">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-base md:text-lg text-rush-on-surface-variant leading-relaxed"
            >
              {p}
            </p>
          ))}
        </div>

        {item.authors.length > 0 && (
          <p className="mt-10 text-sm text-rush-on-surface-variant">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-on-surface-variant/60 mr-2">
              Featuring
            </span>
            {item.authors.map((s, i) => {
              const name = nameBySlug.get(s);
              return (
                <span key={s}>
                  {i > 0 && ", "}
                  {name ? (
                    <Link
                      href={`/team#${s}`}
                      className="text-rush-dark-green font-semibold underline underline-offset-4 hover:text-rush-teal transition-colors"
                    >
                      {name}
                    </Link>
                  ) : (
                    s
                  )}
                </span>
              );
            })}
          </p>
        )}
      </article>
    </main>
  );
}
