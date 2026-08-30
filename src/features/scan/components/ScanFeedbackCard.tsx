"use client";

import { useState } from "react";

function ThumbUpIcon({ filled }: { filled?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className="h-4 w-4">
      <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3m7-2V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbDownIcon({ filled }: { filled?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className="h-4 w-4">
      <path d="M17 2H20a2 2 0 012 2v7a2 2 0 01-2 2h-3m-7 0v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ScanFeedbackCard({ historyId }: { historyId?: string }) {
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!historyId) return null;

  const submitFeedback = async (isAccurate: boolean) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/scans/${historyId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_accurate: isAccurate }),
      });
      const data = await res.json();
      if (data.data) {
        setFeedback(data.data.is_accurate);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim umpan balik");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h3 className="text-sm font-bold text-slate-900">Seberapa akurat hasil deteksi ini?</h3>
      <p className="mt-1 text-xs text-slate-400">Umpan balik Anda membantu meningkatkan akurasi AI</p>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => submitFeedback(true)}
          disabled={isSubmitting}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
            feedback === true
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
              : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700"
          }`}
        >
          <ThumbUpIcon filled={feedback === true} />
          Akurat
        </button>
        <button
          type="button"
          onClick={() => submitFeedback(false)}
          disabled={isSubmitting}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
            feedback === false
              ? "border-rose-300 bg-rose-50 text-rose-700 ring-2 ring-rose-100"
              : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-700"
          }`}
        >
          <ThumbDownIcon filled={feedback === false} />
          Meleset
        </button>
      </div>

      {feedback !== null && (
        <p className="mt-3 text-center text-xs font-medium text-emerald-600">
          Terima kasih atas umpan balik Anda!
        </p>
      )}
    </div>
  );
}
