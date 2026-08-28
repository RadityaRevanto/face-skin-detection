import { RefObject } from "react";

type ResubmissionFormFieldsProps = {
  inputClass: string;
  isResubmit: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  specialization: string;
  setSpecialization: (v: string) => void;
  strNumber: string;
  setStrNumber: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  subSpecialization: string;
  setSubSpecialization: (v: string) => void;
  experienceYears: string;
  setExperienceYears: (v: string) => void;
  almaMater: string;
  setAlmaMater: (v: string) => void;
  practiceLocations: string;
  setPracticeLocations: (v: string) => void;
  organizations: string;
  setOrganizations: (v: string) => void;
  isSubmitting: boolean;
};

export function ResubmissionFormFields({
  inputClass,
  isResubmit,
  onSubmit,
  fileInputRef,
  specialization,
  setSpecialization,
  strNumber,
  setStrNumber,
  title,
  setTitle,
  subSpecialization,
  setSubSpecialization,
  experienceYears,
  setExperienceYears,
  almaMater,
  setAlmaMater,
  practiceLocations,
  setPracticeLocations,
  organizations,
  setOrganizations,
  isSubmitting,
}: ResubmissionFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className='mt-5 grid gap-5 md:grid-cols-2'>
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
  );
}
