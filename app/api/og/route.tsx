import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "RealHubb — Real Estate in Bangalore";
  const subtitle = searchParams.get("subtitle") ?? "Verified RERA-registered properties. Zero brokerage.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#00274D",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Gold accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", backgroundColor: "#D7A764" }} />

        {/* Logo */}
        <div style={{ position: "absolute", top: "48px", left: "60px", display: "flex", alignItems: "center" }}>
          <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 400 }}>Real</span>
          <span style={{ color: "#D7A764", fontSize: "28px", fontWeight: 400 }}>Hubb</span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "#D7A764", fontSize: "14px", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
            RealHubb Ventures Pvt. Ltd.
          </p>
          <h1 style={{ color: "#ffffff", fontSize: "52px", fontWeight: 400, lineHeight: 1.15, margin: 0, maxWidth: "900px" }}>
            {title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "22px", margin: 0 }}>
            {subtitle}
          </p>
        </div>

        {/* Bottom bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", backgroundColor: "#D7A764", opacity: 0.4 }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
