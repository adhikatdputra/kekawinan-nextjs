export interface UndanganBody {
  permalink: string;
  name: string;
  expired?: string;
  themeId?: string;
}

export interface Undangan {
  id: string;
  userId: string;
  permalink: string;
  name: string;
  status: string;
  expired: string;
  themeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  id: string;
  name: string;
  thumbnail: string;
  componentName: string;
  linkUrl: string;
  credit: number;
  promo: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UndanganDetail {
  id: string;
  userId: string;
  permalink: string;
  name: string;
  status: string;
  expired: string;
  themeId: string;
  createdAt: string;
  updatedAt: string;
  content: UndanganContent | null;
  gifts: UndanganGift[];
  gallery: UndanganGaleri[];
  ucapan: UndanganUcapan[];
  theme: Theme | null;
}

export interface UndanganContent {
  id: string;
  undanganId: string;
  title: string;
  nameMale: string;
  nameFemale: string;
  dateWedding: string;
  motherFemale: string;
  fatherFemale: string;
  motherMale: string;
  fatherMale: string;
  maleNo: string;
  femaleNo: string;
  akadTime: string;
  akadPlace: string;
  resepsiTime: string;
  resepsiPlace: string;
  gmaps: string;
  streamLink: string;
  imgBg: string;
  imgMale: string;
  imgFemale: string;
  imgThumbnail: string;
  music: string;
  isCovid: number;
  religionVersion: string;
  createdAt: string;
  updatedAt: string;
}

// UndanganGift: bank account entry for amplop digital
export interface UndanganGift {
  id: string;
  undanganId: string;
  bankName: string;
  name: string;
  bankNumber: string;
  nameAddress: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface UndanganGaleriResponse {
  rows: UndanganGaleri[];
  total_data: number;
  current_page: number;
  total_page: number;
}

export interface UndanganGaleri {
  id: string;
  undanganId: string;
  image: string;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

export interface Params {
  search?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  order?: string;
  sendStatus?: string;
  isRead?: string;
  isConfirm?: string;
}

export interface UndanganUcapanResponse {
  rows: UndanganUcapan[];
  total_data: number;
  current_page: number;
  total_page: number;
}

export interface UndanganUcapan {
  id?: string;
  undanganId?: string;
  name: string;
  message: string;
  attend: string;
  attendTotal: number;
  notAttendTotal?: number | null;
  maxInvite?: number | null;
  isShow?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UndanganTamuResponse {
  rows: UndanganTamu[];
  total_data: number;
  current_page: number;
  total_page: number;
}

export interface UndanganTamu {
  id: string;
  undanganId: string;
  name: string;
  phone: string;
  sendStatus: number;
  isRead: number;
  isConfirm: number;
  maxInvite: number;
  createdAt: string;
  updatedAt: string;
}

// Gift = kado / wishlist item
export interface Gift {
  id: string;
  undanganId: string;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  linkProduct: string;
  name: string;
  phone: string;
  isConfirm: number;
  createdAt: string;
  updatedAt: string;
}
