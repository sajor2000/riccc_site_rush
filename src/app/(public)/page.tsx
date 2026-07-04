import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { LabMission } from "@/components/home/lab-mission";
import { ResearchSpotlights } from "@/components/home/research-spotlights";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    absolute:
      "RICCC | Rush Interdisciplinary Consortium for Critical Care Trials and Data Science",
  },
  description:
    "RICCC — the Rush Interdisciplinary Consortium for Critical Care Trials and Data Science at Rush University, Chicago. Advancing ICU data science, clinical AI, and critical care trials through federated research with the CLIF consortium. Investigators include J.C. Rojas and Kevin Buell.",
  openGraph: {
    url: "/",
    title:
      "RICCC | Rush Interdisciplinary Consortium for Critical Care Trials and Data Science",
    description:
      "Advancing ICU data science, clinical AI, and critical care trials at Rush University, Chicago.",
  },
};

// Invisible structured data: keeps the site discoverable for investigator-name
// searches (Juan/J.C. Rojas, Kevin Buell) while on-page branding stays RICCC.
const investigatorsJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Juan C. Rojas",
    alternateName: ["J.C. Rojas", "JC Rojas", "Juan Carlos Rojas", "Juan Rojas"],
    givenName: "Juan Carlos",
    familyName: "Rojas",
    honorificSuffix: "MD, MS",
    jobTitle: "Assistant Professor of Medicine",
    description:
      "Physician-scientist and intensivist specializing in ICU data science, clinical AI, and healthcare equity at Rush University, Chicago.",
    url: `${siteConfig.url}/team#juan-rojas`,
    image: `${siteConfig.url}/images/team/juan-rojas.webp`,
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: "Rush University System for Health",
      url: "https://www.rush.edu",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chicago",
        addressRegion: "IL",
        addressCountry: "US",
      },
    },
    affiliation: {
      "@type": "ResearchOrganization",
      name: "RICCC",
      alternateName:
        "Rush Interdisciplinary Consortium for Critical Care Trials and Data Science",
      url: siteConfig.url,
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "University of Illinois at Chicago" },
      { "@type": "CollegeOrUniversity", name: "University of Chicago" },
    ],
    knowsAbout: [
      "Critical care medicine",
      "Clinical informatics",
      "ICU data science",
      "Artificial intelligence in healthcare",
      "Healthcare equity",
    ],
    sameAs: [
      "https://scholar.google.com/citations?user=XXHTvWEAAAAJ&hl=en",
      "https://orcid.org/0000-0002-8561-4575",
      "https://www.linkedin.com/in/juan-c-rojas-md-ms-3a7345190/",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Kevin Buell",
    alternateName: ["Kevin G. Buell"],
    jobTitle: "Assistant Professor",
    description:
      "Intensivist advancing critical care trials and ICU data science at Rush University, Chicago.",
    url: `${siteConfig.url}/team#kevin-buell`,
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: "Rush University System for Health",
      url: "https://www.rush.edu",
    },
    affiliation: {
      "@type": "ResearchOrganization",
      name: "RICCC",
      alternateName:
        "Rush Interdisciplinary Consortium for Critical Care Trials and Data Science",
      url: siteConfig.url,
    },
    sameAs: [
      "https://scholar.google.com/citations?hl=en&user=svuM0vcAAAAJ",
    ],
  },
];

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RICCC — Rush Interdisciplinary Consortium for Critical Care Trials and Data Science",
  alternateName: [
    "RICCC",
    "RICCC Lab",
    "Rush Interdisciplinary Consortium for Critical Care Trials and Data Science",
  ],
  url: siteConfig.url,
  description:
    "ICU data science, AI, and clinical trials consortium at Rush University, Chicago. Investigators include J.C. Rojas and Kevin Buell.",
};

export default function HomePage() {
  return (
    <main>
      {investigatorsJsonLd.map((person) => (
        <JsonLd key={person.name} data={person} />
      ))}
      <JsonLd data={websiteJsonLd} />
      <Hero />
      <LabMission />
      <ResearchSpotlights />
    </main>
  );
}
