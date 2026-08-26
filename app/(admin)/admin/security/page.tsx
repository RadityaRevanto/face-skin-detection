import { SecuritySessions } from "@/components/shared/security-sessions";

export const metadata = {
  title: "Keamanan Akun | Face Skin Detection",
  description: "Kelola sesi dan keamanan akun Anda",
};

export default function SecurityPage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7fbf8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Keamanan & Sesi</h1>
        <SecuritySessions />
      </div>
    </main>
  );
}
