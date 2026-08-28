import { translateSkinLabel } from "@/lib/utils/skin-labels";
import type {
  PredictionHistory,
  SeverityLevel,
  SkinProblem,
  ToneConfig,
} from "../types";

// Nilai severity_level dari backend: "low" | "medium" | "high".
// Sinonim lama tetap diterima agar aman terhadap data lama.
export function normalizeSeverityLevel(
  level: string | null | undefined,
): SeverityLevel {
  const value = (level ?? "").toLowerCase();

  if (value === "high" || value === "severe") {
    return "high";
  }

  if (value === "medium" || value === "moderate") {
    return "medium";
  }

  return "low";
}

export function getSeverityLabel(level: string | null | undefined) {
  const normalized = normalizeSeverityLevel(level);

  if (normalized === "high") {
    return "Tinggi";
  }

  if (normalized === "medium") {
    return "Sedang";
  }

  return "Rendah";
}

export function getSeverityBadgeClass(level: string | null | undefined) {
  const normalized = normalizeSeverityLevel(level);

  if (normalized === "high") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  if (normalized === "medium") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

export function getConfidencePercent(
  confidence: number | string | null | undefined,
) {
  const value = Number(confidence ?? 0);

  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.round(value * 100);
}

export function getToneBySeverity(
  severityLevel: PredictionHistory["severity_level"],
  severityScore: number | null,
): ToneConfig {
  // severity_score dari backend berada pada skala integer 0–100.
  if (severityLevel === "high" || Number(severityScore ?? 0) >= 70) {
    return {
      title: "Perlu Perhatian",
      label: "Skor Tinggi",
      description:
        "Kondisi kulit memerlukan perhatian lebih. Ikuti rekomendasi perawatan dan pertimbangkan konsultasi jika keluhan berlanjut.",
      titleClassName: "text-rose-600",
      badgeClassName: "bg-rose-50 text-rose-700",
    };
  }

  if (severityLevel === "medium" || Number(severityScore ?? 0) >= 40) {
    return {
      title: "Kulit Cukup Baik",
      label: "Skor Sedang",
      description:
        "Kondisi kulit cukup baik, namun masih terdapat beberapa area yang dapat diperbaiki melalui perawatan rutin.",
      titleClassName: "text-amber-600",
      badgeClassName: "bg-amber-50 text-amber-700",
    };
  }

  return {
    title: "Kulit Relatif Baik",
    label: "Skor Kesehatan",
    description:
      "Kondisi kulit relatif baik. Tetap lanjutkan kebiasaan perawatan dasar secara konsisten.",
    titleClassName: "text-emerald-600",
    badgeClassName: "bg-emerald-50 text-emerald-700",
  };
}

function normalizeProbabilityValue(value: number) {
  if (value <= 1) {
    return Math.round(value * 100);
  }

  return Math.round(value);
}

function mapProblemName(name: string) {
  return translateSkinLabel(name);
}

function getProblemColor(index: number) {
  const colors = [
    "bg-orange-500",
    "bg-yellow-400",
    "bg-emerald-500",
    "bg-orange-400",
    "bg-green-500",
    "bg-cyan-500",
    "bg-purple-500",
  ];

  return colors[index % colors.length];
}

export function getSkinProblemsFromPrediction(
  prediction: PredictionHistory | null,
): SkinProblem[] {
  if (!prediction?.probabilities) {
    return [];
  }

  // Several raw classes map to the same display name (e.g. blackheads and
  // whiteheads both become "Komedo"), so aggregate their probabilities to
  // avoid duplicate entries — and therefore duplicate React keys.
  const aggregated = new Map<string, number>();

  for (const [name, value] of Object.entries(prediction.probabilities)) {
    const displayName = mapProblemName(name);
    aggregated.set(displayName, (aggregated.get(displayName) ?? 0) + Number(value));
  }

  return Array.from(aggregated.entries())
    .map(([name, value], index) => ({
      name,
      value: normalizeProbabilityValue(value),
      color: getProblemColor(index),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}
