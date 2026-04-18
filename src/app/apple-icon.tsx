import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#004923",
          color: "#FFFBEC",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontWeight: 800,
          letterSpacing: "-0.5px",
          lineHeight: 0.9,
          borderRadius: 36,
        }}
      >
        <span style={{ fontSize: 72 }}>RIC</span>
        <span style={{ fontSize: 72, marginTop: -8 }}>CC</span>
      </div>
    ),
    size
  );
}
