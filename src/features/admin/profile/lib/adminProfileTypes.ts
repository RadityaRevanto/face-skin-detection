export type AdminProfileData = {
  uuid: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  email_verified: boolean;
  account_created_at: string | null;

  last_login: {
    at: string | null;
    ip_address: string | null;
    user_agent: string | null;
  };
  active_sessions: number;

  summary: {
    total_users: number;
    total_doctors: number;
    pending_doctor_verifications: number;
  };
};
