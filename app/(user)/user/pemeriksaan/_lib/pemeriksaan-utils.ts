import type {
  PredictionHistory,
  SkinProblem,
  ToneConfig,
} from "./pemeriksaan-types";

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
  if (severityLevel === "severe" || Number(severityScore ?? 0) >= 70) {
    return {
      title: "Perlu Perhatian",
      label: "Skor Tinggi",
      description:
        "Kondisi kulit memerlukan perhatian lebih. Ikuti rekomendasi perawatan dan pertimbangkan konsultasi jika keluhan berlanjut.",
      titleClassName: "text-rose-600",
      badgeClassName: "bg-rose-50 text-rose-700",
    };
  }

  if (severityLevel === "moderate" || Number(severityScore ?? 0) >= 40) {
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
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("inflammatory acne")) return "Jerawat";
  if (normalizedName.includes("non-inflammatory acne")) return "Komedo";
  if (normalizedName.includes("dark spots")) return "Flek Hitam";
  if (normalizedName.includes("redness")) return "Kemerahan";
  if (normalizedName.includes("pores")) return "Pori-pori Besar";
  if (normalizedName.includes("pigmentation")) return "Pigmentasi";
  if (normalizedName.includes("wrinkles")) return "Kerutan";

  return name;
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

  return Object.entries(prediction.probabilities)
    .map(([name, value], index) => ({
      name: mapProblemName(name),
      value: normalizeProbabilityValue(Number(value)),
      color: getProblemColor(index),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}
