export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 404) return "Data tidak ditemukan.";
    if (error.status === 422) return "Data yang dikirim tidak valid.";
    if (error.status === 401 || error.status === 403) return "Anda tidak memiliki akses.";
    if (error.status >= 500) return "Terjadi gangguan pada server. Silakan coba lagi nanti.";
    return error.message || "Terjadi kesalahan yang tidak diketahui.";
  }
  
  if (error instanceof Error && error.name === "ZodError") {
    return "Terjadi ketidaksesuaian struktur data dari server.";
  }
  
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return "Koneksi jaringan terputus. Pastikan perangkat terhubung dengan internet.";
  }

  return "Terjadi kesalahan internal. Silakan muat ulang halaman.";
}
