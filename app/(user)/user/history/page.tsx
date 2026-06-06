import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "History | Face Skin Detection",
  description: "Riwayat prediksi kondisi kulit Anda",
};

type IconProps = {
  children: ReactNode;
  className?: string;
};

function Icon({ children, className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {children}
    </svg>
  );
}

function CalendarIcon() {
  return (
    <Icon className="h-4 w-4">
      <path
        d="M7 3v3m10-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function DocumentIcon() {
  return (
    <Icon className="h-5 w-5">
      <path
        d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14 3v5h5M8.5 13h7M8.5 17h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function ShieldIcon() {
  return (
    <Icon className="h-5 w-5">
      <path
        d="M12 3 5 6v5.3c0 4.4 2.9 8.4 7 9.7 4.1-1.3 7-5.3 7-9.7V6l-7-3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function BulbIcon() {
  return (
    <Icon className="h-5 w-5">
      <path
        d="M9 18h6m-5 3h4m2.5-10.5A4.5 4.5 0 0 0 7.7 12c.5 1.2 1.4 2 2.1 2.9.5.6.7 1.2.7 2.1h3c0-.9.2-1.5.7-2.1.7-.9 1.6-1.7 2.1-2.9.2-.5.2-1 .2-1.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function InfoIcon() {
  return (
    <Icon className="h-5 w-5">
      <path
        d="M12 17v-6m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function ChevronDownIcon() {
  return (
    <Icon className="h-4 w-4">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
}

const histories = [
  {
    date: "12 Mei 2024, 10:30 WIB",
    status: "Kulit Sehat",
    score: 82,
    tone: "text-emerald-600 bg-emerald-50",
    active: true,
  },
  {
    date: "28 Apr 2024, 09:15 WIB",
    status: "Kulit Cukup Baik",
    score: 65,
    tone: "text-amber-600 bg-amber-50",
  },
  {
    date: "15 Apr 2024, 08:45 WIB",
    status: "Perlu Perhatian",
    score: 48,
    tone: "text-rose-600 bg-rose-50",
  },
  {
    date: "2 Apr 2024, 11:20 WIB",
    status: "Kulit Cukup Baik",
    score: 60,
    tone: "text-amber-600 bg-amber-50",
  },
  {
    date: "20 Mar 2024, 07:50 WIB",
    status: "Perlu Perhatian",
    score: 42,
    tone: "text-rose-600 bg-rose-50",
  },
];

const problemDetails = [
  { name: "Jerawat", value: 15, color: "bg-red-500" },
  { name: "Flek Hitam", value: 8, color: "bg-orange-400" },
  { name: "Kemerahan", value: 5, color: "bg-emerald-500" },
  { name: "Pori-pori Besar", value: 12, color: "bg-yellow-500" },
  { name: "Komedo", value: 6, color: "bg-green-500" },
];

const recommendations = [
  "Gunakan pembersih wajah 2x sehari",
  "Jangan lupa sunscreen setiap pagi",
  "Gunakan pelembab yang sesuai",
  "Minum air putih minimal 8 gelas/hari",
];

export default function HistoryPage() {
  return (
    <main className="grid min-h-[calc(100vh-72px)] w-full gap-6 px-8 py-8 sm:px-10 lg:grid-cols-[360px_1fr] lg:px-12">
      <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Riwayat Pemeriksaan
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Lihat hasil pemeriksaan kulit Anda sebelumnya.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600">
            <span className="flex items-center">Semua Status</span>
            <span className="grid h-4 w-4 place-items-center text-slate-400">
              <ChevronDownIcon />
            </span>
          </button>
          <button className="flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600">
            <span className="inline-flex items-center gap-2">
              <CalendarIcon />
              Terbaru
            </span>
            <span className="grid h-4 w-4 place-items-center text-slate-400">
              <ChevronDownIcon />
            </span>
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {histories.map((item) => (
            <article
              key={item.date}
              className={[
                "flex gap-4 rounded-2xl border bg-white p-4 transition-colors",
                item.active
                  ? "border-emerald-300 ring-2 ring-emerald-100"
                  : "border-slate-100 hover:border-emerald-200",
              ].join(" ")}
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-amber-200 to-emerald-100">
                <div className="absolute left-1/2 top-3 h-9 w-9 -translate-x-1/2 rounded-full bg-amber-100" />
                <div className="absolute bottom-0 left-1/2 h-12 w-14 -translate-x-1/2 rounded-t-full bg-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-xs font-semibold text-slate-500">
                    {item.date}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold   ${item.tone}`}
                  >
                    {item.score}%
                  </span>
                </div>
                <h2 className={`mt-2 font-bold   ${item.tone.split(" ")[0]}`}>
                  {item.status}
                </h2>
                <button className="mt-3 text-sm font-bold text-emerald-700">
                  Lihat Detail ›
                </button>
              </div>
            </article>
          ))}
        </div>

        <button className="mt-5 h-12 w-full rounded-2xl bg-slate-50 text-sm font-bold text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700">
          Muat Lebih Banyak
          <span className="ml-2 inline-grid h-4 w-4 place-items-center align-middle">
            <ChevronDownIcon />
          </span>
        </button>
      </aside>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              12 Mei 2024, 10:30 WIB
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Hasil Pemeriksaan
              </h2>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold  text-emerald-700">
                Kulit Sehat
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Kondisi kulit Anda dalam keadaan baik.
            </p>
          </div>

          <button className="inline-flex h-12 w-fit items-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition-colors hover:bg-emerald-50">
            <DocumentIcon />
            Unduh Laporan
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-bold   text-slate-900">
                Foto Analisis
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Hasil deteksi menggunakan teknologi YOLO
              </p>

              <div className="relative mt-5 min-h-[420px] overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 via-white to-cyan-50">
                <div className="absolute bottom-0 left-1/2 h-[410px] w-[330px] -translate-x-1/2">
                  <div className="absolute left-1/2 top-5 h-36 w-52 -translate-x-1/2 rounded-t-full bg-slate-950" />
                  <div className="absolute left-1/2 top-[70px] h-[210px] w-[180px] -translate-x-1/2 rounded-[46%] bg-[#efc09d]" />
                  <div className="absolute left-[115px] top-[160px] h-2.5 w-2.5 rounded-full bg-slate-900" />
                  <div className="absolute right-[115px] top-[160px] h-2.5 w-2.5 rounded-full bg-slate-900" />
                  <div className="absolute left-1/2 top-[200px] h-2.5 w-10 -translate-x-1/2 rounded-full bg-rose-300" />
                  <div className="absolute bottom-0 left-1/2 h-28 w-[310px] -translate-x-1/2 rounded-t-[100px] bg-white" />
                </div>

                <span className="absolute left-[12%] top-[25%] rounded-lg bg-yellow-50 px-3 py-2 text-xs font-bold   text-yellow-700 shadow">
                  Flek Hitam
                  <br />
                  8%
                </span>
                <span className="absolute left-[16%] top-[55%] rounded-lg bg-yellow-50 px-3 py-2 text-xs font-bold   text-yellow-700 shadow">
                  Pori-pori Besar
                  <br />
                  12%
                </span>
                <span className="absolute right-[18%] top-[18%] rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold   text-emerald-700 shadow">
                  Kemerahan
                  <br />
                  5%
                </span>
                <span className="absolute right-[16%] top-[43%] rounded-lg bg-red-50 px-3 py-2 text-xs font-bold   text-red-700 shadow">
                  Jerawat
                  <br />
                  15%
                </span>
                <span className="absolute right-[22%] top-[62%] rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold   text-emerald-700 shadow">
                  Komedo
                  <br />
                  6%
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-emerald-600">
                    <ShieldIcon />
                  </span>
                  <div>
                    <p className="text-sm font-bold  text-slate-900">
                      Teknologi: YOLOv8
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      Analisis real-time dengan akurasi tinggi
                    </p>
                  </div>
                </div>
                <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold  text-emerald-700">
                  Analisis Berhasil
                </span>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-bold   text-slate-900">
                Informasi Pemeriksaan
              </h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-6">
                  <span className="font-semibold text-slate-500">
                    Tanggal & Waktu
                  </span>
                  <span className="font-bold text-slate-800">
                    12 Mei 2024, 10:30 WIB
                  </span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="font-semibold text-slate-500">
                    Jenis Analisis
                  </span>
                  <span className="font-bold text-slate-800">
                    Analisis Kulit Wajah
                  </span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="font-semibold text-slate-500">Metode</span>
                  <span className="font-bold text-slate-800">
                    YOLOv8 - Real-time Detection
                  </span>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-bold   text-slate-900">
                Ringkasan Kondisi Kulit
              </h2>
              <div className="mt-6 flex items-center gap-7">
                <div className="grid h-32 w-32 shrink-0 place-items-center rounded-full bg-[conic-gradient(#10b981_0_295deg,#facc15_295deg_340deg,#e2e8f0_340deg)]">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-white">
                    <span className="text-3xl font-bold  text-slate-900">
                      82%
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold  text-emerald-600">
                    Kulit Sehat
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Kondisi kulit Anda dalam keadaan baik.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                    <ShieldIcon />
                    Skor Kesehatan
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-bold   text-slate-900">
                Detail Deteksi Masalah
              </h2>
              <div className="mt-6 space-y-4">
                {problemDetails.map((problem) => (
                  <div
                    key={problem.name}
                    className="grid grid-cols-[130px_1fr_36px] items-center gap-3"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${problem.color}`}
                      />
                      {problem.name}
                    </span>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${problem.color}`}
                        style={{ width: `${problem.value * 4}%` }}
                      />
                    </div>
                    <span className="text-right text-sm font-bold text-slate-700">
                      {problem.value}%
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
              <div className="mb-5 flex items-center gap-3">
                <div className="text-amber-500">
                  <BulbIcon />
                </div>
                <h2 className="text-lg font-bold   text-slate-900">
                  Rekomendasi Perawatan
                </h2>
              </div>
              <div className="space-y-5">
                {recommendations.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-400">
                      <CalendarIcon />
                    </div>
                    <p className="text-sm font-semibold leading-6 text-slate-500">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="flex gap-3 rounded-3xl bg-emerald-50 p-5 text-emerald-900 ring-1 ring-emerald-100">
          <div className="mt-0.5 text-emerald-600">
            <InfoIcon />
          </div>
          <div>
            <h2 className="font-bold  ">Catatan</h2>
            <p className="mt-1 text-sm leading-6 text-emerald-800">
              Hasil analisis ini bersifat informatif dan bukan merupakan
              diagnosis medis. Jika Anda memiliki keluhan kulit yang persisten,
              konsultasikan dengan dokter kulit.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}