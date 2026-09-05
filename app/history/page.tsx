import { redirect } from "next/navigation";

// Redirect stub — riwayat pemeriksaan kini berada di /user/history
// (bookmark & link lama /history tetap berfungsi).
export default function LegacyHistoryPage() {
  redirect("/user/history");
}
