import { requireProfile } from "@/lib/auth";
import { PemeriksaanContent } from "./_components/pemeriksaan-content";

export const dynamic = "force-dynamic";

type ProfileSummary = {
  uuid?: string;
  full_name?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
};

export default async function PemeriksaanPage() {
  const profile = await requireProfile();

  return (
    <main className='w-full px-4 py-6 sm:px-10 sm:py-8 lg:px-12'>
      <PemeriksaanContent initialProfile={profile} />
    </main>
  );
}
