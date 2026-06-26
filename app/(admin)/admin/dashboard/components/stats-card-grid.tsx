import { Card } from "@/components/ui/card";

import type { AdminDashboardStat } from "../lib/admin-dashboard-types";
import { DashboardIcon } from "./dashboard-icon";

type StatsCardGridProps = {
  stats: AdminDashboardStat[];
};

const lightCardClass =
  "!border-slate-100 !bg-white !text-slate-950 shadow-sm dark:!border-slate-100 dark:!bg-white dark:!text-slate-950";

export function StatsCardGrid({ stats }: StatsCardGridProps) {
  return (
    <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4'>
      {stats.map((item) => (
        <Card
          key={item.label}
          className={`overflow-visible rounded-2xl ${lightCardClass}`}
        >
          <div className='flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6'>
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16 ${item.tone}`}
            >
              <DashboardIcon name={item.icon} />
            </div>

            <div className='min-w-0 flex-1'>
              <p className='text-sm font-semibold leading-snug text-slate-500'>
                {item.label}
              </p>

              <p className='mt-1 text-2xl font-bold tracking-tight sm:mt-2 sm:text-3xl'>
                {item.value}
              </p>

              <p className='mt-1 text-xs text-slate-500 sm:mt-2'>
                <span
                  className={
                    item.trend.startsWith("+")
                      ? "font-semibold text-emerald-600"
                      : "font-semibold text-rose-600"
                  }
                >
                  {item.trend}
                </span>{" "}
                {item.helper}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
