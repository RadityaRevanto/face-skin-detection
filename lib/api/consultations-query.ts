import { api } from "@/lib/api";

export type ChatUser = {
  uuid: string;
  full_name: string;
  email?: string;
  role: string;
  avatar_url?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  age?: number | null;
  is_active?: boolean;
};

export type Message = {
  uuid: string;
  sender: {
    uuid: string;
    full_name: string;
    role: string;
  };
  content: string | null;
  type: "text" | "image" | "video" | "scan_result";
  media_url?: string | null;
  created_at: string;
};

export type Conversation = {
  uuid: string;
  user: ChatUser;
  doctor: ChatUser;
  message_count: number;
  last_message?: Message | null;
  created_at: string;
  updated_at: string;
};

// Error dengan status HTTP agar UI bisa memberi CTA spesifik
// (mis. 402 kuota chat habis → arahkan ke halaman langganan).
export class ConsultationApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ConsultationApiError";
  }
}

function toConsultationError(error: unknown, fallback: string): ConsultationApiError {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosLike = error as {
      response?: { status: number; data?: { message?: string } };
    };
    if (axiosLike.response) {
      return new ConsultationApiError(
        axiosLike.response.status,
        axiosLike.response.data?.message || fallback,
      );
    }
  }
  return new ConsultationApiError(0, fallback);
}

function guard<T>(promise: Promise<T>, fallback: string): Promise<T> {
  return promise.catch((error) => {
    throw toConsultationError(error, fallback);
  });
}

export async function getConversations(page: number = 1) {
  return guard(
    api.get(`/conversations?page=${page}`).then((r) => r.data),
    "Gagal mengambil daftar obrolan",
  );
}

export async function createConversation(doctorId: string) {
  return guard(
    api.post("/conversations", { doctor_id: doctorId }).then((r) => r.data),
    "Gagal membuat ruang obrolan",
  );
}

// Mulai/ambil percakapan dengan bot "Aura Skin" (butuh consent AI).
export async function startAiConversation() {
  return guard(
    api.post("/ai-chat/conversations").then((r) => r.data),
    "Gagal memulai chat dengan Aura Skin",
  );
}

export async function deleteAiConversation(conversationUuid: string) {
  return guard(
    api.delete(`/ai-chat/conversations/${conversationUuid}`).then((r) => r.data),
    "Gagal menghapus riwayat chat AI",
  );
}

export async function getMessages(conversationId: string, page: number = 1) {
  return guard(
    api.get(`/conversations/${conversationId}/messages?page=${page}`).then((r) => r.data),
    "Gagal mengambil pesan",
  );
}

export async function sendMessage(
  conversationId: string,
  payload: FormData | { content?: string; prediction_history_id?: string },
) {
  return guard(
    api.post(`/conversations/${conversationId}/messages`, payload).then((r) => r.data),
    "Gagal mengirim pesan",
  );
}

export async function getDoctors(page: number = 1) {
  return guard(
    api.get(`/doctors?page=${page}`).then((r) => r.data),
    "Gagal mengambil daftar dokter",
  );
}

export async function rateDoctor(doctorId: string, rating: number, review?: string) {
  return guard(
    api
      .post(`/doctors/${doctorId}/ratings`, { rating, review })
      .then((r) => r.data),
    "Gagal mengirim ulasan dokter",
  );
}

export async function getDoctorRatings(doctorId: string, page: number = 1) {
  return guard(
    api.get(`/doctors/${doctorId}/ratings?page=${page}`).then((r) => r.data),
    "Gagal mengambil daftar ulasan dokter",
  );
}
