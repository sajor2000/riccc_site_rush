import type { Metadata } from "next";
import Link from "next/link";
import { InternshipApplicationForm } from "@/components/internships/application-form";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";
import { getInternshipCycle } from "@/lib/internships";

/** Always compute open/closed against live Chicago calendar — do not statically freeze. */
export const dynamic = "force-dynamic";

const PAGE_TITLE =
  "Chicago Summer Internship in Healthcare Data Science";

export async function generateMetadata(): Promise<Metadata> {
  const cycle = getInternshipCycle();
  const description = `Apply for the ${siteConfig.name} Summer ${cycle.summerYear} internship in applied healthcare data science at Rush University in Chicago. For college and master's students. Deadline ${cycle.deadlineLabel} (Central Time). ICU data science, clinical AI, and critical care research.`;

  return {
    title: PAGE_TITLE,
    description,
    keywords: [
      "Chicago data science internship",
      "healthcare data science internship",
      "summer internship Chicago",
      "ICU data science internship",
      "clinical informatics internship",
      "critical care data science",
      "Rush University internship",
      "RICCC internship",
      "applied healthcare data science",
      "master's summer internship Chicago",
      "college internship data science Chicago",
    ],
    alternates: { canonical: "/internships" },
    openGraph: {
      title: `${PAGE_TITLE} | ${siteConfig.name}`,
      description,
      url: "/internships",
      type: "website",
      locale: "en_US",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${PAGE_TITLE} | ${siteConfig.name}`,
      description,
    },
  };
}

export default function InternshipsPage() {
  const cycle = getInternshipCycle();
  const validThrough = `${cycle.deadlineYear}-12-01`;

  const jobPostingJsonLd = cycle.open
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: `Summer ${cycle.summerYear} Internship — Applied Healthcare Data Science`,
        description:
          "Summer internship with RICCC (Rush Interdisciplinary Consortium for Critical Care Trials and Data Science) at Rush University in Chicago. Motivated college and master's students work on applied healthcare data science, ICU research, clinical data, and related projects. Applications due December 1 (America/Chicago).",
        datePosted: `${cycle.deadlineYear}-01-01`,
        validThrough,
        employmentType: "INTERN",
        hiringOrganization: {
          "@type": "ResearchOrganization",
          name: siteConfig.name,
          sameAs: siteConfig.url,
          url: siteConfig.url,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Chicago",
            addressRegion: "IL",
            addressCountry: "US",
          },
        },
        applicantLocationRequirements: {
          "@type": "Country",
          name: "US",
        },
        industry: "Healthcare; Data Science; Critical Care Research",
        occupationalCategory: "15-2051.00",
        url: `${siteConfig.url}/internships`,
        directApply: true,
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Summer Internship",
        item: `${siteConfig.url}/internships`,
      },
    ],
  };

  return (
    <main className="bg-rush-surface text-rush-on-surface">
      {jobPostingJsonLd && <JsonLd data={jobPostingJsonLd} />}
      <JsonLd data={breadcrumbJsonLd} />

      <section className="pt-32 pb-16 max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-6">
            {siteConfig.name} · Rush University · Chicago
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-rush-dark-green leading-[1.1] mb-6">
            Chicago Summer Internship in Healthcare Data Science
          </h1>
          <p className="text-xl text-rush-on-surface-variant leading-relaxed mb-8">
            A Summer {cycle.summerYear} opportunity for college and master&apos;s
            students in applied healthcare data science — ICU research, clinical
            data, and critical care AI with {siteConfig.name} at Rush University
            in Chicago.
          </p>
          {cycle.open ? (
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#apply"
                className="inline-flex items-center justify-center bg-rush-dark-green text-white px-8 py-3.5 rounded-sm font-bold text-sm hover:opacity-90 transition-opacity min-h-11"
              >
                Apply by {cycle.deadlineLabel}
              </a>
              <p className="text-sm text-rush-on-surface-variant">
                Central Time · Reviewed after the deadline
              </p>
            </div>
          ) : (
            <p className="text-sm text-rush-on-surface-variant">
              Applications closed until {cycle.reopensLabel ?? "January 1"} for
              Summer {cycle.summerYear}.
            </p>
          )}
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-rush-outline-variant/20 pt-10">
          <div>
            <h2 className="text-lg font-bold text-rush-dark-green mb-3">
              Who should apply
            </h2>
            <p className="text-rush-on-surface-variant leading-relaxed">
              Motivated undergraduates and master&apos;s students interested in
              clinical data, statistics, or machine learning in healthcare —
              especially critical care and ICU settings.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-rush-dark-green mb-3">
              Location &amp; focus
            </h2>
            <p className="text-rush-on-surface-variant leading-relaxed">
              Based in Chicago at Rush University. Work sits at the intersection
              of data science and critical care research with {siteConfig.name}.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-rush-dark-green mb-3">
              Deadline
            </h2>
            {cycle.open ? (
              <p className="text-rush-on-surface-variant leading-relaxed">
                Submit by{" "}
                <strong className="text-rush-on-surface">{cycle.deadlineLabel}</strong>{" "}
                (Central Time) for Summer {cycle.summerYear}.
              </p>
            ) : (
              <p className="text-rush-on-surface-variant leading-relaxed">
                Closed for this cycle. Next window opens{" "}
                <strong className="text-rush-on-surface">
                  {cycle.reopensLabel ?? "January 1"}
                </strong>
                ; deadline {cycle.deadlineLabel} for Summer {cycle.summerYear}.
              </p>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-rush-dark-green mb-3">
              What to prepare
            </h2>
            <p className="text-rush-on-surface-variant leading-relaxed">
              A short statement of interest, skills or coursework, and a
              publicly viewable resume/CV link. Most fields use dropdowns for
              faster entry.
            </p>
          </div>
        </div>
      </section>

      <section
        id="apply"
        className="max-w-screen-2xl mx-auto px-6 lg:px-8 mb-32 scroll-mt-24"
        aria-labelledby="apply-heading"
      >
        <div className="bg-rush-surface-container rounded-sm p-1 overflow-hidden">
          <div className="bg-rush-surface p-10 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2
                id="apply-heading"
                className="text-3xl md:text-4xl font-bold tracking-tight text-rush-dark-green mb-6"
              >
                {cycle.open ? "Apply for Summer " + cycle.summerYear : "Applications closed"}
              </h2>
              {cycle.open ? (
                <p className="text-rush-on-surface-variant text-lg leading-relaxed mb-8">
                  Complete the form. Applications close {cycle.deadlineLabel}{" "}
                  (Central Time).
                </p>
              ) : (
                <p className="text-rush-on-surface-variant text-lg leading-relaxed mb-8">
                  The deadline has passed. Applications for Summer{" "}
                  {cycle.summerYear} reopen {cycle.reopensLabel ?? "January 1"},
                  deadline {cycle.deadlineLabel}.
                </p>
              )}
              <p className="text-sm text-rush-on-surface-variant">
                Questions?{" "}
                <a
                  href="mailto:info@riccc-lab.com"
                  className="text-rush-dark-green font-semibold underline underline-offset-4"
                >
                  info@riccc-lab.com
                </a>
              </p>
            </div>

            <div className="lg:col-span-8 relative">
              {cycle.open ? (
                <InternshipApplicationForm
                  summerYear={cycle.summerYear}
                  deadlineLabel={cycle.deadlineLabel}
                />
              ) : (
                <div className="bg-rush-surface-container-low rounded-sm p-10">
                  <p className="text-rush-on-surface-variant leading-relaxed mb-6">
                    In the meantime, learn more about our research and team.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/research"
                      className="inline-block border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors min-h-11"
                    >
                      Research
                    </Link>
                    <Link
                      href="/team"
                      className="inline-block border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors min-h-11"
                    >
                      Team
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-block border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors min-h-11"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
