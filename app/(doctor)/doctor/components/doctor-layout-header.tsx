"use client";

import { usePathname } from "next/navigation";

import { DoctorHeader } from "@/components/doctor/doctor-header";

function getHeaderContent(pathname: string) {
  if (pathname.startsWith("/doctor/dashboard")) {
    return { title: "Dashboard", description: "Kelola skincare dan rekomendasi untuk pengguna." };
  }
  if (pathname.startsWith("/doctor/skincare/create")) {
    return { title: "Tambah Skincare", description: "Tambahkan produk skincare baru ke sistem rekomendasi." };
  }
  if (pathname.includes("/doctor/skincare/") && pathname.endsWith("/edit")) {
    return { title: "Edit Skincare", description: "Perbarui data produk skincare yang digunakan untuk rekomendasi." };
  }
  if (pathname.startsWith("/doctor/skincare")) {
    return { title: "Skincare", description: "Kelola produk skincare untuk rekomendasi pengguna." };
  }
  if (pathname.startsWith("/doctor/recommendations/create")) {
    return { title: "Tambah Rekomendasi", description: "Buat rule rekomendasi berdasarkan hasil analisis AI." };
  }
  if (pathname.includes("/doctor/recommendations/") && pathname.endsWith("/edit")) {
    return { title: "Edit Rekomendasi", description: "Perbarui rule rekomendasi berdasarkan hasil analisis AI." };
  }
  if (pathname.startsWith("/doctor/recommendations")) {
    return { title: "Rekomendasi", description: "Atur rekomendasi yang akan muncul setelah user mendapat hasil analisis AI." };
  }
  if (pathname.startsWith("/doctor/skin-concerns")) {
    return { title: "Skin Concern", description: "Lihat daftar skin concern yang digunakan sebagai dasar rekomendasi skincare." };
  }
  return { title: "Doctor Panel", description: "Kelola data skincare dan rekomendasi." };
}

export function DoctorLayoutHeader() {
  const pathname = usePathname();
  const header = getHeaderContent(pathname);

  return <DoctorHeader title={header.title} description={header.description} />;
}
