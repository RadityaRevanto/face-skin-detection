"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

type Props = {
  message: string | null;
  /** Email user untuk link verifikasi (bila error karena email belum terverifikasi). */
  verifyEmail?: string | null;
};

export function SubscriptionErrorBanner({ message, verifyEmail }: Props) {
  if (!message) return null;

  const needsVerification = /verifikasi email/i.test(message);

  return (
    <div className="mb-6 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-start gap-3">
      <AlertCircle className="shrink-0 mt-0.5" size={20} />
      <div className="min-w-0 flex-1">
        <p className="text-sm">{message}</p>
        {needsVerification && (
          <Link
            href={verifyEmail ? `/verify-email?email=${encodeURIComponent(verifyEmail)}` : "/verify-email"}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
          >
            Verifikasi Email Sekarang
          </Link>
        )}
      </div>
    </div>
  );
}
