import { ImageResponse } from "@vercel/og"
import { OG_SIZE, getInterBoldFont } from "./og"

export async function createListingOGImage({
  title,
  count,
  accentColor = "#3B82F6",
}: {
  title: string
  count: number
  accentColor?: string
}) {
  const fontData = await getInterBoldFont()

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        padding: "80px 80px",
        fontFamily: "Inter",
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 64,
          height: 8,
          backgroundColor: accentColor,
          borderRadius: 4,
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 56,
          color: "#fafafa",
          lineHeight: 1.2,
          maxWidth: 900,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "#a1a1aa",
        }}
      >
        {count} brand {count === 1 ? "identity" : "identities"}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          bottom: 40,
          right: 60,
        }}
      >
        <span style={{ fontSize: 20, color: "#fafafa", opacity: 0.4 }}>
          Loftlyy
        </span>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [{ name: "Inter", data: fontData, style: "normal", weight: 700 }],
    }
  )
}
