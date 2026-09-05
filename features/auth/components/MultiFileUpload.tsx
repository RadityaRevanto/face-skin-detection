"use client";

import { useRef } from "react";
import { X, FileText, AlertCircle } from "lucide-react";
import { UploadIcon } from "./Icons";

type MultiFileUploadProps = {
  id: string;
  name: string;
  label: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  error?: string;
};

const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];

function validateFile(file: File, maxSizeMB: number): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Format ${ext.toUpperCase()} tidak didukung. Gunakan PDF, JPG, atau PNG.`;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `${file.name} melebihi batas ${maxSizeMB}MB.`;
  }
  return null;
}

export function MultiFileUpload({
  id,
  name,
  label,
  files,
  onFilesChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxFiles = 5,
  maxSizeMB = 5,
  disabled = false,
  error,
}: MultiFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const additions = Array.from(newFiles).filter((f) => {
      if (files.length + additions.length >= maxFiles) return false;
      if (files.some((existing) => existing.name === f.name && existing.size === f.size)) return false;
      return true;
    });
    onFilesChange([...files, ...additions]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-900">
        {label} <span className="text-rose-500">*</span>
      </label>

      {/* Drop zone */}
      <label
        htmlFor={id}
        className={[
          "flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-4 transition hover:border-emerald-200 hover:bg-emerald-50/50 sm:py-3",
          disabled ? "pointer-events-none opacity-60" : "",
          error ? "border-rose-300 bg-rose-50/50" : "",
        ].join(" ")}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <UploadIcon />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-zinc-900">
            Klik untuk memilih file
          </span>
          <span className="text-xs text-zinc-500">
            PDF, JPG, PNG · Maks {maxSizeMB}MB/file · Maks {maxFiles} file
          </span>
        </span>

        <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          Pilih File
        </span>

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          multiple
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            handleAdd(e.target.files);
          }}
        />
      </label>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-600">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => {
            const validationError = validateFile(file, maxSizeMB);
            return (
              <div
                key={`${file.name}-${i}`}
                className={[
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                  validationError
                    ? "border-rose-200 bg-rose-50"
                    : "border-zinc-100 bg-white",
                ].join(" ")}
              >
                <FileText
                  size={16}
                  className={[
                    "shrink-0",
                    validationError ? "text-rose-500" : "text-emerald-600",
                  ].join(" ")}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={[
                      "truncate text-sm font-medium",
                      validationError ? "text-rose-700" : "text-zinc-900",
                    ].join(" ")}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                    {validationError && (
                      <span className="ml-2 text-rose-500">
                        · {validationError}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  disabled={disabled}
                  className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-rose-600"
                  aria-label={`Hapus ${file.name}`}
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
