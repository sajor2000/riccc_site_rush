import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";
import { getAllNews, formatNewsDate } from "@/lib/news";
import { getAllTeamMembers } from "@/lib/team";

export const revalidate = 3600; // ISR: revalidate at most every hour

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "Latest from the RICCC Lab at Rush University — ICU data science milestones, clinical trial updates, CLIF consortium developments, and team announcements.",
  alternates: { canonical: "/news" },
  openGraph: { url: "/news" },
};

export default function NewsPage() {
  const items = getAllNews();

  // Map team slug -> display name for author links.
  const nameBySlug = new Map(getAllTeamMembers().map((m) => [m.slug, m.name]));

  return (
    <main className="bg-rush-surface text-rush-on-surface">
      <PageHeader
        label="News & Updates"
        title="The RICCC Dispatch"
        description="Lab announcements, grant awards, new publications, and team milestones, updated as the work unfolds."
      />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-24">
        {items.length === 0 ? (
          <div className="max-w-2xl">
            <div className="pl-8">
              <span className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-4 block">
                Coming Soon
              </span>
              <h2 className="text-2xl font-bold text-rush-on-surface mb-4">
                Newsfeed in Progress
              </h2>
              <p className="text-rush-on-surface-variant leading-relaxed">
                We are putting together a feed of lab news, grant awards, and milestones.
                It is not ready yet. In the meantime, you can follow our work through
                the{" "}
                <Link
                  href="/publications"
                  className="text-rush-dark-green font-semibold underline underline-offset-4 hover:text-rush-teal transition-colors"
                >
                  publications page
                </Link>{" "}
                or reach out via the{" "}
                <Link
                  href="/contact"
                  className="text-rush-dark-green font-semibold underline underline-offset-4 hover:text-rush-teal transition-colors"
                >
                  contact page
                </Link>
                .
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-20">
            {items.map((item) => {
              const dateLabel = formatNewsDate(item.date);
              const href = `/news/${item.slug}`;
              const summary =
                item.excerpt ||
                item.body.split("\n\n").map((p) => p.trim()).find(Boolean) ||
                "";

              return (
                <article
                  key={item.slug}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
                >
                  {item.image && (
                    <div className="lg:col-span-5">
                      <Link
                        href={href}
                        className="block overflow-hidden border border-rush-outline-variant/30 bg-rush-surface-container-low"
                      >
                        <Image
                          src={item.image}
                          alt={item.imageAlt ?? item.title}
                          width={1400}
                          height={1867}
                          className="w-full h-auto"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                      </Link>
                    </div>
                  )}

                  <div className={item.image ? "lg:col-span-7" : "lg:col-span-12 max-w-3xl"}>
                    {(dateLabel || item.location) && (
                      <p className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-4">
                        {dateLabel}
                        {dateLabel && item.location ? " · " : ""}
                        {item.location}
                      </p>
                    )}

                    <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                      <Link
                        href={href}
                        className="text-rush-dark-green hover:text-rush-teal transition-colors"
                      >
                        {item.title}
                      </Link>
                    </h2>

                    {summary && (
                      <p className="text-base md:text-lg text-rush-on-surface-variant leading-relaxed">
                        {summary}
                      </p>
                    )}

                    {item.authors.length > 0 && (
                      <p className="mt-6 text-sm text-rush-on-surface-variant">
                        <span className="font-mono text-xs uppercase tracking-widest text-rush-on-surface-variant/60 mr-2">
                          Featuring
                        </span>
                        {item.authors.map((slug, i) => {
                          const name = nameBySlug.get(slug);
                          return (
                            <span key={slug}>
                              {i > 0 && ", "}
                              {name ? (
                                <Link
                                  href={`/team#${slug}`}
                                  className="text-rush-dark-green font-semibold underline underline-offset-4 hover:text-rush-teal transition-colors"
                                >
                                  {name}
                                </Link>
                              ) : (
                                slug
                              )}
                            </span>
                          );
                        })}
                      </p>
                    )}

                    <Link
                      href={href}
                      className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-rush-dark-green hover:text-rush-teal transition-colors underline underline-offset-4"
                    >
                      Read more
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
