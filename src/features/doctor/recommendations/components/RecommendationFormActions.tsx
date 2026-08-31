import { Button } from "@/components/ui/button";

type RecommendationFormActionsProps = {
  isSubmitting: boolean;
  mode: "create" | "edit";
  onCancel: () => void;
};

export function RecommendationFormActions({
  isSubmitting,
  mode,
  onCancel,
}: RecommendationFormActionsProps) {
  return (
    <div className='flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end'>
      <Button
        type='button'
        variant='ghost'
        disabled={isSubmitting}
        onClick={onCancel}
        className='h-11 rounded-xl px-5 font-semibold text-gray-500 hover:bg-gray-50!'
      >
        Batal
      </Button>

      <Button
        type='submit'
        variant='success'
        disabled={isSubmitting}
        className='h-11 rounded-xl px-5 font-semibold'
      >
        {isSubmitting
          ? "Menyimpan..."
          : mode === "edit"
            ? "Simpan Perubahan"
            : "Tambah Rekomendasi"}
      </Button>
    </div>
  );
}
