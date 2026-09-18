import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { GuideView } from "@/components/guide/GuideView";

export const metadata: Metadata = {
  title: "Panduan Penggunaan",
  description:
    "Pelajari 3 langkah mudah menggunakan SatuDulu: tampung di Inbox, kunci 1–4 komitmen esensial, dan eksekusi single-thread tanpa rasa bersalah.",
  alternates: {
    canonical: "/guide",
  },
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-satubg-light flex flex-col selection:bg-satublue-100">
      <Navbar />
      <main className="flex-1 w-full">
        <GuideView />
      </main>
    </div>
  );
}
