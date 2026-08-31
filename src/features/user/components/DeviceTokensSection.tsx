"use client";

import { DeviceTokensContainer } from "@/src/features/device-tokens/components/DeviceTokensContainer";

/**
 * Section Device Tokens di halaman Login & Keamanan — hanya untuk
 * role user & doctor (admin tidak memakai FCM push notification).
 */
export function DeviceTokensSection() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-zinc-900">Device Notifikasi</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Perangkat yang menerima notifikasi push Skincek.
        </p>
      </div>
      <DeviceTokensContainer embedded />
    </section>
  );
}
