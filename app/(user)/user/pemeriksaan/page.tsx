import { fetchApi } from "@/lib/api/server-client";
import { PemeriksaanContent } from "./_components/pemeriksaan-content";

type ProfileSummary = {
  uuid?: string;
  full_name?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
};

export default async function PemeriksaanPage() {
  let profile: ProfileSummary | null = null;
  try {
    const response = await fetchApi<ProfileSummary>("profile");
    profile = response.data ?? null;
  } catch (error) {
    console.error("Gagal mengambil profile:", error);
  }

  return (
    <main className='w-full px-4 py-6 sm:px-10 sm:py-8 lg:px-12'>
      <PemeriksaanContent initialProfile={profile} />
    </main>
  );
}
