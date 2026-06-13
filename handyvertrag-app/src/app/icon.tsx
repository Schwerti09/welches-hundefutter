import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// BELLA-Markenzeichen: Pfote auf Honig-Gradient (konsistent mit favicon.svg
// und logo.png). Ein einheitliches Entity-Bild stärkt den Knowledge-Graph-Trust.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #f0a73c, #ff8a4c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Ballen */}
        <div style={{ position: "absolute", width: 11, height: 9, borderRadius: "50%", background: "#1a1205", top: 17, left: 10.5 }} />
        {/* Zehen */}
        <div style={{ position: "absolute", width: 5, height: 5, borderRadius: "50%", background: "#1a1205", top: 11, left: 7 }} />
        <div style={{ position: "absolute", width: 5.2, height: 5.2, borderRadius: "50%", background: "#1a1205", top: 7.5, left: 11.4 }} />
        <div style={{ position: "absolute", width: 5.2, height: 5.2, borderRadius: "50%", background: "#1a1205", top: 7.5, left: 16 }} />
        <div style={{ position: "absolute", width: 5, height: 5, borderRadius: "50%", background: "#1a1205", top: 11, left: 20.3 }} />
      </div>
    ),
    { ...size }
  );
}
