export type DashboardCharts = {
  scans_last_14_days: Array<{ date: string; count: number }>;
  registrations_last_14_days: Array<{ date: string; count: number }>;
};

export type RecentVerification = {
  uuid: string;
  str_number: string | null;
  specialization: string | null;
  verification_status: string | null;
  reviewed_at: string | null;
  created_at: string | null;
  doctor: {
    uuid: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
  documents: Array<{
    uuid: string;
    url: string;
    file_name: string | null;
  }>;
};

export type AdminDashboardData = {
  stats: {
    total_users: number;
    total_doctors: number;
    new_users_this_week: number;
    total_scans: number;
    scans_today: number;
    active_pro_subscriptions: number;
    monthly_revenue: number;
  };
  pending_actions: {
    doctor_verifications: number;
  };
  charts: DashboardCharts;
  recent_verifications: RecentVerification[];
};
