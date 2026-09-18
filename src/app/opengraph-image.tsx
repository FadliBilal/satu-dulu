import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SATUDULU — Satu hal dalam satu waktu";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#0B1120",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, #1e293b 0%, #0B1120 70%)",
          padding: "60px",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "250px",
            top: "100px",
            borderRadius: "50%",
            backgroundColor: "#2563EB",
            opacity: 0.15,
            filter: "blur(90px)",
          }}
        />

        {/* Brand Monolith Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "96px",
            height: "96px",
            borderRadius: "28px",
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            marginBottom: "32px",
            boxShadow: "0 20px 40px -15px rgba(37, 99, 235, 0.4)",
          }}
        >
          {/* Geomeric Monolith 1 */}
          <div
            style={{
              width: "24px",
              height: "56px",
              borderRadius: "6px",
              background: "linear-gradient(180deg, #60A5FA 0%, #2563EB 100%)",
              boxShadow: "0 0 20px rgba(96, 165, 250, 0.6)",
            }}
          />
        </div>

        {/* Title Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "4px",
              color: "#38BDF8",
              textTransform: "uppercase",
            }}
          >
            SATUDULU
          </span>
          <span
            style={{
              fontSize: "20px",
              color: "#64748B",
            }}
          >
            •
          </span>
          <span
            style={{
              fontSize: "18px",
              color: "#94A3B8",
              fontWeight: 500,
            }}
          >
            Sistem Eksekusi Personal
          </span>
        </div>

        {/* Main Headline */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            letterSpacing: "-1.5px",
            color: "#F8FAFC",
            textAlign: "center",
            marginBottom: "20px",
            lineHeight: 1.15,
          }}
        >
          Satu hal dalam satu waktu.
        </div>

        {/* Subtitle / Value Prop */}
        <div
          style={{
            fontSize: "24px",
            color: "#94A3B8",
            textAlign: "center",
            maxWidth: "760px",
            lineHeight: 1.4,
          }}
        >
          Tentukan apa yang penting. Kerjakan satu per satu tanpa distraksi dan tanpa rasa bersalah.
        </div>

        {/* Footer Pill Badges */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "44px",
          }}
        >
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#CBD5E1",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Single-Thread Execution
          </div>
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#CBD5E1",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Pairwise Prioritization
          </div>
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#CBD5E1",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Offline-First
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
