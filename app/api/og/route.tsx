import { ImageResponse } from "@vercel/og"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") ?? "Gerüstbauer finden"
  const subtitle = searchParams.get("subtitle") ?? "Geprüfte Gerüstbaufirmen in Deutschland"
  const type = searchParams.get("type") ?? "default"

  const accentColor = "#f97316"

  const typeLabel =
    type === "firma" ? "Gerüstbaufirma" :
    type === "blog" ? "Blog Artikel" :
    type === "city" ? "Standort" : ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "60px 70px",
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
              <div style={{ display: "flex", color: "white", fontSize: "24px", fontWeight: "bold" }}>
                Geruestbauer24
              </div>
            </div>
            {typeLabel ? (
              <div
                style={{
                  display: "flex",
                  backgroundColor: "rgba(249,115,22,0.2)",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  color: accentColor,
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {typeLabel}
              </div>
            ) : (
              <div style={{ display: "flex" }} />
            )}
          </div>

          {/* Orta: Başlık */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                width: "60px",
                height: "4px",
                backgroundColor: accentColor,
                borderRadius: "2px",
              }}
            />
            <div
              style={{
                display: "flex",
                color: "white",
                fontSize: title.length > 50 ? "42px" : "52px",
                fontWeight: "bold",
                lineHeight: "1.2",
                maxWidth: "900px",
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div
                style={{
                  display: "flex",
                  color: "#94a3b8",
                  fontSize: "22px",
                  lineHeight: "1.4",
                  maxWidth: "800px",
                }}
              >
                {subtitle}
              </div>
            ) : (
              <div style={{ display: "flex" }} />
            )}
          </div>

          {/* Alt: URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
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
