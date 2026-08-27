"use client";

import { AlertCircle } from "lucide-react";

type Props = {
  isOpen: boolean;
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function CancelModal({ isOpen, isProcessing, onCancel, onConfirm }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">Batalkan Langganan?</h2>
          <p className="text-zinc-500 mb-6 text-sm sm:text-base leading-relaxed">
            Anda akan kehilangan akses prioritas dan konsultasi tanpa batas. <br /><br />
            <span className="font-semibold text-red-600">Peringatan:</span> Sisa waktu paket yang sudah dibayar tidak dapat di-refund (dikembalikan).
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-zinc-200 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Ya, Batalkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
