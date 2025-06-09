export interface UndanganBody {
  permalink: string;
  name: string;
  expired?: string;
  theme_id?: string;
}

export interface Undangan {
  id: string;
  user_id: string;
  permalink: string;
  name: string;
  status: string;
  expired: string;
  theme_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  id: string;
  name: string;
  thumbnail: string;
  component_name: string;
}
