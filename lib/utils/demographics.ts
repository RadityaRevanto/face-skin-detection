export function formatGender(gender: string | null | undefined): string {
  if (!gender) return "-";
  if (gender === "laki_laki") return "Laki-laki";
  if (gender === "perempuan") return "Perempuan";
  if (gender === "unisex") return "Unisex";
  return gender;
}
