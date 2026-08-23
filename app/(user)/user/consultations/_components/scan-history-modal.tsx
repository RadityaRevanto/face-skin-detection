"use client";

import { useState, useEffect } from "react";
import { X, Search, Check, AlertCircle } from "lucide-react";
import { ScanHistory, getScans } from "@/lib/api/scans-query";

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScan: (scan: ScanHistory) => void;
}

export function ScanHistoryModal({ isOpen, onClose, onSelectScan }: ScanHistoryModalProps) {
  const [scans, setScans] = useState<ScanHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchScans();
    }
  }, [isOpen]);

  const fetchScans = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getScans(1);
      setScans(res.data || []);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "high": return "bg-rose-100 text-rose-700 border-rose-200";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
      case "low": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const getSeverityText = (level: string) => {
    switch (level) {
      case "high": return "Parah";
      case "medium": return "Sedang";
      case "low": return "Ringan";
      default: return level;
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
          <h2 className="font-bold text-lg text-zinc-900">Pilih Riwayat Scan</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-zinc-500 text-sm">Memuat riwayat scan...</p>
            </div>
          ) : errorMsg ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-3">
                <AlertCircle size={24} />
              </div>
              <p className="text-rose-600 text-sm">{errorMsg}</p>
              <button 
                onClick={fetchScans}
                className="mt-4 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium rounded-xl transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="text-zinc-300" />
              </div>
              <h3 className="font-semibold text-zinc-800">Belum ada riwayat</h3>
              <p className="text-zinc-500 text-sm mt-1 max-w-xs">Anda belum pernah melakukan deteksi wajah. Silakan gunakan fitur Scan terlebih dahulu.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {scans.map((scan) => (
                <button
                  key={scan.uuid}
                  onClick={() => onSelectScan(scan)}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-zinc-200 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all text-left group"
                >
                  <img 
                    src={scan.image_url} 
                    alt="Scan Result" 
                    className="w-20 h-24 object-cover rounded-lg bg-zinc-100 shrink-0" 
                  />
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-zinc-800 capitalize truncate">{scan.predicted_class}</h4>
                      <span className="text-[11px] text-zinc-500 shrink-0 bg-zinc-100 px-2 py-0.5 rounded-full">
                        {new Date(scan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getSeverityColor(scan.severity_level)}`}>
                        {getSeverityText(scan.severity_level)} ({scan.severity_score})
                      </span>
                      <span className="text-xs text-zinc-500">
                        Akurasi {(scan.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    
                    <p className="text-xs text-zinc-400 flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                      <Check size={12} /> Klik untuk melampirkan
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
