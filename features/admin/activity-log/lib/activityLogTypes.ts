export type ActivityLogCauser = {
  uuid?: string;
  full_name?: string | null;
  email?: string | null;
  role?: string | null;
};

export type ActivityLogPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ActivityLogItemData = {
  id: string | number;
  log_name: string;
  description: string;
  event?: string;
  subject_type?: string | null;
  subject_id?: string | number | null;
  subject_name?: string | null;
  causer?: ActivityLogCauser | null;
  properties?: {
    old?: Record<string, unknown>;
    attributes?: Record<string, unknown>;
    ip?: string;
    user_agent?: string;
    auth_method?: string;
    [key: string]: unknown;
  } | null;
  created_at: string;
};

export type ActivityLogStats = {
  totalMutationsToday: number;
  mutationsTrendText?: string;
  isPositiveTrend?: boolean;
  activeAdminSessions: number;
  adminNamesText?: string;
  newDoctorVerifications: number;
  pendingVerificationsNote?: string;
  auditHashIntegrity: string;
  isHashValid?: boolean;
};

export type ActivityLogFilterState = {
  search: string;
  logName: string;
  causer: string;
};

export type ActivityLogContentProps = {
  logs: ActivityLogItemData[];
  stats: ActivityLogStats;
  filters: ActivityLogFilterState;
  pagination: ActivityLogPagination;
  onSearchChange: (search: string) => void;
  onLogNameChange: (logName: string) => void;
  onCauserChange: (causer: string) => void;
  onResetFilters: () => void;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};
