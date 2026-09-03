import type { Metadata } from "next";
import Link from "next/link";
import {
  getTeamMembersByTier,
  groupCollaboratorsByArea,
  getMemberInitials,
} from "@/lib/team";
import { CollaboratorProfileCard } from "@/components/team/collaborator-profile-card";
import { getMemberGithubProfileUrl } from "@/components/team/member-social-links";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Multidisciplinary Collaborations",
  description: `${siteConfig.name} multidisciplinary collaborations at Rush University, Chicago — emergency medicine, critical care, respiratory care, and human-centered design partners working with investigators including J.C. Rojas and Kevin Buell on clinical trials and related research.`,
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

/** Build a URL-safe section id from a collaboration area label. */
function areaSectionId(area: string): string {
  return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Public directory of Rush multidisciplinary collaborators partnering with RICCC. */
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Team",
        item: `${siteConfig.url}/team`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Multidisciplinary Collaborations",
        item: `${siteConfig.url}/collaborations`,
      },
    ],
  };

  const personSchemas = grouped.collaborator.map((member) => {
    const sameAs: string[] = [];
    if (member.scholar) sameAs.push(member.scholar);
    if (member.orcid) sameAs.push(`https://orcid.org/${member.orcid}`);
    if (member.linkedin) sameAs.push(member.linkedin);
    if (member.website) sameAs.push(member.website);
    const githubUrl = member.github ? getMemberGithubProfileUrl(member.github) : undefined;
    if (githubUrl) sameAs.push(githubUrl);

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: member.name.replace(/,.*$/, ""),
      ...(member.alternateNames && { alternateName: member.alternateNames }),
      ...(member.role && { jobTitle: member.role.split(" | ")[0] }),
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Rush University System for Health",
      },
      url: `${siteConfig.url}/collaborations#${member.slug}`,
      ...(member.photo && { image: `${siteConfig.url}${member.photo}` }),
      ...(sameAs.length > 0 && { sameAs }),
    };
  });

  return (
    <main className="bg-rush-surface text-rush-on-surface min-h-screen">
      <JsonLd data={pageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {personSchemas.map((schema, i) => (
        <JsonLd key={grouped.collaborator[i].slug} data={schema} />
      ))}

      <header className="pt-32 pb-12 max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div className="ml-0 lg:ml-12 max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-rush-on-surface-variant">
              <li>
                <Link
                  href="/team"
                  className="hover:text-rush-dark-green transition-colors"
                >
                  Team
                </Link>
              </li>
              <li aria-hidden className="text-rush-outline-variant">
                /
              </li>
              <li>
                <span aria-current="page" className="text-rush-dark-green font-medium">
                  Collaborations
                </span>
              </li>
            </ol>
          </nav>

          <p className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-4">
            {siteConfig.name} · Across Rush
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-rush-dark-green leading-[1.1] tracking-[-0.04em] max-w-[14ch]">
            Multidisciplinary Collaborations
          </h1>
          <div className="h-1 w-24 bg-rush-teal mt-6" aria-hidden />
          <p className="mt-6 text-xl text-rush-on-surface-variant leading-relaxed">
            {siteConfig.name} works with Rush colleagues in emergency medicine,
            critical care, respiratory care, and human-centered design. Each
            collaborator partners with RICCC investigators on clinical trials and
            other projects connected to the lab.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-rush-dark-green text-white px-6 py-3 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity min-h-11"
            >
              Propose a collaboration
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center justify-center border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors min-h-11"
            >
              View the full team
            </Link>
          </div>

          {areas.length > 0 ? (
            <>
              <nav
                aria-label="Collaboration areas"
                className="mt-10 flex flex-wrap gap-x-5 gap-y-3"
              >
                {areas.map(({ area }) => (
                  <a
                    key={area}
                    href={`#${areaSectionId(area)}`}
                    className="font-mono text-xs uppercase tracking-widest text-rush-dark-green border-b border-rush-dark-green/30 pb-0.5 hover:border-rush-dark-green transition-colors min-h-11 inline-flex items-center"
                  >
                    {area}
                  </a>
                ))}
              </nav>

              <div
                className="mt-8 flex flex-wrap gap-3"
                aria-label="Collaborators at a glance"
              >
                {areas.flatMap(({ members }) =>
                  members.map((member) => {
                    const initials = getMemberInitials(member.name);
                    return (
                      <a
                        key={member.slug}
                        href={`#${member.slug}`}
                        title={member.name}
                        className="inline-flex items-center gap-2 rounded-sm bg-rush-surface-container-low px-3 py-2 min-h-11 shadow-card-sm hover:bg-rush-surface-container transition-colors"
                      >
                        <span
                          className="w-8 h-8 shrink-0 rounded-sm bg-rush-secondary-container/50 flex items-center justify-center ring-1 ring-rush-outline-variant/15 font-mono text-[10px] font-bold text-rush-dark-green uppercase"
                          aria-hidden
                        >
                          {initials}
                        </span>
                        <span className="text-sm font-medium text-rush-on-surface leading-snug max-w-[12rem] sm:max-w-none">
                          {member.name.replace(/,.*$/, "")}
                        </span>
                      </a>
                    );
                  })
                )}
              </div>
            </>
          ) : null}
        </div>
      </header>

      {areas.length === 0 ? (
        <p className="max-w-screen-2xl mx-auto px-6 lg:px-8 pb-24 font-mono text-sm text-rush-on-surface-variant uppercase tracking-widest ml-0 lg:ml-12">
          Collaborator profiles are being set up.
        </p>
      ) : (
        <div className="pb-8">
          {areas.map(({ area, members }, areaIndex) => {
            const sectionId = areaSectionId(area);
            const headingId = `heading-${sectionId}`;
            const bandClass =
              areaIndex % 2 === 0
                ? "bg-rush-surface-container-low border-y border-rush-outline-variant/10"
                : "bg-rush-surface";

            return (
              <section
                key={area}
                id={sectionId}
                aria-labelledby={headingId}
                className={`${bandClass} py-16 scroll-mt-28`}
              >
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
                  <div className="ml-0 lg:ml-12 mb-10 max-w-3xl">
                    <h2
                      id={headingId}
                      className="text-2xl md:text-3xl font-bold text-rush-dark-green tracking-tight leading-tight"
                    >
                      {area}
                    </h2>
                    <div className="h-1 w-16 bg-rush-teal mt-4" aria-hidden />
                    <p className="mt-4 text-sm text-rush-on-surface-variant">
                      {members.length === 1
                        ? "1 Rush collaborator in this area."
                        : `${members.length} Rush collaborators in this area.`}
                    </p>
                  </div>
                  <ul className="space-y-5 ml-0 lg:ml-12 max-w-3xl">
                    {members.map((member, memberIndex) => (
                      <li key={member.slug}>
                        <CollaboratorProfileCard
                          member={member}
                          surface={memberIndex % 2 === 0 ? "base" : "low"}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <section className="bg-rush-surface-container-low border-t border-rush-outline-variant/10 py-16">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 ml-0 lg:pl-20">
          <h2 className="text-xl font-bold text-rush-dark-green mb-3">
            Continue with RICCC
          </h2>
          <p className="text-rush-on-surface-variant mb-6 max-w-2xl leading-relaxed">
            Meet the full RICCC team, or reach out about a collaboration.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/team"
              className="inline-flex items-center justify-center border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors min-h-11"
            >
              View the team
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-rush-dark-green text-white px-6 py-3 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity min-h-11"
            >
              Contact about a collaboration
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
