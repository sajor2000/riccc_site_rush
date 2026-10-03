import { ImageResponse } from "next/og";

export const alt =
  "RICCC Chicago Summer Internship in Healthcare Data Science at Rush University";
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
          backgroundColor: "#004923",
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
          RICCC · Rush University · Chicago
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "-1.5px",
            lineHeight: 1.15,
            marginBottom: "20px",
            maxWidth: 900,
          }}
        >
          Summer Internship in Healthcare Data Science
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            opacity: 0.85,
            lineHeight: 1.4,
            maxWidth: 820,
          }}
        >
          College and master{"'"}s students · ICU research · Clinical AI · Apply by
          December 1
        </div>
      </div>
    ),
    { ...size }
  );
}
