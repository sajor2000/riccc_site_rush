import type { Metadata } from "next";
import Link from "next/link";
import {
  getTeamMembersByTier,
  groupCollaboratorsByArea,
  getMemberInitials,
} from "@/lib/team";
import {
  MemberSocialLinks,
  hasMemberSocialLinks,
} from "@/components/team/member-social-links";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";
import { isSafeUrl } from "@/lib/url";

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

function areaSectionId(area: string): string {
  return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function profileLinkLabel(url: string): string {
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (path.includes("/news/") || path.includes("/news-")) return "Rush feature";
    if (path.includes("/faculty/")) return "Rush profile";
  } catch {
    /* ignore */
  }
  return "Rush profile";
}

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

  const personSchemas = grouped.collaborator.map((member) => {
    const sameAs: string[] = [];
    if (member.scholar) sameAs.push(member.scholar);
    if (member.orcid) sameAs.push(`https://orcid.org/${member.orcid}`);
    if (member.linkedin) sameAs.push(member.linkedin);
    if (member.website) sameAs.push(member.website);
    if (member.github) sameAs.push(member.github);

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: member.name.replace(/,.*$/, ""),
      ...(member.alternateNames && { alternateName: member.alternateNames }),
      ...(member.role && { jobTitle: member.role.split(" | ")[0] }),
      worksFor: {
        "@type": "ResearchOrganization",
        name: siteConfig.name,
        parentOrganization: {
          "@type": "CollegeOrUniversity",
          name: "Rush University System for Health",
        },
      },
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
      {personSchemas.map((schema, i) => (
        <JsonLd key={grouped.collaborator[i].slug} data={schema} />
      ))}

      <header className="pt-32 pb-16 max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div className="ml-0 lg:ml-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-4">
            {siteConfig.name} · Across Rush
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-rush-dark-green leading-[1.1]">
            Multidisciplinary Collaborations
          </h1>
          <div className="h-1 w-24 bg-rush-teal mt-6" aria-hidden />
          <p className="mt-6 text-xl text-rush-on-surface-variant leading-relaxed">
            {siteConfig.name} works with Rush colleagues in emergency medicine,
            critical care, respiratory care, and human-centered design. Each
            collaborator partners with RICCC investigators on clinical trials and
            other projects connected to the lab.
          </p>
          {areas.length > 0 ? (
            <nav
              aria-label="Collaboration areas"
              className="mt-10 flex flex-wrap gap-x-5 gap-y-3"
            >
              {areas.map(({ area }) => (
                <a
                  key={area}
                  href={`#${areaSectionId(area)}`}
                  className="font-mono text-xs uppercase tracking-widest text-rush-dark-green border-b border-rush-dark-green/30 pb-0.5 hover:border-rush-dark-green transition-colors"
                >
                  {area}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </header>

      {areas.length === 0 ? (
        <p className="max-w-screen-2xl mx-auto px-6 lg:px-8 pb-24 font-mono text-sm text-rush-on-surface-variant uppercase tracking-widest ml-0 lg:ml-12">
          Collaborator profiles are being set up.
        </p>
      ) : (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 pb-32 space-y-20">
          {areas.map(({ area, members }) => {
            const sectionId = areaSectionId(area);
            const headingId = `heading-${sectionId}`;
            return (
              <section
                key={area}
                id={sectionId}
                aria-labelledby={headingId}
                className="border-t border-rush-outline-variant/20 pt-12 scroll-mt-28"
              >
                <div className="ml-0 lg:ml-12 mb-10 max-w-3xl">
                  <h2
                    id={headingId}
                    className="text-2xl md:text-3xl font-bold text-rush-dark-green tracking-tight leading-tight"
                  >
                    {area}
                  </h2>
                  <div className="h-1 w-16 bg-rush-teal mt-4" aria-hidden />
                </div>
                <ul className="space-y-12 ml-0 lg:ml-12 max-w-3xl">
                  {members.map((member) => {
                    const initials = getMemberInitials(member.name);
                    const showWebsite =
                      Boolean(member.website) && isSafeUrl(member.website!);
                    const hasSocials =
                      hasMemberSocialLinks(member) || showWebsite;

                    return (
                      <li
                        key={member.slug}
                        id={member.slug}
                        className="scroll-mt-28"
                      >
                        <div className="flex gap-4 sm:gap-5">
                          <div
                            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-sm bg-rush-secondary-container/50 flex items-center justify-center ring-1 ring-rush-outline-variant/15"
                            aria-hidden
                          >
                            <span className="font-mono text-sm font-bold text-rush-dark-green select-none uppercase">
                              {initials}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-2xl font-bold text-rush-dark-green tracking-tight mb-2">
                              {member.name}
                            </h3>
                            <p className="text-sm text-rush-on-surface-variant leading-snug mb-4 max-w-prose">
                              {member.role}
                            </p>
                            {member.bio ? (
                              <div className="space-y-4 text-base text-rush-on-surface-variant leading-relaxed">
                                {member.bio.split(/\n\n+/).map((para) => (
                                  <p key={para.slice(0, 40)}>{para}</p>
                                ))}
                              </div>
                            ) : null}
                            {hasSocials ? (
                              <div className="mt-5 flex flex-wrap items-center gap-3">
                                <MemberSocialLinks
                                  member={member}
                                  variant="compact"
                                  omitKeys={showWebsite ? ["website"] : undefined}
                                />
                                {showWebsite ? (
                                  <a
                                    href={member.website!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center min-h-11 font-mono text-xs uppercase tracking-widest text-rush-dark-green border-b border-rush-dark-green/30 pb-0.5 hover:border-rush-dark-green transition-colors"
                                  >
                                    {profileLinkLabel(member.website!)}
                                  </a>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
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
