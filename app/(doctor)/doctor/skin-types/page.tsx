import type { Metadata } from "next";
import { SkinTypesContainer } from "@/src/features/skin-types/components/SkinTypesContainer";

export const metadata: Metadata = {
  title: "Kelola Skin Types | Face Skin Detection",
  description: "Kelola jenis kulit untuk sistem rekomendasi",
};

export default function SkinTypesPage() {
  return (
    <main className="w-full px-4 py-6 sm:px-10 sm:py-8 lg:px-12">
      <SkinTypesContainer />
    </main>
  );
}
