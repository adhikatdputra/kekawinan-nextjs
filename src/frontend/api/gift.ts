import axios from "@/lib/axios";
import { Params } from "../interface/undangan";

const giftApi = {
  // Public: all kado items for a wedding invitation page
  getPublic: (undanganId: string) => {
    return axios.get(`/kado/public/${undanganId}`);
  },
  // Public: single kado detail for the guest confirmation page
  getPublicDetail: (kadoId: string) => {
    return axios.get(`/kado/public/item/${kadoId}`);
  },
  // Auth: paginated kado list for the CMS
  getData: (undanganId: string, params: Params) => {
    return axios.get(`/undangan/${undanganId}/kado`, { params });
  },
  getDetail: (undanganId: string, kadoId: string) => {
    return axios.get(`/undangan/${undanganId}/kado/${kadoId}`);
  },
  create: (undanganId: string, formData: object) => {
    return axios.post(`/undangan/${undanganId}/kado`, formData);
  },
  update: (undanganId: string, kadoId: string, formData: object) => {
    return axios.put(`/undangan/${undanganId}/kado/${kadoId}`, formData);
  },
  remove: (undanganId: string, kadoId: string) => {
    return axios.delete(`/undangan/${undanganId}/kado/${kadoId}`);
  },
  // Public: guest confirms they will bring/send this kado item
  confirm: (kadoId: string, formData: object) => {
    return axios.patch(`/kado/public/confirm/${kadoId}`, formData);
  },
};

export default giftApi;
