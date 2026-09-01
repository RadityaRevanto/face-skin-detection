import type { Metadata } from "next";

import { ScanPageContent } from "@/features/scan/components/ScanPageContent";

export const metadata: Metadata = {
  title: "Pemeriksaan",
  description: "Analisis kulit wajah dengan AI",
};

export default function ScanPage() {
  return <ScanPageContent />;
}
