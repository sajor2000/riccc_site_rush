import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
        }}
      >
        <span style={{ fontSize: 26 }}>RIC</span>
        <span style={{ fontSize: 26, marginTop: -4 }}>CC</span>
      </div>
    ),
    size
  );
}
