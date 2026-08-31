export type SkinType = {
  uuid: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type SkinTypeListResponse = {
  data: SkinType[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};
