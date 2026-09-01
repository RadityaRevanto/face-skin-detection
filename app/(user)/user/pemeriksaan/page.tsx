import { redirect } from "next/navigation";

// Redirect stub — halaman scan final berada di /user/scan.
export default function PemeriksaanPage() {
  redirect("/user/scan");
}
