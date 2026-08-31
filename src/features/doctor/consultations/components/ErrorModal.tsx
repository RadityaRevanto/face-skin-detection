"use client";

import { Info } from "lucide-react";

export function ErrorModal({
  errorMsg,
  onDismiss,
}: {
  errorMsg: string;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden transform transition-all">
        <div className="bg-rose-50 p-4 border-b border-rose-100 flex items-center gap-3">
          <div className="bg-rose-100 text-rose-600 p-2 rounded-full">
            <Info size={20} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-rose-800 text-base">Pemberitahuan</h3>
        </div>
        <div className="p-5">
          <p className="text-zinc-600 text-sm leading-relaxed">{errorMsg}</p>
        </div>
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end">
          <button 
            onClick={onDismiss}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
