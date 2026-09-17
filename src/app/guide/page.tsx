import { Navbar } from "@/components/layout/Navbar";
import { GuideView } from "@/components/guide/GuideView";

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
