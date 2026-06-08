import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getSkincareProduct,
  skincareProducts,
} from "@/app/(doctor)/doctor/_lib/doctor-content-data";
import { SkincareForm } from "@/app/(doctor)/doctor/skincare/_components/skincare-form";
import { DoctorHeader } from "@/components/doctor/doctor-header";
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Edit Skincare | Face Skin Detection",
  description: "Edit produk skincare - Dashboard Dokter",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return skincareProducts.map((product) => ({
    id: product.id,
  }));
}

export default async function EditSkincarePage({ params }: PageProps) {
  const { id } = await params;
  const product = getSkincareProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!">
      <div className="flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row">
        <DoctorSidebar />

        <div className="min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!">
          <DoctorHeader
            title="Edit Skincare"
            description="Perbarui data produk skincare yang digunakan untuk rekomendasi."
            searchPlaceholder="Cari produk skincare..."
          />

          <div className="py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
            <div className="w-full space-y-6">
              <div>
                <Link
                  href={ROUTES.DOCTOR.SKINCARE}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                >
                  <span aria-hidden="true">←</span>
                  Kembali ke Data Skincare
                </Link>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                  Edit Produk Skincare
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Perbarui informasi produk agar rekomendasi user tetap akurat.
                </p>
              </div>

              <SkincareForm mode="edit" initialValues={product} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
