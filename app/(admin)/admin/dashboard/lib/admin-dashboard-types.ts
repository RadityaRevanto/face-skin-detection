export type AdminDashboardStat = {
  label: string;
  value: string;
  trend: string;
  helper: string;
  tone: string;
  icon: string;
};

export type LatestUser = {
  name: string;
  email: string;
  role: string;
  join: string;
};

export type VerifiedDoctor = {
  name: string;
  email: string;
  specialization: string;
  verifiedAt: string;
};

export type UserRoleSummary = {
  label: string;
  value: string;
  tone: string;
};

export type VerificationRequest = {
  id: string;
  name: string;
  email: string;
  identity: string;
  submittedAt: string;
  status: string;
};

export type AdminDashboardData = {
  stats: AdminDashboardStat[];
  latestUsers: LatestUser[];
  verifiedDoctors: VerifiedDoctor[];
  userRoleSummary: UserRoleSummary[];
  verificationRequests: VerificationRequest[];
};
