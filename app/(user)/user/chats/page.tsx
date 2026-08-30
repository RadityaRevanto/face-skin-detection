import type { Metadata } from "next";
import { Suspense } from "react";

import { ConsultationContainer } from "@/src/features/consultation/components/ConsultationContainer";

export const metadata: Metadata = {
  title: "Riwayat Chat",
  description: "Riwayat percakapan dengan dokter dan Aura Skin",
};

export default function ChatsPage() {
  return (
    <Suspense fallback={null}>
      <ConsultationContainer />
    </Suspense>
  );
}
