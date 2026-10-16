import Link from "next/link";
import { FlaskConical, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export function SkinTypesEducationalCard() {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-xs border border-border/50 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center shrink-0">
          <FlaskConical className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-caption font-bold text-ink">
            Pedoman Klinis Klasifikasi Baumann &amp; Fitzpatrick
          </span>
          <p className="font-body-default text-body-default text-ink-muted mt-1 max-w-3xl leading-relaxed">
            Setiap pembaruan definisi karakteristik akan langsung mempengaruhi skor kecocokan formula pada algoritma{" "}
            <strong className="text-ink font-semibold">Aturan Rekomendasi Skincare</strong>. Pastikan batasan klinis sesuai standar dermatovenerologi nasional.
          </p>
        </div>
      </div>

      <Link
        href={ROUTES.DOCTOR.RECOMMENDATIONS}
        className="shrink-0 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-role-accent-doctor font-headline-sm text-caption font-semibold transition-all inline-flex items-center gap-1.5 border border-border/30 cursor-pointer"
      >
        <span>Lihat Aturan Terkait</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
