import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RICCC — ICU Data Science & AI Lab at Rush University",
    short_name: "RICCC",
    description:
      "ICU data science, AI, and clinical trials lab at Rush University, Chicago — led by J.C. Rojas and Kevin Buell.",
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
