import type { CSSProperties, ReactNode } from "react";

type IconProps = {
  children: ReactNode;
  className?: string;
};

type Problem = {
  name: string;
  value: number;
  color: string;
};

type History = {
  date: string;
  status: string;
  score: number;
  tone: string;
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

function CameraIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.4l1.2-1.7A2 2 0 0 1 10.7 3.5h2.6a2 2 0 0 1 1.6.8L16.1 6h1.4A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function ShieldIcon() {
  return (
    <Icon className="h-6 w-6">
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

function ClockIcon() {
  return (
    <Icon className="h-6 w-6">
      <path
        d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function LockIcon() {
  return (
    <Icon className="h-6 w-6">
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function CalendarIcon() {
  return (
    <Icon className="h-5 w-5">
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

function ArrowRightIcon() {
  return (
    <Icon className="h-4 w-4">
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
}

const featureItems = [
  {
    title: "Deteksi real-time",
    description: "Analisis cepat dalam hitungan detik",
    icon: <ClockIcon />,
  },
  {
    title: "Akurat & terpercaya",
    description: "Teknologi YOLOv8 terkini",
    icon: <ShieldIcon />,
  },
  {
    title: "Privasi terjamin",
    description: "Foto tidak disimpan tanpa izin Anda",
    icon: <LockIcon />,
  },
];

const problems: Problem[] = [
  { name: "Jerawat", value: 15, color: "bg-red-500" },
  { name: "Flek Hitam", value: 8, color: "bg-amber-400" },
  { name: "Kemerahan", value: 5, color: "bg-emerald-500" },
  { name: "Pori-pori Besar", value: 12, color: "bg-yellow-500" },
  { name: "Komedo", value: 6, color: "bg-teal-500" },
];

const histories: History[] = [
  {
    date: "12 Mei 2024, 10:30 WIB",
    status: "Kulit Sehat",
    score: 82,
    tone: "text-emerald-600 bg-emerald-50",
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
];

const recommendations = [
  "Gunakan pembersih wajah 2x sehari",
  "Jangan lupa sunscreen setiap pagi",
  "Gunakan pelembap yang sesuai",
  "Minum air putih minimal 8 gelas/hari",
  "Tidur cukup 7-8 jam setiap malam",
];

export default function HomePage() {
  const scoreStyle = {
    "--score-color": "#10b981",
    "--score-angle": "295deg",
  } as CSSProperties;

  return (
    <main className="w-full px-8 py-8 sm:px-10 lg:px-12">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Selamat datang kembali, Raditya!
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Yuk, jaga kesehatan kulitmu setiap hari.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.55fr_0.95fr]">
        <section className="overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 via-white to-cyan-50 shadow-sm ring-1 ring-slate-100">
          <div className="grid min-h-[340px] gap-6 p-7 md:grid-cols-[0.85fr_1.15fr]">
            <div className="z-10 flex flex-col justify-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Cek Kesehatan Kulit Sekarang
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                Analisis kulit cepat dengan teknologi YOLO untuk hasil yang
                akurat.
              </p>

              <div className="mt-6 space-y-4">
                {featureItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-500">{item.icon}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {item.title}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/user/pemeriksaan"
                className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
              >
                <CameraIcon className="h-5 w-5" />
                Mulai Pemeriksaan
              </a>
            </div>

            <div className="relative flex min-h-[280px] items-end justify-center">
              <div className="absolute inset-x-8 top-10 h-40 rounded-[42px] border-4 border-white/90" />
                <div className="relative h-[270px] w-[230px] overflow-hidden rounded-t-[110px] bg-linear-to-b from-amber-100 to-amber-200 shadow-2xl shadow-emerald-100">
                <div className="absolute left-1/2 top-14 h-28 w-24 -translate-x-1/2 rounded-[45%] bg-[#f2c7a7]" />
                <div className="absolute left-1/2 top-9 h-20 w-32 -translate-x-1/2 rounded-t-full bg-slate-950" />
                <div className="absolute left-[88px] top-[102px] h-2 w-2 rounded-full bg-slate-900" />
                <div className="absolute right-[88px] top-[102px] h-2 w-2 rounded-full bg-slate-900" />
                <div className="absolute left-1/2 top-[130px] h-1.5 w-10 -translate-x-1/2 rounded-full bg-rose-300" />
                <div className="absolute bottom-0 h-24 w-full rounded-t-[60px] bg-white" />
              </div>
              <button
                type="button"
                aria-label="Buka kamera pemeriksaan"
                className="absolute bottom-8 grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-200 ring-8 ring-white/90 transition-colors hover:bg-emerald-700"
              >
                <CameraIcon className="h-7 w-7" />
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-5">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Skor Kesehatan Kulit</h2>
              <a
                href="/user/history"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600"
              >
                Lihat Detail <ArrowRightIcon />
              </a>
            </div>

            <div className="flex items-center gap-6">
              <div
                className="grid h-28 w-28 shrink-0 place-items-center rounded-full"
                style={{
                  background:
                    "conic-gradient(var(--score-color) var(--score-angle), #facc15 0 340deg, #e2e8f0 0)",
                  ...scoreStyle,
                }}
              >
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
                  <span className="text-2xl font-black text-slate-900">
                    82%
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-emerald-600">
                  Kulit Sehat
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Kondisi kulit Anda dalam keadaan baik.
                </p>
                <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  Skor Baik
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">
                Deteksi Masalah Kulit Terbaru
              </h2>
              <a
                href="/user/history"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600"
              >
                Lihat Semua <ArrowRightIcon />
              </a>
            </div>

            <div className="space-y-3">
              {problems.map((problem) => (
                <div
                  key={problem.name}
                  className="grid grid-cols-[120px_1fr_36px] items-center gap-3 text-sm"
                >
                  <div className="flex items-center gap-2 text-slate-600">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${problem.color}`}
                    />
                    {problem.name}
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${problem.color}`}
                      style={{ width: `${problem.value * 4}%` }}
                    />
                  </div>
                  <span className="text-right text-xs font-bold text-slate-600">
                    {problem.value}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_0.65fr_0.95fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Riwayat Terakhir</h2>
            <a
              href="/user/history"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600"
            >
              Lihat Semua <ArrowRightIcon />
            </a>
          </div>

          <div className="space-y-3">
            {histories.map((history) => (
              <div
                key={history.date}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
              >
                <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-linear-to-br from-amber-200 to-emerald-100 text-slate-700">
                  <span className="h-7 w-7 rounded-full bg-amber-100" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-500">
                    {history.date}
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {history.status}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${history.tone}`}
                >
                  {history.score}%
                </span>
                <ArrowRightIcon />
              </div>
            ))}
          </div>

          <a
            href="/user/history"
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-100"
          >
            Lihat Semua Riwayat
          </a>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-bold text-slate-900">Tips Hari Ini</p>
          <div className="mt-6 flex flex-col items-center text-center">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <ShieldIcon />
            </div>
            <h3 className="mt-5 text-base font-bold text-slate-900">
              Lindungi kulit dari sinar UV
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Gunakan sunscreen minimal SPF 30 setiap pagi, bahkan saat cuaca
              mendung.
            </p>
            <div className="mt-6 flex gap-2">
              <span className="h-2 w-5 rounded-full bg-emerald-500" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="font-bold text-slate-900">Rekomendasi Perawatan</h2>
          <div className="mt-5 space-y-4">
            {recommendations.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-0.5 text-emerald-600">
                  <CalendarIcon />
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-600">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <a
            href="/user/tips"
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-100"
          >
            Lihat Semua Tips
          </a>
        </section>
      </div>

      <section className="mt-5 flex flex-col gap-4 rounded-3xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm">
            <CalendarIcon />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">
              Jangan lupa periksa kulit secara rutin!
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Pemeriksaan rutin membantu mendeteksi masalah kulit lebih awal dan
              menjaga kulit tetap sehat.
            </p>
          </div>
        </div>
        <a
          href="/user/pemeriksaan"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
        >
          <CameraIcon className="h-5 w-5" />
          Buat Pemeriksaan Baru
        </a>
      </section>
    </main>
  );
}