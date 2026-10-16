import type { Conversation, Message } from "@/lib/api/consultations-query";

export type DoctorConsultationFilter = "all" | "unread" | "done";

export type DoctorConsultationKpi = {
  total: number;
  unread: number;
  done: number;
};

export type { Conversation, Message };
