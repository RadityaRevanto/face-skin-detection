import { type ReactNode } from "react";
import {
  BadgeIcon,
  StethoscopeIcon,
  UserIcon,
} from "./Icons";
import { LeafLogo } from "./BrandIcons";

function DashboardMenuItem({
  title,
  active,
}: {
  title: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-zinc-500 hover:bg-zinc-50"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-emerald-500" : "bg-zinc-300"
        }`}
      />
      {title}
    </div>
  );
}

function DashboardContentCard({
  icon,
  title,
  description,
  count,
  label,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  count: string;
  label: string;
}) {
  return (
    <div className='flex items-center gap-5 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm'>
      <span className='flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700'>
        {icon}
      </span>

      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h3 className='text-sm font-bold text-zinc-900'>{title}</h3>
            <p className='mt-1 max-w-sm text-xs leading-5 text-zinc-500'>
              {description}
            </p>
          </div>

          <span className='rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700'>
            Approved
          </span>
        </div>
      </div>

      <div className='text-right'>
        <p className='text-3xl font-bold tracking-tight text-zinc-950'>
          {count}
        </p>
        <p className='text-[10px] text-zinc-500'>{label}</p>
      </div>
    </div>
  );
}

export function DoctorDashboardPreview() {
  return (
    <section className='relative hidden min-h-[720px] overflow-hidden rounded-4xl px-8 py-10 lg:block'>
      <div className='absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl' />
      <div className='absolute bottom-0 left-4 h-72 w-72 rounded-full bg-teal-100/80 blur-3xl' />

      <div className='relative'>
        <div className='mb-10 grid grid-cols-[1fr_260px] items-start gap-8'>
          <div className='pt-8'>
            <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur'>
              <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
              Doctor Dashboard
            </div>
            <h2 className='text-4xl font-bold tracking-[-0.04em] text-zinc-950 sm:text-5xl'>
              Kelola Konten Skincare dengan{" "}
              <span className='text-emerald-700'>Mudah dan Terpercaya</span>
            </h2>
            <p className='mt-4 max-w-md text-sm leading-6 text-zinc-600'>
              Kelola daftar skincare, rekomendasi, dan skin concern yang
              membantu pasien mendapatkan hasil terbaik.
            </p>
          </div>

          <div className='relative h-64'>
            <div className='absolute right-3 top-3 h-56 w-44 rounded-t-full bg-linear-to-b from-zinc-800 to-zinc-950' />
            <div className='absolute right-6 top-16 h-48 w-36 rounded-t-full bg-linear-to-b from-amber-100 to-orange-100 shadow-xl' />
            <div className='absolute right-8 top-8 h-24 w-32 rounded-t-full bg-zinc-900' />
            <div className='absolute right-24 top-28 h-2 w-4 rounded-full border-t border-zinc-700' />
            <div className='absolute right-12 top-28 h-2 w-4 rounded-full border-t border-zinc-700' />
            <div className='absolute bottom-0 right-0 h-24 w-56 rounded-t-4xl bg-white shadow-xl' />
            <div className='absolute bottom-14 right-20 h-14 w-16 rounded-xl bg-zinc-200' />
            <div className='absolute -right-4 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg'>
              <BadgeIcon />
            </div>
          </div>
        </div>

        <div className='rounded-4xl border border-white/80 bg-white/85 p-5 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl'>
          <div className='grid gap-5 lg:grid-cols-[150px_1fr]'>
            <aside className='border-r border-zinc-100 pr-4'>
              <div className='mb-6 flex items-center gap-3'>
                <LeafLogo />
                <span>
                  <span className='block text-sm font-bold'>
                    Skincek
                  </span>
                  <span className='block text-[11px] text-emerald-600'>
                    Doctor Portal
                  </span>
                </span>
              </div>

              <div className='space-y-1'>
                <DashboardMenuItem title='Dashboard' active />
                <DashboardMenuItem title='Skincare' />
                <DashboardMenuItem title='Rekomendasi' />
                <DashboardMenuItem title='Skin Concern' />
                <DashboardMenuItem title='Profile' />
                <DashboardMenuItem title='Pengaturan' />
              </div>
            </aside>

            <div>
              <div className='mb-5 flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-bold text-zinc-950'>
                    Selamat datang kembali, Dokter
                  </h3>
                  <p className='mt-1 text-xs text-zinc-500'>
                    Kelola konten skincare yang aman, efektif, dan berbasis
                    data.
                  </p>
                </div>

                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700'>
                  <UserIcon />
                </div>
              </div>

              <div className='space-y-4'>
                <DashboardContentCard
                  icon={<BadgeIcon />}
                  title='Kelola Daftar Skincare'
                  description='Tambah, edit, hapus, dan kelola produk skincare yang telah disetujui sistem.'
                  count='128'
                  label='Produk Aktif'
                />

                <DashboardContentCard
                  icon={<StethoscopeIcon />}
                  title='Kelola Rekomendasi Skincare'
                  description='Buat dan kelola rekomendasi skincare berdasarkan kondisi kulit dan kebutuhan pasien.'
                  count='56'
                  label='Rekomendasi Aktif'
                />

                <DashboardContentCard
                  icon={<UserIcon />}
                  title='Kelola Skin Concern'
                  description='Kelola daftar skin concern seperti jerawat, flek hitam, kerutan, kemerahan, dan lainnya.'
                  count='24'
                  label='Concern Aktif'
                />
              </div>

              <div className='mt-5 flex items-center gap-4 rounded-2xl bg-zinc-50 p-4 text-xs leading-5 text-zinc-600'>
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700'>
                  <BadgeIcon />
                </span>
                Semua konten yang Anda kelola harus sesuai dengan kebijakan
                dan telah disetujui sistem untuk memastikan keamanan dan
                kualitas bagi pasien.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
