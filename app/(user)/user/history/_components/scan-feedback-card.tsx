"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900 text-sm mb-3">Seberapa akurat hasil deteksi ini?</h3>
      <div className="flex items-center gap-3">
        <button
          onClick={() => submitFeedback(true)}
          disabled={isSubmitting}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-sm font-medium transition-colors ${
            feedback === true 
              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <ThumbsUp size={16} className={feedback === true ? "fill-emerald-200" : ""} />
          Akurat
        </button>
        <button
          onClick={() => submitFeedback(false)}
          disabled={isSubmitting}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-sm font-medium transition-colors ${
            feedback === false 
              ? "bg-rose-50 border-rose-200 text-rose-700" 
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <ThumbsDown size={16} className={feedback === false ? "fill-rose-200" : ""} />
          Meleset
        </button>
      </div>
      {feedback !== null && (
        <p className="text-xs text-slate-500 mt-3 text-center">
          Terima kasih! Umpan balik Anda membantu kami meningkatkan akurasi sistem kecerdasan buatan.
        </p>
      )}
    </div>
  );
}
