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
