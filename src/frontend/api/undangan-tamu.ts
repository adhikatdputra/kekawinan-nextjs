import axios from "@/lib/axios";
import { Params } from "../interface/undangan";

const undanganTamuApi = {
  getData: (undanganId: string, params: Params) => {
    return axios.get(`/tamu/undangan/${undanganId}`, { params });
  },
  getStats: (undanganId: string) => {
    return axios.get(`/tamu/undangan/${undanganId}/stats`);
  },
  create: (formData: object) => {
    return axios.post(`/tamu`, formData);
  },
  update: (id: string, formData: object) => {
    return axios.put(`/tamu/${id}`, formData);
  },
  remove: (id: string) => {
    return axios.delete(`/tamu/${id}`);
  },
  sendWhatsapp: (id: string) => {
    return axios.put(`/tamu/${id}/send`);
  },
};

export default undanganTamuApi;
