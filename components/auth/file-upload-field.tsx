import { Label } from "@/components/ui/label";
import { UploadIcon } from "./icons";

type FileUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  selectedFile: string;
  placeholder?: string;
  accept?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FileUploadField({
  id,
  name,
  label,
  selectedFile,
  placeholder = "Upload surat keterangan dokter / STR atau dokumen pendukung lainnya",
  accept = ".pdf,.jpg,.jpeg,.png",
  disabled,
  onChange,
}: FileUploadFieldProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>
        {label} <span className='text-rose-500'>*</span>
      </Label>

      <label
        htmlFor={id}
        className={[
          "flex cursor-pointer items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/50",
          disabled ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
      >
        <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm'>
          <UploadIcon />
        </span>

        <span className='min-w-0 flex-1'>
          <span className='block truncate text-sm font-semibold text-zinc-900'>
            {selectedFile || placeholder}
          </span>
          <span className='text-xs text-zinc-500'>
            PDF, JPG, PNG (Maks: 5MB)
          </span>
        </span>

        <span className='rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700'>
          Pilih File
        </span>

        <input
          id={id}
          name={name}
          type='file'
          accept={accept}
          className='sr-only'
          required
          disabled={disabled}
          onChange={onChange}
        />
      </label>
    </div>
  );
}
