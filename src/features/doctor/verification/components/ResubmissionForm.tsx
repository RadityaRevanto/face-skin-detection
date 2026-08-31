"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { ResubmissionHeader } from "./ResubmissionHeader";
import { ResubmissionMessage } from "./ResubmissionMessage";
import { ResubmissionFormFields } from "./ResubmissionFormFields";

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
      <ResubmissionHeader isResubmit={isResubmit} />

      <ResubmissionMessage message={message} isSuccess={isSuccess} />

      <ResubmissionFormFields
        inputClass={inputClass}
        isResubmit={isResubmit}
        onSubmit={handleSubmit}
        fileInputRef={fileInputRef}
        specialization={specialization}
        setSpecialization={setSpecialization}
        strNumber={strNumber}
        setStrNumber={setStrNumber}
        title={title}
        setTitle={setTitle}
        subSpecialization={subSpecialization}
        setSubSpecialization={setSubSpecialization}
        experienceYears={experienceYears}
        setExperienceYears={setExperienceYears}
        almaMater={almaMater}
        setAlmaMater={setAlmaMater}
        practiceLocations={practiceLocations}
        setPracticeLocations={setPracticeLocations}
        organizations={organizations}
        setOrganizations={setOrganizations}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}
