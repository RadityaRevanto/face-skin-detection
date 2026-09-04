import type { Metadata } from "next";
import { Suspense } from "react";

import { ConsultationContainer } from "@/features/consultation/components/ConsultationContainer";

export const metadata: Metadata = {
  title: "Konsultasi",
  description: "Kelola konsultasi pasien",
};

export default function DoctorConsultationsPage() {
  return (
    <Suspense fallback={null}>
      <ConsultationContainer role="doctor" />
    </Suspense>
  );
}
