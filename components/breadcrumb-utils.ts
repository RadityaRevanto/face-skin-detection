import type { BreadcrumbItem } from "@/components/ui/breadcrumb";

/**
 * Mapping nama segment path → label tampil breadcrumb.
 * Case-insensitive lookup (path di-lowercase sebelum dicocokkan).
 */
const SEGMENT_LABELS: Record<string, string> = {
  // Role
  admin: "Admin",
  doctor: "Doctor",
  user: "User",

  // Admin
  dashboard: "Dashboard",
  home: "Beranda",
  users: "Users",
  doctors: "Doctors",
  "doctor-verifications": "Verifikasi",
  pending: "Pending",
  rejected: "Ditolak",
  detail: "Detail",
  "activity-log": "Activity Logs",

  // Doctor
  consultations: "Konsultasi",
  skincare: "Skincare",
  create: "Buat Baru",
  edit: "Edit",
  recommendations: "Rekomendasi",
  "skin-concerns": "Skin Concern",
  "skin-types": "Skin Types",
  "verification-status": "Status Verifikasi",

  // User
  history: "History",
  scan: "Pemeriksaan",
  pemeriksaan: "Pemeriksaan",
  chats: "Riwayat Chat",
  subscription: "Premium",
  tips: "Tips",

  // Shared
  profile: "Profil",
  notifications: "Notifikasi",
  "login-security": "Login & Keamanan",
  privacy: "Privasi",
};

/**
 * Generate breadcrumb items dari pathname.
 *
 * Contoh:
 * - `/admin/dashboard` → [{ label: "Admin" }, { label: "Dashboard" }]
 * - `/admin/users/detail` → [{ label: "Admin" }, { label: "Users", href: "/admin/users" }, { label: "Detail" }]
 * - `/admin/doctor-verifications/pending` → [{ label: "Admin" }, { label: "Verifikasi", href: "/admin/doctor-verifications" }, { label: "Pending" }]
 */
export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Beranda", href: null }];
  }

  const items: BreadcrumbItem[] = [];
  let accumulatedPath = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    accumulatedPath += `/${segment}`;

    const label =
      SEGMENT_LABELS[segment.toLowerCase()] ||
      segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const isLast = i === segments.length - 1;

    items.push({
      label,
      href: isLast ? null : accumulatedPath,
    });
  }

  return items;
}
