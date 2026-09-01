"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authService } from "../services/authService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { BadgeIcon, LockIcon, MailIcon, StethoscopeIcon, UserIcon, HashIcon } from "./Icons";
import { PasswordInput } from "./PasswordInput";
import { IconInput } from "./IconInput";
import { IconSelect } from "./IconSelect";
import { TagInput } from "./TagInput";
import { MultiFileUpload } from "./MultiFileUpload";
import { StepIndicator } from "./StepIndicator";
import { FormMessage } from "./FormMessage";

const STEPS = [
  { label: "Data Akun", shortLabel: "Akun" },
  { label: "Data Profesional", shortLabel: "Profesional" },
  { label: "Praktik & Organisasi", shortLabel: "Praktik" },
  { label: "Dokumen & Persetujuan", shortLabel: "Dokumen" },
];

type StepErrors = Record<number, string>;

export function DoctorRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});

  // Step 1: Data Akun
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Data Profesional
  const [specialization, setSpecialization] = useState("");
  const [subSpecialization, setSubSpecialization] = useState("");
  const [title, setTitle] = useState("");
  const [strNumber, setStrNumber] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [almaMater, setAlmaMater] = useState("");

  // Step 3: Praktik & Organisasi
  const [practiceLocations, setPracticeLocations] = useState<string[]>([]);
  const [professionalOrgs, setProfessionalOrgs] = useState<string[]>([]);

  // Step 4: Dokumen & Consent
  const [files, setFiles] = useState<File[]>([]);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [fileError, setFileError] = useState("");

  const clearStepError = (s: number) => {
    setStepErrors((prev) => {
      const next = { ...prev };
      delete next[s];
      return next;
    });
  };

  const validateStep = (s: number): boolean => {
    clearStepError(s);

    if (s === 0) {
      if (!fullName.trim()) {
        setStepErrors((p) => ({ ...p, 0: "Nama lengkap wajib diisi." }));
        return false;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStepErrors((p) => ({ ...p, 0: "Email tidak valid." }));
        return false;
      }
      if (password.length < 8) {
        setStepErrors((p) => ({ ...p, 0: "Password minimal 8 karakter." }));
        return false;
      }
      if (password !== confirmPassword) {
        setStepErrors((p) => ({ ...p, 0: "Konfirmasi password tidak cocok." }));
        return false;
      }
    }

    if (s === 1) {
      if (!specialization) {
        setStepErrors((p) => ({ ...p, 1: "Spesialisasi wajib dipilih." }));
        return false;
      }
    }

    if (s === 3) {
      if (files.length === 0) {
        setFileError("Dokumen verifikasi wajib diunggah.");
        setStepErrors((p) => ({ ...p, 3: "Unggah minimal 1 dokumen verifikasi." }));
        return false;
      }
      const invalid = files.find(
        (f) => f.size > 5 * 1024 * 1024,
      );
      if (invalid) {
        setFileError(`${invalid.name} melebihi batas 5MB.`);
        setStepErrors((p) => ({ ...p, 3: "Ada dokumen yang melebihi batas ukuran." }));
        return false;
      }
      if (!privacyConsent) {
        setStepErrors((p) => ({ ...p, 3: "Anda harus menyetujui kebijakan privasi." }));
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setMessage("");
    setIsSuccess(false);
    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.set("full_name", fullName.trim());
      fd.set("email", email.trim());
      fd.set("password", password);
      fd.set("specialization", specialization);
      fd.set("privacy_consent", "accepted");

      if (subSpecialization.trim()) fd.set("sub_specialization", subSpecialization.trim());
      if (title.trim()) fd.set("title", title.trim());
      if (strNumber.trim()) fd.set("str_number", strNumber.trim());
      if (experienceYears) fd.set("experience_years", experienceYears);
      if (almaMater.trim()) fd.set("alma_mater", almaMater.trim());

      practiceLocations.forEach((loc) => fd.append("practice_locations[]", loc));
      professionalOrgs.forEach((org) => fd.append("professional_organizations[]", org));
      files.forEach((f) => fd.append("documents[]", f));

      const response = await authService.registerDoctor(fd);

      if (!response.data?.user) {
        setMessage("Registrasi dokter gagal.");
        return;
      }

      setIsSuccess(true);
      setMessage("Registrasi dokter berhasil!");

      // Redirect to success page
      window.setTimeout(() => {
        router.push("/register/doctor/success");
      }, 800);
    } catch (err) {
      console.error("Doctor register error:", err);
      setMessage(getUserFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Step indicator */}
      <StepIndicator
        steps={STEPS}
        currentStep={step}
        onStepClick={(s) => {
          // Only allow going back to completed steps
          if (s < step) setStep(s);
        }}
      />

      <FormMessage message={message || stepErrors[step]} isSuccess={isSuccess} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Data Akun */}
        {step === 0 && (
          <div className="space-y-3.5">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Nama Lengkap <span className="text-rose-500">*</span>
              </Label>
              <IconInput
                id="fullName"
                name="fullName"
                icon={<UserIcon />}
                placeholder="Nama lengkap"
                autoComplete="name"
                required
                disabled={isLoading}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearStepError(0);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-rose-500">*</span>
              </Label>
              <IconInput
                id="email"
                name="email"
                type="email"
                icon={<MailIcon />}
                placeholder="Email aktif"
                autoComplete="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearStepError(0);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-rose-500">*</span>
              </Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Buat password (min. 8 karakter)"
                icon={<LockIcon />}
                required
                minLength={8}
                disabled={isLoading}
                className="!h-11"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearStepError(0);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Konfirmasi Password <span className="text-rose-500">*</span>
              </Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Ulangi password"
                icon={<LockIcon />}
                required
                minLength={8}
                disabled={isLoading}
                className="!h-11"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearStepError(0);
                }}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-rose-500">Password tidak cocok.</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Data Profesional */}
        {step === 1 && (
          <div className="space-y-3.5">
            <div className="space-y-2">
              <Label htmlFor="specialization">
                Spesialisasi <span className="text-rose-500">*</span>
              </Label>
              <IconSelect
                id="specialization"
                name="specialization"
                icon={<StethoscopeIcon />}
                required
                disabled={isLoading}
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  clearStepError(1);
                }}
              >
                <option value="" disabled>
                  Pilih spesialisasi
                </option>
                <option value="dermatology">Dermatologi</option>
                <option value="aesthetic-medicine">Kedokteran Estetika</option>
                <option value="general-practitioner">Dokter Umum</option>
                <option value="skincare-consultant">Konsultan Skincare</option>
              </IconSelect>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subSpecialization">Sub-Spesialisasi</Label>
              <IconInput
                id="subSpecialization"
                name="subSpecialization"
                icon={<StethoscopeIcon />}
                placeholder="Contoh: Aesthetics & Laser"
                disabled={isLoading}
                value={subSpecialization}
                onChange={(e) => setSubSpecialization(e.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Gelar</Label>
                <IconInput
                  id="title"
                  name="title"
                  icon={<BadgeIcon />}
                  placeholder="Contoh: dr. Sp.DV"
                  disabled={isLoading}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strNumber">Nomor STR</Label>
                <IconInput
                  id="strNumber"
                  name="strNumber"
                  icon={<BadgeIcon />}
                  placeholder="Contoh: 1234567890"
                  disabled={isLoading}
                  value={strNumber}
                  onChange={(e) => setStrNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Pengalaman (tahun)</Label>
                <IconInput
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  icon={<HashIcon />}
                  placeholder="Contoh: 8"
                  min={0}
                  max={100}
                  disabled={isLoading}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="almaMater">Alma Mater</Label>
                <IconInput
                  id="almaMater"
                  name="almaMater"
                  icon={<UserIcon />}
                  placeholder="Contoh: Universitas Indonesia"
                  disabled={isLoading}
                  value={almaMater}
                  onChange={(e) => setAlmaMater(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Praktik & Organisasi */}
        {step === 2 && (
          <div className="space-y-4">
            <TagInput
              id="practiceLocations"
              name="practice_locations"
              label="Lokasi Praktik"
              placeholder="Ketik nama lokasi, tekan Enter"
              tags={practiceLocations}
              onTagsChange={setPracticeLocations}
              disabled={isLoading}
              maxItemLength={255}
            />

            <TagInput
              id="professionalOrgs"
              name="professional_organizations"
              label="Organisasi Profesional"
              placeholder="Ketik nama organisasi, tekan Enter"
              tags={professionalOrgs}
              onTagsChange={setProfessionalOrgs}
              disabled={isLoading}
              maxItemLength={100}
            />
          </div>
        )}

        {/* Step 4: Upload Dokumen & Consent */}
        {step === 3 && (
          <div className="space-y-4">
            <MultiFileUpload
              id="verificationDocuments"
              name="documents"
              label="Dokumen Verifikasi (STR / Sertifikat)"
              files={files}
              onFilesChange={(f) => {
                setFiles(f);
                setFileError("");
                clearStepError(3);
              }}
              disabled={isLoading}
              error={fileError}
            />

            <label className="flex items-start gap-3 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => {
                  setPrivacyConsent(e.target.checked);
                  clearStepError(3);
                }}
                disabled={isLoading}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-emerald-300 accent-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span>
                Saya menyetujui{" "}
                <span className="font-semibold text-emerald-700">
                  Kebijakan Privasi
                </span>{" "}
                Skincek (UU PDP) dan memahami data saya akan digunakan untuk
                verifikasi akun dokter.
              </span>
            </label>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
              className="h-11 rounded-xl border-zinc-200 text-sm font-semibold"
            >
              Kembali
            </Button>
          ) : (
            <span />
          )}

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold shadow-xl shadow-emerald-600/25 hover:bg-emerald-700"
            >
              Selanjutnya
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading || !privacyConsent}
              className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold shadow-xl shadow-emerald-600/25 hover:bg-emerald-700"
            >
              {isLoading ? (
                <>
                  Mendaftarkan...
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                </>
              ) : (
                "Daftar sebagai Dokter"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
