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

export async function getConversations(page: number = 1) {
  const res = await fetch(`/api/conversations?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengambil daftar obrolan");
  }

  return res.json();
}

export async function createConversation(doctorId: string) {
  const res = await fetch(`/api/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doctor_id: doctorId }),
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal membuat ruang obrolan");
  }

  return res.json();
}

export async function getMessages(conversationId: string, page: number = 1) {
  const res = await fetch(`/api/conversations/${conversationId}/messages?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengambil pesan");
  }

  return res.json();
}

export async function sendMessage(conversationId: string, payload: FormData | { content?: string, prediction_history_id?: string }) {
  const isFormData = payload && typeof (payload as any).append === 'function';
  
  const options: RequestInit = {
    method: "POST",
    body: isFormData ? (payload as FormData) : JSON.stringify(payload),
  };

  if (!isFormData) {
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  const res = await fetch(`/api/conversations/${conversationId}/messages`, options);

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengirim pesan");
  }

  return res.json();
}

export async function getDoctors(page: number = 1) {
  const res = await fetch(`/api/doctors?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengambil daftar dokter");
  }

  return res.json();
}

export async function rateDoctor(doctorId: string, rating: number, review?: string) {
  const res = await fetch(`/api/doctors/${doctorId}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rating, review }),
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengirim ulasan dokter");
  }

  return res.json();
}

export async function getDoctorRatings(doctorId: string, page: number = 1) {
  const res = await fetch(`/api/doctors/${doctorId}/ratings?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengambil daftar ulasan dokter");
  }

  return res.json();
}
