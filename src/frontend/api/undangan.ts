import axios from "@/lib/axios";
import { UndanganBody } from "../interface/undangan";

const undanganApi = {
  getUndangan: () => {
    return axios.post(`/users/undangan/me`);
  },
  getUndanganOverview: (id: string) => {
    return axios.get(`/users/undangan/${id}/overview`);
  },
  getUndanganDetail: (id: string) => {
    return axios.get(`/users/undangan/${id}`);
  },
  createUndangan: (formData: UndanganBody) => {
    return axios.post(`/users/undangan/`, formData);
  },
  updateUndangan: (id: string, formData: UndanganBody) => {
    return axios.put(`/users/undangan/${id}`, formData);
  },
  deleteUndangan: (id: string) => {
    return axios.delete(`/users/undangan/${id}`);
  },
  getThemeUndangan: () => {
    return axios.get(`/users/theme-all?sortBy=createdAt&order=ASC`);
  },
};

export default undanganApi;
