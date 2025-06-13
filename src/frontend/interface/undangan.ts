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

export interface UndanganDetail {
  id: string;
  user_id: string;
  permalink: string;
  name: string;
  status: string;
  expired: string;
  theme_id: string;
  createdAt: string;
  updatedAt: string;
  undangan_content: UndanganContent;
  undangan_gift: Gift;
  undangan_gallery: UndanganGaleri[];
  ucapan: UndanganUcapan[];
  theme: Theme;
}

export interface UndanganContent {
  id: string;
  undangan_id: string;
  title: string;
  name_male: string;
  name_female: string;
  date_wedding: string;
  mother_female: string;
  father_female: string;
  mother_male: string;
  father_male: string;
  male_no: string;
  female_no: string;
  akad_time: string;
  akad_place: string;
  resepsi_time: string;
  resepsi_place: string;
  gmaps: string;
  stream_link: string;
  img_bg: string;
  img_male: string;
  img_female: string;
  img_thumbnail: string;
  music: string;
  is_covid: number;
  religion_version: string;
  createdAt: string;
  updatedAt: string;
}

export interface Gift {
  id: string;
  undangan_id: string;
  bank_name: string;
  name: string;
  bank_number: string;
  name_address: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface UndanganGaleriResponse {
  rows: UndanganGaleri[];
  count: number;
  current_page: number;
  page_size: number;
}

export interface UndanganGaleri {
  createdAt: string;
  id: string;
  image: string;
  undangan_id: string;
  updatedAt: string;
}

export interface Params {
  search?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  order?: string;
}

export interface UndanganUcapanResponse {
  rows: UndanganUcapan[];
  count: number;
  current_page: number;
  page_size: number;
}

export interface UndanganUcapan {
  undangan_id?: string;
  id?: string;
  name: string;
  message: string;
  attend: string;
  attend_total: number;
  is_show?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UndanganTamuResponse {
  rows: UndanganTamu[];
  count: number;
  current_page: number;
  page_size: number;
}

export interface UndanganTamu {
  id: string;
  undangan_id: string;
  name: string;
  phone: string;
  send_status: number;
  is_read: number;
  is_confirm: number;
  max_invite: number;
  createdAt: string;
  updatedAt: string;
}

