import { Navbar } from "@/components/layout/Navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-satubg-light flex flex-col selection:bg-gray-200">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
