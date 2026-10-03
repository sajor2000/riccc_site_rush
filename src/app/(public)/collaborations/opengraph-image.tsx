import { ImageResponse } from "next/og";

export const alt =
  "RICCC multidisciplinary research collaborations at Rush University, Chicago";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          backgroundColor: "#006332",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.8,
            marginBottom: "20px",
          }}
        >
          RICCC · Across Rush
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "-1.5px",
            lineHeight: 1.15,
            marginBottom: "20px",
            maxWidth: 920,
          }}
        >
          Research Collaborations in Critical Care and Data Science
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            fontSize: 20,
            opacity: 0.8,
            flexWrap: "wrap",
          }}
        >
          <span>Emergency Medicine</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Critical Care</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Respiratory Care</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Human-Centered Design</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
