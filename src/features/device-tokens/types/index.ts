export type DeviceToken = {
  id: string;
  token: string;
  platform: string;
  device_name: string | null;
  created_at: string;
};

export type DeviceTokenListResponse = {
  data: DeviceToken[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};
