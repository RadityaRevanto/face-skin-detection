"use client";

import { useState } from "react";
import { X, Upload, FileText } from "lucide-react";

interface ResubmitVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationId: string;
  onSuccess: () => void;
}

export function ResubmitVerificationModal({
  isOpen,
  onClose,
  verificationId,
  onSuccess,
}: ResubmitVerificationModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      
      if (!validTypes.includes(selectedFile.type)) {
        setError("Format file tidak didukung. Gunakan JPG, PNG, atau PDF.");
        setFile(null);
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB.");
        setFile(null);
        return;
      }
      
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Silakan pilih dokumen terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("documents[]", file);

      const res = await fetch(`/api/doctor-verifications/${verificationId}/resubmit`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengunggah dokumen revisi");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengunggah dokumen");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-bold text-lg text-zinc-900">Upload Dokumen Revisi</h2>
          <button 
            onClick={isSubmitting ? undefined : onClose}
            className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 rounded-full transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-zinc-500 mb-5">
            Silakan unggah dokumen yang valid (STR / Sertifikat Profesi) sesuai dengan catatan dari admin.
          </p>

          <div className="mb-6">
            <label 
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                error ? "border-rose-300 bg-rose-50 hover:bg-rose-100" : "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {file ? (
                  <>
                    <FileText className="w-10 h-10 text-emerald-500 mb-3" />
                    <p className="text-sm font-medium text-emerald-700 truncate max-w-50">{file.name}</p>
                    <p className="text-xs text-emerald-500 mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-emerald-400 mb-3" />
                    <p className="mb-2 text-sm text-zinc-600">
                      <span className="font-semibold text-emerald-600">Klik untuk upload</span> atau drag and drop
                    </p>
                    <p className="text-xs text-zinc-500">PDF, JPG, atau PNG (Maks. 5MB)</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </label>
            {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-zinc-100 text-zinc-700 font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!file || isSubmitting}
              className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengunggah...
                </>
              ) : (
                "Kirim Revisi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
