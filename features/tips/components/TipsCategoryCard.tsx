import type { TipsGroup } from "../types";
import { CalendarIcon } from "@/features/tips/components/Icons";

type TipsCategoryCardProps = {
  group: TipsGroup;
};

export function TipsCategoryCard({ group }: TipsCategoryCardProps) {
  return (
    <article className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <div className='mb-5'>
        <h2 className='text-lg font-bold text-slate-900'>
          {group.concernName}
        </h2>
        <p className='mt-2 text-sm leading-6 text-slate-500'>
          {group.concernDescription ??
            "Kumpulan tips perawatan berdasarkan kondisi kulit ini."}
        </p>
      </div>

      <div className='space-y-4'>
        {group.tips.map((tip) => (
          <div key={tip.uuid} className='flex items-start gap-3'>
            <div className='mt-0.5 text-slate-400'>
              <CalendarIcon />
            </div>

            <div>
              <p className='text-sm font-bold text-slate-800'>{tip.title}</p>
              <p className='mt-1 text-sm font-semibold leading-6 text-slate-500'>
                {tip.recommendation_text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
