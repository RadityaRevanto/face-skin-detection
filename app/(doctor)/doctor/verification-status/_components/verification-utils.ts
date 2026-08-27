export function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export function normalizeStatus(status: string | null | undefined) {
  return status?.toLowerCase().trim() || "pending";
}

export function isRevisionStatus(status: string) {
  return (
    status === "revision" ||
    status === "revision_required" ||
    status === "needs_revision"
  );
}

export function getStatusConfig(status: string | null | undefined) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "approved") {
    return {
      label: "Disetujui",
      badgeLabel: "Approved",
      title: "Akun dokter telah disetujui",
      description:
        "Verifikasi dokter Anda telah disetujui. Dashboard dokter sudah dapat digunakan.",
      cardTitle: "Akses dashboard aktif",
      cardDescription:
        "Akun Anda sudah lolos validasi admin dan dapat mengakses fitur dokter.",
      headerClass: "from-emerald-600 to-teal-600",
      badgeClass: "bg-emerald-50 text-emerald-700",
      icon: "check",
    };
  }

  if (normalizedStatus === "rejected") {
    return {
      label: "Ditolak",
      badgeLabel: "Rejected",
      title: "Verifikasi dokter ditolak",
      description:
        "Admin menolak verifikasi akun dokter Anda. Silakan periksa alasan penolakan dan hubungi admin jika diperlukan.",
      cardTitle: "Akses belum aktif",
      cardDescription:
        "Dashboard dokter belum tersedia karena verifikasi belum disetujui.",
      headerClass: "from-rose-600 to-red-600",
      badgeClass: "bg-rose-50 text-rose-700",
      icon: "x",
    };
  }

  if (isRevisionStatus(normalizedStatus)) {
    return {
      label: "Perlu Revisi",
      badgeLabel: "Revision",
      title: "Dokumen perlu diperbaiki",
      description:
        "Admin meminta revisi data atau dokumen profesi Anda sebelum verifikasi dapat dilanjutkan.",
      cardTitle: "Akses belum aktif",
      cardDescription:
        "Dashboard dokter akan tersedia setelah revisi disetujui oleh admin.",
      headerClass: "from-amber-500 to-orange-500",
      badgeClass: "bg-amber-50 text-amber-700",
      icon: "clock",
    };
  }

  return {
    label: "Menunggu Review",
    badgeLabel: "Pending",
    title: "Akun dokter sedang ditinjau",
    description:
      "Tim admin sedang memvalidasi dokumen dan data profesi Anda. Setelah disetujui, Anda dapat mengakses dashboard dokter.",
    cardTitle: "Akses belum aktif",
    cardDescription:
      "Untuk sementara Anda hanya dapat melihat halaman status ini. Dashboard dokter akan tersedia setelah admin menyetujui verifikasi.",
    headerClass: "from-emerald-600 to-teal-600",
    badgeClass: "bg-amber-50 text-amber-700",
    icon: "clock",
  };
}
