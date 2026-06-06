import type {
  PredictionHistory,
  ProblemDetail,
  ToneConfig,
} from "./history-types";

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
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
  if (severityLevel === "severe" || Number(severityScore ?? 0) >= 70) {
    return {
      badge: "text-rose-600 bg-rose-50",
      title: "text-rose-600",
      status: "Perlu Perhatian",
      description:
        "Kondisi kulit memerlukan perhatian lebih. Ikuti rekomendasi perawatan dan pertimbangkan konsultasi jika keluhan berlanjut.",
    };
  }

  if (severityLevel === "moderate" || Number(severityScore ?? 0) >= 40) {
    return {
      badge: "text-amber-600 bg-amber-50",
      title: "text-amber-600",
      status: "Kulit Cukup Baik",
      description:
        "Kondisi kulit cukup baik, namun masih terdapat beberapa area yang dapat diperbaiki melalui perawatan rutin.",
    };
  }

  return {
    badge: "text-emerald-600 bg-emerald-50",
    title: "text-emerald-600",
    status: "Kulit Relatif Baik",
    description:
      "Kondisi kulit relatif baik. Tetap lanjutkan kebiasaan perawatan dasar secara konsisten.",
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
    "bg-red-500",
    "bg-orange-400",
    "bg-emerald-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-cyan-500",
    "bg-purple-500",
  ];

  return colors[index % colors.length];
}

export function getProblemDetails(
  history: PredictionHistory | null,
): ProblemDetail[] {
  if (!history?.probabilities) {
    return [];
  }

  return Object.entries(history.probabilities)
    .map(([name, value], index) => ({
      name: mapProblemName(name),
      value: normalizeProbabilityValue(Number(value)),
      color: getProblemColor(index),
    }))
    .sort((a, b) => b.value - a.value);
}
