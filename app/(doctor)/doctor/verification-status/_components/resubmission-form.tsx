"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type ResubmissionFormProps = {
  // "rejected" → POST /doctor-verifications (dokumen wajib)
  // "needs_revision" → POST /doctor-verifications/{uuid}/resubmit
  mode: "rejected" | "needs_revision";
  verificationUuid?: string | null;
  defaultValues?: {
    specialization?: string | null;
    str_number?: string | null;
    title?: string | null;
    sub_specialization?: string | null;
    experience_years?: number | null;
    alma_mater?: string | null;
  };
};

export function ResubmissionForm({
  mode,
  verificationUuid,
  defaultValues,
}: ResubmissionFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [specialization, setSpecialization] = useState(
    defaultValues?.specialization ?? ""
  );
  const [strNumber, setStrNumber] = useState(defaultValues?.str_number ?? "");
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [subSpecialization, setSubSpecialization] = useState(
    defaultValues?.sub_specialization ?? ""
  );
  const [experienceYears, setExperienceYears] = useState(
    defaultValues?.experience_years != null
      ? String(defaultValues.experience_years)
      : ""
  );
  const [almaMater, setAlmaMater] = useState(defaultValues?.alma_mater ?? "");
  const [practiceLocations, setPracticeLocations] = useState("");
  const [organizations, setOrganizations] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isResubmit = mode === "needs_revision";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const trimmedSpecialization = specialization.trim();
    if (!trimmedSpecialization) {
      setMessage("Spesialisasi wajib diisi.");
      return;
    }

    if (!isResubmit && !fileInputRef.current?.files?.length) {
      setMessage("Dokumen verifikasi wajib diunggah (JPG/PNG/PDF maks 5MB).");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("specialization", trimmedSpecialization);
      if (strNumber.trim()) formData.append("str_number", strNumber.trim());
      if (title.trim()) formData.append("title", title.trim());
      if (subSpecialization.trim())
        formData.append("sub_specialization", subSpecialization.trim());
      if (experienceYears.trim())
        formData.append("experience_years", experienceYears.trim());
      if (almaMater.trim()) formData.append("alma_mater", almaMater.trim());

      practiceLocations
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((loc) => formData.append("practice_locations[]", loc));

      organizations
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((org) => formData.append("professional_organizations[]", org));

      Array.from(fileInputRef.current?.files ?? []).forEach((file) =>
        formData.append("documents[]", file)
      );

      const endpoint = isResubmit && verificationUuid
        ? `/api/doctor/verifications/${verificationUuid}/resubmit`
        : "/api/doctor/verifications";

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message || "Gagal mengirim pengajuan verifikasi.");
      }

      setIsSuccess(true);
      setMessage("Pengajuan berhasil dikirim. Menyegarkan halaman...");
      setTimeout(() => {
        router.refresh();
      }, 1200);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  return (
    <section className='mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='font-bold text-slate-900'>
            {isResubmit ? "Ajukan Revisi Ulang" : "Ajukan Verifikasi Ulang"}
          </h2>
          <p className='mt-1 text-sm leading-6 text-slate-500'>
            {isResubmit
              ? "Perbarui data/dokumen sesuai catatan admin, lalu kirim untuk ditinjau ulang."
              : "Lengkapi data dan unggah dokumen STR/identitas profesi (JPG, PNG, atau PDF maks 5MB per berkas)."}
          </p>
        </div>
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
            isResubmit
              ? "bg-amber-50 text-amber-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {isResubmit ? "Needs Revision" : "Rejected"}
        </span>
      </div>

      {isSuccess && message ? (
        <div className='mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700'>
          {message}
        </div>
      ) : message ? (
        <div className='mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700'>
          {message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className='mt-5 grid gap-5 md:grid-cols-2'>
        <div>
          <label htmlFor='vs-specialization' className='mb-2 block text-sm font-semibold text-gray-700'>
            Spesialisasi <span className='text-rose-500'>*</span>
          </label>
          <input
            id='vs-specialization'
            type='text'
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder='Contoh: Dermatologi & Venereologi'
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor='vs-str' className='mb-2 block text-sm font-semibold text-gray-700'>
            Nomor STR
          </label>
          <input
            id='vs-str'
            type='text'
            value={strNumber}
            onChange={(e) => setStrNumber(e.target.value)}
            placeholder='Contoh: 12.3.4.567.8'
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor='vs-title' className='mb-2 block text-sm font-semibold text-gray-700'>
            Gelar
          </label>
          <input
            id='vs-title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Contoh: dr., Sp.DV'
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor='vs-subspec' className='mb-2 block text-sm font-semibold text-gray-700'>
            Sub-spesialisasi
          </label>
          <input
            id='vs-subspec'
            type='text'
            value={subSpecialization}
            onChange={(e) => setSubSpecialization(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor='vs-exp' className='mb-2 block text-sm font-semibold text-gray-700'>
            Pengalaman (tahun)
          </label>
          <input
            id='vs-exp'
            type='number'
            min={0}
            max={100}
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor='vs-alma' className='mb-2 block text-sm font-semibold text-gray-700'>
            Alma Mater
          </label>
          <input
            id='vs-alma'
            type='text'
            value={almaMater}
            onChange={(e) => setAlmaMater(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor='vs-practice' className='mb-2 block text-sm font-semibold text-gray-700'>
            Lokasi Praktik <span className='font-normal text-gray-400'>(pisahkan dengan koma)</span>
          </label>
          <input
            id='vs-practice'
            type='text'
            value={practiceLocations}
            onChange={(e) => setPracticeLocations(e.target.value)}
            placeholder='Klinik A, RS B'
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor='vs-orgs' className='mb-2 block text-sm font-semibold text-gray-700'>
            Organisasi Profesi <span className='font-normal text-gray-400'>(pisahkan dengan koma)</span>
          </label>
          <input
            id='vs-orgs'
            type='text'
            value={organizations}
            onChange={(e) => setOrganizations(e.target.value)}
            placeholder='PDVI, IDI'
            className={inputClass}
          />
        </div>

        <div className='md:col-span-2'>
          <label htmlFor='vs-documents' className='mb-2 block text-sm font-semibold text-gray-700'>
            Dokumen Verifikasi{" "}
            {isResubmit ? (
              <span className='font-normal text-gray-400'>(opsional — akan mengganti dokumen lama)</span>
            ) : (
              <span className='text-rose-500'>*</span>
            )}
          </label>
          <input
            ref={fileInputRef}
            id='vs-documents'
            type='file'
            multiple
            accept='.jpg,.jpeg,.png,.pdf'
            className='w-full rounded-xl border border-dashed border-gray-300 bg-gray-50/60 px-4 py-3 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-emerald-700'
          />
        </div>

        <div className='md:col-span-2 flex justify-end'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400'
          >
            {isSubmitting
              ? "Mengirim..."
              : isResubmit
                ? "Kirim Revisi"
                : "Kirim Verifikasi"}
          </button>
        </div>
      </form>
    </section>
  );
}
