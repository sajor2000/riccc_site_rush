import type { Metadata } from "next";
import Link from "next/link";
import { InternshipApplicationForm } from "@/components/internships/application-form";
import { siteConfig } from "@/lib/config";
import { getInternshipCycle } from "@/lib/internships";

/** Always compute open/closed against live Chicago calendar — do not statically freeze. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Summer Internship",
  description: `Apply for a summer internship with ${siteConfig.name} at Rush University — for college and master's students interested in applied healthcare data science. Applications due December 1 (America/Chicago).`,
  alternates: { canonical: "/internships" },
  openGraph: { url: "/internships" },
};

export default function InternshipsPage() {
  const cycle = getInternshipCycle();

  return (
    <main className="bg-rush-surface text-rush-on-surface">
      <section className="pt-32 pb-16 max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-6 block">
              {siteConfig.name} · Summer {cycle.summerYear}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-rush-dark-green leading-[1.1] mb-8">
              Summer Internship
            </h1>
            <p className="text-xl text-rush-on-surface-variant max-w-2xl leading-relaxed">
              For motivated college students and master&apos;s students interested in
              applied healthcare data science. Work with {siteConfig.name} on ICU
              research, clinical data, and related projects at Rush University in Chicago.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-rush-surface-container p-8 rounded-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-3">
              Who should apply
            </h2>
            <p className="text-rush-on-surface-variant leading-relaxed">
              Undergraduates and master&apos;s students with curiosity about clinical
              data, statistics, or machine learning in healthcare settings.
            </p>
          </div>
          <div className="bg-rush-surface-container p-8 rounded-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-3">
              Deadline
            </h2>
            {cycle.open ? (
              <p className="text-rush-on-surface-variant leading-relaxed">
                Submit by{" "}
                <strong className="text-rush-on-surface">{cycle.deadlineLabel}</strong>{" "}
                (Central Time) for Summer {cycle.summerYear}. We review after the
                deadline.
              </p>
            ) : (
              <p className="text-rush-on-surface-variant leading-relaxed">
                Applications are closed for this cycle. The next window opens{" "}
                <strong className="text-rush-on-surface">
                  {cycle.reopensLabel ?? "January 1"}
                </strong>
                , with a deadline of {cycle.deadlineLabel} for Summer {cycle.summerYear}.
              </p>
            )}
          </div>
          <div className="bg-rush-surface-container p-8 rounded-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-3">
              What to prepare
            </h2>
            <p className="text-rush-on-surface-variant leading-relaxed">
              A short statement of interest, relevant skills or coursework, and a
              publicly viewable resume/CV link.
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
                {cycle.open ? "Apply" : "Applications closed"}
              </h2>
              {cycle.open ? (
                <p className="text-rush-on-surface-variant text-lg leading-relaxed mb-8">
                  Complete the form below. Applications for Summer {cycle.summerYear}{" "}
                  close on {cycle.deadlineLabel} (Central Time).
                </p>
              ) : (
                <p className="text-rush-on-surface-variant text-lg leading-relaxed mb-8">
                  The deadline for this cycle has passed. Applications for Summer{" "}
                  {cycle.summerYear} reopen on {cycle.reopensLabel ?? "January 1"},
                  with a deadline of {cycle.deadlineLabel}.
                </p>
              )}
              <p className="text-sm text-rush-on-surface-variant">
                Questions? Email{" "}
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
                <InternshipApplicationForm />
              ) : (
                <div className="bg-rush-surface-container-low rounded-sm p-10">
                  <p className="text-rush-on-surface-variant leading-relaxed mb-6">
                    In the meantime, learn more about our research and team.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/research"
                      className="inline-block border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors"
                    >
                      Research
                    </Link>
                    <Link
                      href="/team"
                      className="inline-block border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors"
                    >
                      Team
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-block border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors"
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
