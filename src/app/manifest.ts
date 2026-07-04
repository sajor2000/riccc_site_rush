import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RICCC — Rush Interdisciplinary Consortium for Critical Care Trials and Data Science",
    short_name: "RICCC",
    description:
      "ICU data science, AI, and clinical trials consortium at Rush University, Chicago.",
    start_url: "/",
    display: "browser",
    background_color: "#FFFBEC",
    theme_color: "#004923",
    icons: [
      { src: "/icon", sizes: "96x96", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
