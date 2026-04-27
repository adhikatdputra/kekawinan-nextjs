import axios from "@/lib/axios";
import { UndanganBody } from "../interface/undangan";

const undanganApi = {
  getUndangan: () => {
    return axios.get(`/undangan`);
  },
  getUndanganOverview: (id: string) => {
    return axios.get(`/undangan/${id}/overview`);
  },
  getUndanganDetail: (id: string) => {
    return axios.get(`/undangan/${id}`);
  },
  createUndangan: (formData: UndanganBody) => {
    return axios.post(`/undangan`, formData);
  },
  updateUndangan: (id: string, formData: UndanganBody) => {
    return axios.put(`/undangan/${id}`, formData);
  },
  deleteUndangan: (id: string) => {
    return axios.delete(`/undangan/${id}`);
  },
  getThemeUndangan: () => {
    return axios.get(`/theme/public?sortBy=createdAt&order=ASC`);
  },
};

export default undanganApi;
