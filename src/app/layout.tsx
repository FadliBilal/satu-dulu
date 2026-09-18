import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { ThemeProvider } from "@/lib/theme-context";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://satudulu.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SATUDULU — Satu hal dalam satu waktu",
    template: "%s | SATUDULU",
  },
  description:
    "Sistem operasi eksekusi personal anti-overwhelm untuk mahasiswa dan pekerja pengetahuan. Tentukan apa yang penting, kunci komitmen harian, dan eksekusi satu per satu tanpa rasa bersalah.",
  keywords: [
    "aplikasi to do list indonesia",
    "aplikasi produktivitas",
    "manajemen waktu",
    "single thread execution",
    "pomodoro timer indonesia",
    "bimbingan skripsi",
    "fokus kerja",
    "deep work",
    "pairwise comparison",
    "task manager gratis",
    "anti overthinking",
    "the vault",
    "satudulu",
  ],
  authors: [{ name: "SatuDulu Team", url: BASE_URL }],
  creator: "SatuDulu",
  publisher: "SatuDulu",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "SATUDULU",
    title: "SATUDULU — Satu hal dalam satu waktu",
    description:
      "Sistem operasi eksekusi personal anti-overwhelm. Tentukan apa yang penting, kunci komitmen harian, dan selesaikan satu per satu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SATUDULU — Satu hal dalam satu waktu",
    description:
      "Sistem operasi eksekusi personal anti-overwhelm untuk mahasiswa dan pekerja pengetahuan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SatuDulu",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FBFBFC",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SATUDULU",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "All",
  url: BASE_URL,
  description:
    "Sistem operasi eksekusi personal anti-overwhelm. Tentukan apa yang penting, kunci komitmen harian, dan selesaikan satu per satu tanpa distraksi.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IDR",
  },
  featureList: [
    "Eksekusi Single-Thread (Satu tugas aktif)",
    "Urutan Esensial via Binary Pairwise Prioritization",
    "Timer Mengambang (Picture-in-Picture) di atas aplikasi lain",
    "Pengalihan tugas otomatis tanpa rasa bersalah",
    "Offline-first dengan penyimpanan lokal aman",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("satudulu_theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(t==="system"&&d)){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")};var h=window.location.hash||"";var s=window.location.search||"";if((h.indexOf("type=recovery")!==-1||s.indexOf("type=recovery")!==-1||h.indexOf("error_code=")!==-1||s.indexOf("error_code=")!==-1)&&window.location.pathname!=="/reset-password"){window.location.replace("/reset-password"+s+h);}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-satubg-light dark:bg-[#090D16] text-satutext-primary dark:text-slate-100 font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
