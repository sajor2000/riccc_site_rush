import Link from "next/link";
import { siteConfig } from "@/lib/config";

/** Below-fold paths for collaborators and internship applicants (internal SEO + conversion). */
export function GetInvolved() {
  return (
    <section
      className="bg-rush-surface-container-low border-t border-rush-outline-variant/10 py-20 px-6 lg:px-8"
      aria-labelledby="get-involved-heading"
    >
      <div className="max-w-screen-2xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-4">
          {siteConfig.name} · Get involved
        </p>
        <h2
          id="get-involved-heading"
          className="text-3xl md:text-4xl font-bold text-rush-dark-green tracking-tight mb-4 max-w-[20ch]"
        >
          Collaborate or apply for a summer internship
        </h2>
        <p className="text-xl text-rush-on-surface-variant leading-relaxed max-w-2xl mb-10">
          Partner with RICCC on ICU data science and critical care trials at Rush
          University in Chicago, or apply for our summer internship in applied
          healthcare data science.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div>
            <h3 className="text-lg font-bold text-rush-dark-green mb-2">
              Research collaborations
            </h3>
            <p className="text-rush-on-surface-variant leading-relaxed mb-5">
              Academic and clinical partners across emergency medicine, critical
              care, respiratory care, and human-centered design — plus external
              investigators interested in federated ICU research.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/collaborations"
                className="inline-flex items-center justify-center bg-rush-dark-green text-white px-6 py-3 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity min-h-11"
              >
                View collaborations
              </Link>
              <Link
                href="/contact#inquiry"
                className="inline-flex items-center justify-center border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors min-h-11"
              >
                Propose a partnership
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-rush-dark-green mb-2">
              Summer internship
            </h3>
            <p className="text-rush-on-surface-variant leading-relaxed mb-5">
              College and master&apos;s students can apply for a Chicago summer
              internship in healthcare data science, ICU research, and clinical
              AI. Applications are due December 1 (Central Time).
            </p>
            <Link
              href="/internships"
              className="inline-flex items-center justify-center bg-rush-dark-green text-white px-6 py-3 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity min-h-11"
            >
              Internship details &amp; apply
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
