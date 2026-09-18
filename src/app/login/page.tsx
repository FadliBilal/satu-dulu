import { Metadata } from "next";
import { AuthView } from "@/components/auth/AuthView";

export const metadata: Metadata = {
  title: "Masuk • SATUDULU",
  description: "Masuk ke akun SatuDulu Anda untuk melanjutkan eksekusi komitmen harian.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-satubg-light flex items-center justify-center p-4">
      <AuthView />
    </main>
  );
}
