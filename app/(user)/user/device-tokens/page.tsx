import type { Metadata } from "next";
import { DeviceTokensContainer } from "@/src/features/device-tokens/components/DeviceTokensContainer";

export const metadata: Metadata = {
  title: "Device Tokens | Face Skin Detection",
  description: "Kelola device untuk notifikasi push",
};

export default function DeviceTokensPage() {
  return (
    <main className="w-full px-4 py-6 sm:px-10 sm:py-8 lg:px-12">
      <DeviceTokensContainer />
    </main>
  );
}
