import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SATUDULU — Satu hal dalam satu waktu",
  description: "Sistem eksekusi personal untuk mahasiswa dan pekerja pengetahuan. Tentukan apa yang penting. Kerjakan satu per satu.",
  manifest: "/manifest.json",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-satubg-light text-satutext-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
