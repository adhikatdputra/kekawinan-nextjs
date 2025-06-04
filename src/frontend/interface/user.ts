export interface User {
  id: number;
  name: string;
  image: string;
  email: string;
  nrk: string;
  roles: Array<string>;
  activeRole: string;
  skpd: PDUK;
  uke: PDUK;
}

export interface PDUK {
  id: number;
  name: string;
}