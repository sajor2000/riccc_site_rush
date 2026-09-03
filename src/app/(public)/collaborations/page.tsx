import type { Metadata } from "next";
import Link from "next/link";
import { getTeamMembersByTier, groupCollaboratorsByArea } from "@/lib/team";
import { MemberSocialLinks } from "@/components/team/member-social-links";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Multidisciplinary Collaborations",
  description: `${siteConfig.name} multidisciplinary collaborations at Rush University, Chicago — emergency medicine, critical care, respiratory care, and human-centered design partners working with investigators including J.C. Rojas and Jared Greenberg on clinical trials and related research.`,
  alternates: { canonical: "/collaborations" },
  openGraph: {
    title: `Multidisciplinary Collaborations | ${siteConfig.name}`,
    url: "/collaborations",
    type: "website",
  },
  keywords: [
    "RICCC collaborations",
    "Rush multidisciplinary research",
    "critical care collaborations Chicago",
    "emergency medicine collaboration Rush",
    "respiratory care research Rush",
    "human-centered design healthcare Rush",
  ],
};

export default function CollaborationsPage() {
  const grouped = getTeamMembersByTier();
  const areas = groupCollaboratorsByArea(grouped.collaborator);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Multidisciplinary Collaborations",
    description:
      "Rush University collaborators partnering with RICCC on clinical trials and related critical care research.",
    url: `${siteConfig.url}/collaborations`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <main className="bg-rush-surface text-rush-on-surface">
      <JsonLd data={pageJsonLd} />

      <header className="pt-32 pb-16 max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-6">
            {siteConfig.name} · Across Rush
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-rush-dark-green leading-[1.1] mb-6">
            Multidisciplinary Collaborations
          </h1>
          <p className="text-xl text-rush-on-surface-variant leading-relaxed">
            {siteConfig.name} works with Rush colleagues in emergency medicine,
            critical care, respiratory care, and human-centered design. Each
            collaborator partners with Dr. J.C. Rojas and/or Dr. Jared Greenberg
            on clinical trials and other projects connected to the lab.
          </p>
        </div>
      </header>

      {areas.length === 0 ? (
        <p className="max-w-screen-2xl mx-auto px-6 lg:px-8 pb-24 font-mono text-sm text-rush-on-surface-variant uppercase tracking-widest">
          Collaborator profiles are being set up.
        </p>
      ) : (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 pb-32 space-y-20">
          {areas.map(({ area, members }) => (
            <section
              key={area}
              id={area.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              aria-labelledby={`area-${area}`}
              className="border-t border-rush-outline-variant/20 pt-12"
            >
              <h2
                id={`area-${area}`}
                className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-8"
              >
                {area}
              </h2>
              <ul className="space-y-10 max-w-3xl">
                {members.map((member) => (
                  <li
                    key={member.slug}
                    id={member.slug}
                    className="scroll-mt-28"
                  >
                    <h3 className="text-2xl font-bold text-rush-dark-green tracking-tight mb-2">
                      {member.name}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-rush-dark-green mb-4">
                      {member.role}
                    </p>
                    {member.bio ? (
                      <div className="space-y-4 text-base text-rush-on-surface-variant leading-relaxed">
                        {member.bio.split(/\n\n+/).map((para) => (
                          <p key={para.slice(0, 40)}>{para}</p>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <MemberSocialLinks member={member} variant="compact" />
                      {member.website ? (
                        <a
                          href={member.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs uppercase tracking-widest text-rush-dark-green border-b border-rush-dark-green/30 pb-0.5 hover:border-rush-dark-green transition-colors"
                        >
                          Rush profile
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <section className="bg-rush-surface-container-low border-t border-rush-outline-variant/10 py-16">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <p className="text-rush-on-surface-variant mb-6 max-w-2xl leading-relaxed">
            Meet the full RICCC team, or reach out about a collaboration.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/team"
              className="inline-flex items-center justify-center border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors min-h-11"
            >
              Team
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-rush-dark-green text-white px-6 py-3 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity min-h-11"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
