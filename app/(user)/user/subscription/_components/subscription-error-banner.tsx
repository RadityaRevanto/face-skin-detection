"use client";

import { AlertCircle } from "lucide-react";

export function SubscriptionErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="w-full max-w-3xl mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
      <AlertCircle className="shrink-0 mt-0.5" size={20} />
      <p className="text-sm">{message}</p>
    </div>
  );
}
