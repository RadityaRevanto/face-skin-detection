import type { Metadata } from "next";
import { Suspense } from "react";
import { DoctorConsultationsContent } from "@/features/doctor/consultations/components/DoctorConsultationsContent";

export const metadata: Metadata = {
  title: "Konsultasi Pasien - SkinCek Dokter",
  description: "Kelola sesi telekonsultasi dan komunikasi interaktif dengan pasien",
};

export default function DoctorConsultationsPage() {
  return (
    <Suspense fallback={null}>
      <DoctorConsultationsContent />
    </Suspense>
  );
}
