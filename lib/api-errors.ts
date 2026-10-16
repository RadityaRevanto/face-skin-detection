import axios from "axios";

type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: ApiErrorBody
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

export function toApiError(error: unknown): ApiError | null {
  if (axios.isAxiosError(error)) {
    const body = (error.response?.data ?? {}) as ErrorBody;
    const status = error.response?.status ?? 0;

    return new ApiError(
      status,
      body.message ||
        (error.code === "ECONNABORTED"
          ? "Request timeout. Silakan coba lagi."
          : "Koneksi jaringan terputus. Pastikan perangkat terhubung dengan internet."),
      body
    );
  }

  return null;
}

export function getFieldErrors(error: unknown): Record<string, string[]> | null {
  const apiError = toApiError(error);
  return apiError?.data?.errors ?? null;
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  const apiError = toApiError(error);

  if (apiError) {
    if (apiError.status === 404) return "Data tidak ditemukan.";
    // 422: BE hampir selalu menyertakan pesan kontekstual (validasi Laravel /
    // aturan bisnis, mis. "Transaksi ini tidak dapat dilanjutkan") — tampilkan.
    if (apiError.status === 422) return apiError.message || "Data yang dikirim tidak valid.";
    // 401: sesi bermasalah — pesan generik selalu relevan.
    if (apiError.status === 401) return "Sesi Anda telah berakhir. Silakan login kembali.";
    // 403: BE selalu menyertakan konteks (mis. "Verifikasi email terlebih
    // dahulu sebelum berlangganan.") — tampilkan apa adanya, jangan ditelan.
    if (apiError.status === 403) return apiError.message || "Anda tidak memiliki akses.";
    if (apiError.status >= 500)
      return "Terjadi gangguan pada server. Silakan coba lagi nanti.";
    return apiError.message || "Terjadi kesalahan yang tidak diketahui.";
  }

  if (error instanceof Error && error.name === "ZodError") {
    return "Terjadi ketidaksesuaian struktur data dari server.";
  }

  if (axios.isAxiosError(error) && !error.response) {
    return "Koneksi jaringan terputus. Pastikan perangkat terhubung dengan internet.";
  }

  return "Terjadi kesalahan internal. Silakan muat ulang halaman.";
}
