export type DeviceToken = {
  uuid: string;
  fcm_token: string;
  platform: string;
  created_at: string | null;
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
