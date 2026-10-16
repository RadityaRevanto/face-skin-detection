import type { Metadata } from "next";
import { SkinTypesContainer } from "@/features/skin-types/components/SkinTypesContainer";

export const metadata: Metadata = {
  title: "Kelola Skin Types",
  description: "Kelola jenis kulit untuk sistem rekomendasi",
};

export default function SkinTypesPage() {
  return (
    <main className="w-full">
      <SkinTypesContainer />
    </main>
  );
}
