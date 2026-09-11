import { Skeleton } from "@/components/ui/skeleton";

// Re-export agar consumer cukup import dari satu tempat.
export { Skeleton };

/**
 * Koleksi skeleton shape-matched — SETIAP skeleton di sini meniru layout
 * komponen data aslinya (bukan blok generik), sehingga saat data selesai
 * dimuat tidak ada "lompatan" layout.
 */

// ─── StatCard (admin dashboard — gradient stat card) ───────────────────────

export function StatCardSkeleton() {
  return (
    <div className="rounded-3xl bg-slate-100/80 p-5">
      <Skeleton className="h-6 w-6 rounded-lg bg-slate-200" />
      <Skeleton className="mt-4 h-8 w-20 rounded-lg" />
      <Skeleton className="mt-2 h-3 w-28 rounded" />
    </div>
  );
}

export function StatGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </section>
  );
}

// ─── HistoryCard (user/history) ─────────────────────────────────────────────

export function HistoryCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white">
      {/* Area gambar aspect-[4/3] — sama dengan kartu asli */}
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        <Skeleton className="absolute left-3 top-3 h-5 w-24 rounded-full" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="mt-2 h-4 w-40 rounded" />
        <div className="mt-3 flex items-center gap-3">
          <Skeleton className="h-1.5 flex-1 rounded-full" />
          <Skeleton className="h-4 w-9 rounded" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="mt-3 flex gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function HistoryListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <HistoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── DoctorCard (user/consultations — daftar dokter) ────────────────────────

export function DoctorCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
      <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5 rounded" />
        <Skeleton className="h-3 w-2/5 rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
      <Skeleton className="h-5 w-5 shrink-0 rounded" />
    </div>
  );
}

export function DoctorListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <DoctorCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Admin dashboard (stat grid + queue/donut + timeline/summary) ───────────

function QueueCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      <Skeleton className="h-4 w-36 rounded" />
      <Skeleton className="mt-2 h-3 w-56 rounded" />
      <div className="mt-5 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-1/2 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6">
      <Skeleton className="h-4 w-40 rounded" />
      <Skeleton className="mt-2 h-3 w-52 rounded" />
      <div className="mt-5 flex items-center justify-center gap-6">
        <Skeleton className="h-36 w-36 rounded-full" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      <Skeleton className="h-4 w-32 rounded" />
      <div className="mt-5 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-3 w-3 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-2/3 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-56 rounded" />
        <Skeleton className="h-4 w-80 rounded" />
      </div>
      {/* 8 stat cards */}
      <StatGridSkeleton />
      <div className="hidden gap-3 sm:gap-4 lg:grid lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      {/* Queue + Donut */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QueueCardSkeleton />
        </div>
        <DonutCardSkeleton />
      </div>
      {/* Timeline + Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TimelineCardSkeleton />
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="mt-4 h-9 w-40 rounded-lg" />
          <Skeleton className="mt-2 h-3 w-32 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Profile page (user & doctor profile) ───────────────────────────────────

export function ProfilePageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-8 w-64 rounded" />
      <Skeleton className="mt-2 h-4 w-80 rounded" />
      <div className="mt-8 flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
        {/* Sidebar nav */}
        <div className="hidden w-full max-w-64 shrink-0 space-y-1.5 lg:block">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-11 w-full rounded-xl" />
          ))}
        </div>
        {/* Form card */}
        <div className="w-full flex-1 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
          <div className="flex flex-col items-start gap-8 sm:flex-row">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
            {/* Fields */}
            <div className="w-full flex-1 space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3.5 w-28 rounded" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
              <Skeleton className="h-11 w-36 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Subscription page ───────────────────────────────────────────────────────

export function SubscriptionCardSkeleton() {
  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Header harga */}
      <div className="rounded-3xl bg-slate-100/80 p-8 text-center">
        <Skeleton className="mx-auto h-16 w-16 rounded-2xl" />
        <Skeleton className="mx-auto mt-4 h-6 w-40 rounded" />
        <Skeleton className="mx-auto mt-2 h-4 w-56 rounded" />
        <Skeleton className="mx-auto mt-5 h-10 w-48 rounded" />
      </div>
      {/* Main card dengan benefit grid */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
        <Skeleton className="mx-auto h-3 w-36 rounded" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="mt-8 h-12 w-full rounded-xl" />
        <Skeleton className="mx-auto mt-3 h-3 w-56 rounded" />
      </div>
    </div>
  );
}

// ─── Table rows (admin users / doctors / verifications) ─────────────────────

export function TableRowsSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-100 bg-white">
      {/* Header row */}
      <div className="flex gap-4 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1 rounded" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4 border-b border-slate-50 px-4 py-4 last:border-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-9 flex-1 rounded-lg ${c === 0 ? "max-w-12" : ""}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Conversation item (user/chats — daftar percakapan) ─────────────────────

export function ConversationItemSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-zinc-50 p-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-28 rounded" />
          <Skeleton className="h-2.5 w-9 rounded" />
        </div>
        <Skeleton className="mt-2 h-3 w-3/5 rounded" />
      </div>
    </div>
  );
}

export function ConversationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <ConversationItemSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Chat messages (bubble kiri/kanan selang-seling) ────────────────────────

export function ChatMessagesSkeleton() {
  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6">
      {/* Pasangan bubble: lawan (kiri) & sendiri (kanan) */}
      {[0, 1].map((pair) => (
        <div key={pair} className="space-y-3">
          {/* Bubble lawan — kiri */}
          <div className="flex justify-start">
            <div className="max-w-[65%] space-y-1.5 rounded-lg rounded-tl-none bg-white p-3 shadow-sm">
              <Skeleton className="h-3 w-44 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
          </div>
          {/* Bubble sendiri — kanan */}
          <div className="flex justify-end">
            <div className="max-w-[65%] space-y-1.5 rounded-lg rounded-tr-none bg-slate-200/70 p-3">
              <Skeleton className="h-3 w-36 rounded" />
              <Skeleton className="h-3 w-40 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb + judul */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-8 w-72 rounded" />
      </div>
      {/* Konten 2 kolom: kartu utama + kartu aksi */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/2 rounded" />
              <Skeleton className="h-3.5 w-1/3 rounded" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between gap-6 border-b border-slate-50 py-2.5">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-6">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="mt-4 h-11 w-full rounded-xl" />
          <Skeleton className="mt-3 h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
