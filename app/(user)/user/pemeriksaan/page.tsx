import { fetchApi } from "@/lib/api/server-client";
import { PemeriksaanContent } from "./_components/pemeriksaan-content";

export default async function PemeriksaanPage() {
  let profile = null;
  try {
    const response = await fetchApi<any>("profile");
    profile = response.data;
  } catch (error) {
    console.error("Gagal mengambil profile:", error);
  }

  return (
    <main className='w-full px-4 py-6 sm:px-10 sm:py-8 lg:px-12'>
      <PemeriksaanContent initialProfile={profile} />
    </main>
  );
}
