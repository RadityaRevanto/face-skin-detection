"use client";

import { Download } from "lucide-react";

type Props = {
  isExporting: boolean;
  onExport: () => void;
};

export function ExportDataCard({ isExporting, onExport }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          <Download size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Ekspor Data Pribadi (UU PDP)</h3>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            Sesuai Undang-Undang Pelindungan Data Pribadi (UU PDP), Anda berhak mengunduh seluruh data aktivitas Anda di platform ini (profil, riwayat *scan*, pesan, dll.) dalam bentuk berkas digital (.json).
          </p>
          <button
            onClick={onExport}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
          >
            {isExporting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <Download size={16} />
            )}
            {isExporting ? "Menyiapkan Data..." : "Unduh Data Pribadi Saya"}
          </button>
        </div>
      </div>
    </div>
  );
}
