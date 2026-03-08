/**
 * GET /api/og?title=...&subtitle=...&type=firma|blog|city|default
 *
 * Dinamik Open Graph görseli üretir.
 * Metadata'da şöyle kullanılır:
 *   images: [{ url: `/api/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630 }]
 */

import { ImageResponse } from "@vercel/og"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") ?? "Gerüstbauer finden"
  const subtitle = searchParams.get("subtitle") ?? "Geprüfte Gerüstbaufirmen in Deutschland"
  const type = searchParams.get("type") ?? "default" // firma | blog | city | default

  // Tip bazında renk tonu
  const accentColor = type === "blog" ? "#f97316" : "#f97316" // turuncu

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a", // slate-900
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Arka plan deseni */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(249,115,22,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(249,115,22,0.1) 0%, transparent 40%)",
          }}
        />

        {/* İçerik */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "60px 70px",
            position: "relative",
          }}
        >
          {/* Üst: Logo ve tip etiketi */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: accentColor,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                G
              </div>
              <span style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>
                Gerüstbauer<span style={{ color: accentColor }}>24</span>
              </span>
            </div>
            {type !== "default" && (
              <div
                style={{
                  backgroundColor: "rgba(249,115,22,0.2)",
                  border: "1px solid rgba(249,115,22,0.5)",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  color: accentColor,
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {type === "firma" && "🏗 Gerüstbaufirma"}
                {type === "blog" && "📝 Blog Artikel"}
                {type === "city" && "📍 Standort"}
              </div>
            )}
          </div>

          {/* Orta: Başlık */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Üst çizgi */}
            <div
              style={{
                width: "60px",
                height: "4px",
                backgroundColor: accentColor,
                borderRadius: "2px",
              }}
            />
            <div
              style={{
                color: "white",
                fontSize: title.length > 50 ? "42px" : "52px",
                fontWeight: "bold",
                lineHeight: "1.2",
                maxWidth: "900px",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  color: "#94a3b8", // slate-400
                  fontSize: "22px",
                  lineHeight: "1.4",
                  maxWidth: "800px",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Alt: URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#64748b", // slate-500
              fontSize: "16px",
            }}
          >
            <span>🌐</span>
            <span>geruestbauer24.eu</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
