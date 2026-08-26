// Pemetaan label ML (bahasa Inggris) ke istilah Indonesia untuk UI.
// Label mentah mengikuti kolom ml_label pada tabel skin_concerns backend:
// Redness, dark spots, inflammatory acne, non inflammatory acne black heads,
// non inflammatory acne white heads, pigmentation, pores, wrinkles.
export function translateSkinLabel(rawLabel: string): string {
  // Normalisasi tanda hubung agar varian nama (mis. "Non-Inflammatory Acne")
  // tetap cocok dengan label mentah model.
  const normalized = (rawLabel ?? "").toLowerCase().replace(/-/g, " ");

  // Cek yang lebih spesifik lebih dulu — otherwise "non inflammatory acne"
  // juga cocok dengan pencocokan "inflammatory acne" dan menyusut menjadi satu.
  if (normalized.includes("non inflammatory acne")) return "Komedo";
  if (normalized.includes("inflammatory acne")) return "Jerawat";
  if (normalized.includes("dark spots")) return "Flek Hitam";
  if (normalized.includes("redness")) return "Kemerahan";
  if (normalized.includes("pores")) return "Pori-pori Besar";
  if (normalized.includes("pigmentation")) return "Pigmentasi";
  if (normalized.includes("wrinkles")) return "Kerutan";

  return rawLabel;
}

// Nama tampilan prioritas: skin_concern.name dari backend sudah Indonesia.
export function getConcernDisplayName(
  concernName: string | null | undefined,
  fallbackLabel: string,
): string {
  if (concernName && concernName.trim() !== "") {
    return concernName;
  }

  return translateSkinLabel(fallbackLabel);
}
