import axios from "@/lib/axios";
import { Params } from "../interface/undangan";

const undanganTamuApi = {
  getData: (id: string, params: Params) => {
    return axios.get(`/users/tamu/slug/${id}`, { params });
  },
  create: (formData: FormData) => {
    return axios.post(`/users/tamu`, formData);
  },
  update: (id: string, formData: FormData) => {
    return axios.put(`/users/tamu/${id}`, formData);
  },
  remove: (id: string) => {
    return axios.delete(`/users/tamu/${id}`);
  },
  sendWhatsapp: (id: string) => {
    return axios.put(`/users/tamu/${id}/send`);
  },
  totalKirimWA: (id: string) => {
    return axios.get(`/users/tamu/send-wa/${id}`);
  },
};

export default undanganTamuApi;
