import type { TipsGroup } from "../lib/tips-types";
import { TipsCategoryCard } from "./tips-category-card";

type TipsGridProps = {
  groups: TipsGroup[];
};

export function TipsGrid({ groups }: TipsGridProps) {
  return (
    <section>
      <div className='mb-5'>
        <h2 className='text-xl font-bold text-slate-900'>
          Semua Tips Perawatan
        </h2>
        <p className='mt-2 text-sm leading-6 text-slate-500'>
          Tips berikut diambil dari rekomendasi dokter berdasarkan kategori
          kondisi kulit.
        </p>
      </div>

      {groups.length > 0 ? (
        <div className='grid gap-5 lg:grid-cols-2'>
          {groups.map((group) => (
            <TipsCategoryCard key={group.concernId} group={group} />
          ))}
        </div>
      ) : (
        <div className='rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-sm font-semibold text-slate-500'>
          Belum ada tips perawatan yang tersedia.
        </div>
      )}
    </section>
  );
}
