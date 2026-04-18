import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { LabMission } from "@/components/home/lab-mission";
import { ResearchSpotlights } from "@/components/home/research-spotlights";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "J.C. Rojas Lab | ICU Data Science & AI at Rush University, Chicago",
  description:
    "J.C. Rojas (Juan Carlos Rojas) leads the RICCC Lab at Rush University — ICU data science, clinical AI, and critical care trials. Co-directed with Kevin Buell. Federated ICU research through the CLIF consortium.",
  openGraph: {
    url: "/",
    title: "J.C. Rojas — RICCC Lab | ICU Data Science & AI at Rush",
    description:
      "J.C. Rojas and Kevin Buell lead the RICCC Lab at Rush University, Chicago — advancing ICU data science, clinical AI, and critical care trials.",
  },
};

const piJsonLd = {
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
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RICCC — J.C. Rojas Lab at Rush University",
  alternateName: [
    "RICCC Lab",
    "JC Rojas Lab",
    "Rojas Lab Rush",
    "Rush Interdisciplinary Consortium for Critical Care Trials and Data Science",
  ],
  url: siteConfig.url,
  description:
    "ICU data science, AI, and clinical trials lab at Rush University, Chicago — led by J.C. Rojas and Kevin Buell.",
};

export default function HomePage() {
  return (
    <main>
      <JsonLd data={piJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <Hero />
      <LabMission />
      <ResearchSpotlights />
    </main>
  );
}
