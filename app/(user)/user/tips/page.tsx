import type { Metadata } from "next";

import { TipsClientContent } from "@/features/tips/components/TipsClientContent";

export const metadata: Metadata = {
  title: "Tips",
  description: "Tips perawatan kulit wajah berdasarkan kondisi kulit Anda",
};

export default function TipsPage() {
  return <TipsClientContent />;
}
