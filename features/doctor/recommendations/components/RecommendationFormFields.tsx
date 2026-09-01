import { RecommendationFormActions } from "./RecommendationFormActions";

export type RecommendationConcernOption = {
  id: string;
  name: string;
};

export type RecommendationProductOption = {
  id: string;
  name: string;
  category: string;
};

type RecommendationFormFieldsProps = {
  concerns: RecommendationConcernOption[];
  products: RecommendationProductOption[];
  concernId: string;
  setConcernId: (v: string) => void;
  productId: string;
  setProductId: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  recommendationText: string;
  setRecommendationText: (v: string) => void;
  priorityLevel: "low" | "medium" | "high";
  setPriorityLevel: (v: "low" | "medium" | "high") => void;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
  onCancel: () => void;
};

const SELECT_CLASS =
  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100";

const INPUT_CLASS =
  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100";

export function RecommendationFormFields({
  concerns,
  products,
  concernId,
  setConcernId,
  productId,
  setProductId,
  title,
  setTitle,
  recommendationText,
  setRecommendationText,
  priorityLevel,
  setPriorityLevel,
  isActive,
  setIsActive,
  isSubmitting,
  mode,
  onCancel,
}: RecommendationFormFieldsProps) {
  return (
    <>
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <div>
          <label
            htmlFor='concernId'
            className='mb-2 block text-sm font-semibold text-gray-700'
          >
            Skin Concern
          </label>

          <select
            id='concernId'
            value={concernId}
            onChange={(event) => setConcernId(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value=''>Pilih skin concern</option>
            {concerns.map((concern) => (
              <option key={concern.id} value={concern.id}>
                {concern.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor='productId'
            className='mb-2 block text-sm font-semibold text-gray-700'
          >
            Produk Skincare
          </label>

          <select
            id='productId'
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value=''>Tanpa produk khusus</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <div>
          <label
            htmlFor='title'
            className='mb-2 block text-sm font-semibold text-gray-700'
          >
            Judul / Routine Step
          </label>

          <input
            id='title'
            type='text'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder='Contoh: Sunscreen wajib pagi'
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label
            htmlFor='priorityLevel'
            className='mb-2 block text-sm font-semibold text-gray-700'
          >
            Priority Level
          </label>

          <select
            id='priorityLevel'
            value={priorityLevel}
            onChange={(event) =>
              setPriorityLevel(
                event.target.value as "low" | "medium" | "high",
              )
            }
            className={SELECT_CLASS}
          >
            <option value='low'>Low Priority</option>
            <option value='medium'>Medium Priority</option>
            <option value='high'>High Priority</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor='recommendationText'
          className='mb-2 block text-sm font-semibold text-gray-700'
        >
          Catatan Rekomendasi
        </label>

        <textarea
          id='recommendationText'
          rows={5}
          value={recommendationText}
          onChange={(event) => setRecommendationText(event.target.value)}
          placeholder='Tulis rekomendasi dokter untuk user...'
          className='w-full resize-none rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm font-medium leading-6 text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
        />
      </div>

      <label className='flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3'>
        <input
          type='checkbox'
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className='h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'
        />

        <span className='text-sm font-semibold text-gray-700'>
          Rekomendasi aktif
        </span>
      </label>

      <RecommendationFormActions
        isSubmitting={isSubmitting}
        mode={mode}
        onCancel={onCancel}
      />
    </>
  );
}
