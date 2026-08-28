import type { Metadata } from "next";
import { SkincareCatalog } from "@/src/features/skincare/components/SkincareCatalog";

export const metadata: Metadata = {
  title: "Katalog Skincare | Face Skin Detection",
  description: "Temukan produk skincare yang sesuai untuk kulit Anda",
};

export default function SkincareCatalogPage() {
  return (
    <main className="w-full px-4 py-6 sm:px-10 sm:py-8 lg:px-12">
      <SkincareCatalog initialProducts={[]} initialTotal={0} />
    </main>
  );
}
