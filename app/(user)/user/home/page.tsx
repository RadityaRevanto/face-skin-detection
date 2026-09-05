import type { Metadata } from "next";

import { HomeContent } from "@/features/home/components/HomeContent";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Ringkasan kesehatan kulit Anda",
};

export default function HomePage() {
  return <HomeContent />;
}
